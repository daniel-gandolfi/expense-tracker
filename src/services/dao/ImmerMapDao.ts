import {
  AbstractDao,
  MinimalDaoElementInterface,
  ReactiveDao,
} from "services/dao/interfaces";
import produce, {
  enableMapSet,
  enablePatches,
  produceWithPatches,
} from "immer";
import { from, Subject } from "rxjs";
import { max, pluck, tap } from "rxjs/operators";

enableMapSet();
enablePatches();

export class ImmerMapDao<ElementType extends MinimalDaoElementInterface>
  implements AbstractDao<ElementType>, ReactiveDao<ElementType> {
  elementAdded$: Subject<ElementType> = new Subject();
  elementDeleted$: Subject<ElementType> = new Subject();
  elementUpdated$: Subject<[ElementType, ElementType]> = new Subject();

  private elementMap = new Map<number, ElementType>();
  private lastId = 0;

  constructor(elementList: ElementType[]) {
    const arrayStream = from(elementList);
    arrayStream.pipe(
      pluck("id"),
      max(),
      tap((maxId) => (this.lastId = maxId))
    );
    arrayStream.pipe(tap((el) => this.elementMap.set(el.id, el)));
  }

  private getId(): number {
    while (this.elementMap.has(this.lastId)) {
      ++this.lastId;
    }
    return this.lastId;
  }

  create(newElement: Omit<ElementType, "id">): ElementType {
    const newId = this.getId();
    const newElementWithId = {
      ...newElement,
      id: newId,
    } as ElementType;
    this.elementMap = produce((mapProxy) =>
      mapProxy.set(newId, newElementWithId)
    )(this.elementMap);
    this.elementAdded$.next(newElementWithId);
    return newElementWithId;
  }

  *readAll(): Iterable<ElementType> {
    const mapIterator = this.elementMap[Symbol.iterator]();
    for (const entry of mapIterator) {
      yield entry[1];
    }
  }

  read(id: number): ElementType | undefined {
    return this.elementMap.get(id);
  }

  update(id: number, update: Partial<ElementType>) {
    const currentValue = this.elementMap.get(id);
    if (!currentValue) {
      throw new Error("cannot update non existing value, use create instead");
    }

    const patch = produceWithPatches((mapProxy) =>
      mapProxy.set(id, {
        ...currentValue,
        update,
      })
    )(this.elementMap);
    this.elementMap = patch[0];

    const oldValue = patch[1][0].value;
    const newValue = patch[2][0].value;

    this.elementUpdated$.next([oldValue, newValue]);
    return newValue;
  }

  delete(id: number): ElementType | undefined {
    const patch = produceWithPatches((mapProxy) => {
      mapProxy.delete(id);
    })(this.elementMap);
    this.elementMap = patch[0];
    const oldValuePatch = patch[2];
    if (oldValuePatch && oldValuePatch.length !== 0) {
      const removedElement = oldValuePatch[0].value;
      this.elementDeleted$.next(removedElement);
      return removedElement;
    } else {
      throw new Error("Trying delete inexisting element");
    }
  }
}
