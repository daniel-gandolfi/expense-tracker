import {
  AbstractDao,
  MinimalDaoElementInterface,
} from "services/dao/AbstractDao";
import produce, {
  enableMapSet,
  enablePatches,
  produceWithPatches,
} from "immer";
import { from } from "rxjs";
import { max, pluck, tap } from "rxjs/operators";

enableMapSet();
enablePatches();

export class ImmerMapDao<ElementType extends MinimalDaoElementInterface>
  implements AbstractDao<ElementType> {
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
    return ++this.lastId;
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
    const newValue = {
      ...currentValue,
      update,
    } as ElementType;
    const patch = produceWithPatches((mapProxy) => mapProxy.set(id, newValue))(
      this.elementMap
    );this.elementMap = patch[0];
    return patch[2][0].value;
  }

  delete(id: number): ElementType | undefined {
    const patch = produceWithPatches((mapProxy) => {
      mapProxy.delete(id);
    })(this.elementMap);
    this.elementMap = patch[0];
    const newVarElement = patch[2];
    if (newVarElement) {
      return newVarElement[0].value;
    } else {
      throw new Error("Trying delete inexisting element");
    }
  }
}
