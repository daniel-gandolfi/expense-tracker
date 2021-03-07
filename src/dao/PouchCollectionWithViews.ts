import { PouchCollection } from 'pouchorm';
import PouchDB from 'pouchdb-browser';

type ReduceFn<T, Reduction> = PouchDB.Reducer<T, Reduction> | PouchDB.BuiltInReducers;

export type View<TableType, ResultType> = {
  name: string;
  map: PouchDB.Map<TableType, ResultType>;
};

export type ViewWithReducer<TableType, MappedType, Reduction> = {
  reduce: ReduceFn<TableType, Reduction>;
} & View<TableType, MappedType>;

export type ExecuteMapQueryFn<Model, Result> = (
  queryOpts?: PouchDB.Query.Options<Model, Result>
) => Promise<PouchDB.Query.Response<Result>>;

export type ExecuteReduceQueryFn<Model, Reduction> = (
  queryOpts?: PouchDB.Query.Options<Model, Reduction>
) => Promise<PouchDB.Query.Response<Reduction>>;

export type MapViewCreated<Model, Result> = {
  queryFn: ExecuteMapQueryFn<Model, Result>;
  observe: () => PouchDB.Core.Changes<Result>;
};
export type ReduceViewCreated<Model, Reduction> = {
  queryFn: ExecuteReduceQueryFn<Model, Reduction>;
  observe: () => PouchDB.Core.Changes<Reduction>;
};
type PouchDbView = {
  map: string;
  reduce?: string;
};

function createPouchDbMapView<TableType, ResultType>(v: View<TableType, ResultType>): PouchDbView {
  return {
    map: `function(doc) { return (${v.map.toString()})(doc,emit); }`
  };
}

function convertReducerToPouchDbFormat<ReducerInput, ReducerOutput>(
  reducer: ReduceFn<ReducerInput, ReducerOutput>
): string {
  if (typeof reducer === 'string') {
    return reducer;
  } else {
    return (function (keys, values, rereduce) {
      reducer(keys, values, rereduce);
    } as PouchDB.Reducer<ReducerInput, ReducerOutput>).toString();
  }
}

function createPouchDbReducedView<TableType, MappedType, Reduction>(
  v: ViewWithReducer<TableType, MappedType, Reduction>
): PouchDbView {
  return Object.assign(createPouchDbMapView(v), {
    reduce: convertReducerToPouchDbFormat(v.reduce)
  });
}

export class PouchCollectionWithViews<Element> extends PouchCollection<Element> {
  createMapView<ResultType>(
    namespace: string,
    view: View<Element, ResultType>
  ): MapViewCreated<Element, ResultType> {
    const viewId = namespace + view.name;
    this.db
      .put({
        _id: '_design/' + viewId,
        views: {
          [viewId]: createPouchDbMapView<Element, ResultType>(view)
        }
      })
      .then(function (res) {
        // eslint-disable-next-line no-console
        console.error('view created: ', res);
      })
      .catch(function (err) {
        if (err.name !== 'conflict') {
          // eslint-disable-next-line no-console
          console.error('cannot create view: ', view.name, ' with namespace ', namespace, err);
          throw err;
        }
        // ignore if doc already exists
      });
    return {
      queryFn: (queryOpts?) => {
        return this.db.query<ResultType, Element>(viewId + '/' + viewId, queryOpts);
      },
      observe: () => {
        return this.db.changes({
          filter: '_view',
          view: viewId
        });
      }
    };
  }
  createViewWithReducer<MappedType, ReducedValue>(
    namespace: string,
    view: ViewWithReducer<Element, MappedType, ReducedValue>
  ): ReduceViewCreated<Element, ReducedValue> {
    const viewId = namespace + view.name;
    this.db
      .put({
        _id: '_design/' + viewId,
        views: {
          [viewId]: createPouchDbReducedView<Element, MappedType, ReducedValue>(view)
        }
      })
      .catch(function (err) {
        if (err.name !== 'conflict') {
          throw err;
        }
        // ignore if doc already exists
      });
    return {
      queryFn: (queryOpts?) => {
        return this.db.query<ReducedValue, Element>(viewId + '/' + viewId, queryOpts);
      },
      observe: () => {
        return this.db.changes({
          filter: '_view',
          view: viewId
        });
      }
    };
  }
}
