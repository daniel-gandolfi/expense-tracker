import { IModel } from 'pouchorm';
import PouchDB from 'pouchdb-browser';
import findPlugin from 'pouchdb-find';
import { PouchCollectionWithViews, ReduceViewCreated } from 'dao/PouchCollectionWithViews';

export type TransactionModel = {
  date: number;
  amount: number;
  label: string;
  confirmed: boolean;
  categoryId: string;
  description: string;
  walletId: string;
} & IModel;

PouchDB.plugin(findPlugin);

const DEFAULT_NON_INITIALIZED_QUERY_RESPONSE = Promise.resolve(0);
type OptionalQueryResponse = undefined | Promise<PouchDB.Query.Response<number>>;
function getBalanceFromQueryResult(optionalQueryRes: OptionalQueryResponse): Promise<number> {
  return optionalQueryRes
    ? optionalQueryRes.then(function (res) {
        return res.rows.length !== 0 ? res.rows[0].value : 0;
      })
    : DEFAULT_NON_INITIALIZED_QUERY_RESPONSE;
}

export class TransactionCollection extends PouchCollectionWithViews<TransactionModel> {
  private readonly queryTotalBalanceByDay:
    | Promise<ReduceViewCreated<TransactionModel, number>>
    | undefined;
  private setQueryTotalBalanceByDay:
    | ((
        value:
          | PromiseLike<ReduceViewCreated<TransactionModel, number>>
          | ReduceViewCreated<TransactionModel, number>
      ) => void)
    | undefined;
  constructor() {
    super('transaction', {
      revs_limit: 1,
      auto_compaction: true,
      size: 1000
    });
    this.queryTotalBalanceByDay = new Promise<ReduceViewCreated<TransactionModel, number>>(
      (resolve) => {
        this.setQueryTotalBalanceByDay = resolve;
      }
    );
  }
  beforeInit() {
    if (this.setQueryTotalBalanceByDay) {
      this.setQueryTotalBalanceByDay(
        this.createViewWithReducer<number, number>('balance', {
          name: 'byDay',
          map: function (doc, emit) {
            const date = new Date(doc.date);
            if (emit) {
              const key = [
                date.getFullYear(),
                date.getMonth().toString().padStart(2, '0'),
                date.getDate().toString().padStart(2, '0')
              ].join('');
              emit(key, doc.amount);
            }
          },
          reduce: '_sum'
        })
      );
    }
    return Promise.all([
      this.queryTotalBalanceByDay,
      this.addIndex(['date'], 'dateIndex'),
      this.addIndex(['categoryId'], 'categoryIndex')
    ]).then(() => {
      // eslint-disable-next-line no-console
      console.error('db initialized');
      return Promise.resolve();
    });
  }

  getTotalBalance() {
    if (this.queryTotalBalanceByDay) {
      return this.queryTotalBalanceByDay.then((wrapper) =>
        getBalanceFromQueryResult(wrapper.queryFn())
      );
    } else {
      return DEFAULT_NON_INITIALIZED_QUERY_RESPONSE;
    }
  }

  getBalanceForYear(year: number): Promise<number> {
    const date = new Date(year);
    const startkey = year + date.getMonth().toString().padStart(2, '0') + '01';
    const endkey = year + 1 + date.getMonth().toString().padStart(2, '0') + '01';
    return this.queryTotalBalanceByDay
      ? this.queryTotalBalanceByDay.then((wrapper) =>
          getBalanceFromQueryResult(
            wrapper.queryFn({
              startkey,
              endkey
            })
          )
        )
      : DEFAULT_NON_INITIALIZED_QUERY_RESPONSE;
  }

  getBalanceForMonth(year: number, month: number): Promise<number> {
    if (this.queryTotalBalanceByDay) {
      return this.queryTotalBalanceByDay.then((wrapper) =>
        getBalanceFromQueryResult(
          wrapper.queryFn({
            startkey: year + '' + month.toString().padStart(2, '0') + '01',
            endkey: year + '' + (month + 1).toString().padStart(2, '0') + '01'
          })
        )
      );
    } else {
      return DEFAULT_NON_INITIALIZED_QUERY_RESPONSE;
    }
  }

  getBalanceForDay(year: number, month: number, day: number): Promise<number> {
    if (this.queryTotalBalanceByDay) {
      return this.queryTotalBalanceByDay.then((wrapper) =>
        getBalanceFromQueryResult(
          wrapper.queryFn({
            key: year + '' + month.toString().padStart(2, '0') + day.toString().padStart(2, '0')
          })
        )
      );
    } else {
      return DEFAULT_NON_INITIALIZED_QUERY_RESPONSE;
    }
  }
}
