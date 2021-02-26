import {
  AbstractDao,
  MinimalDaoElementInterface,
} from "services/dao/interfaces";

const STANDARD_PREFIX = "DAO_";
const SEQUENCE_LAST_ID_SUFFIX = "LAST_ID";
const AVAILABLE_KEYS_SUFFIX = "AVAILABLE_KEYS";

function isValidElementName(elementName: string) {
  return elementName.trim().length > 0;
}

export class LocalstorageDao<ElementType extends MinimalDaoElementInterface>
  implements AbstractDao<ElementType> {
  private elementName = "";

  constructor(elementName: string) {
    if (!isValidElementName(elementName)) {
      throw new Error("invalid elementName");
    }
    this.elementName = elementName;
  }

  private generateNewID(): number {
    const lastIDGeneratedKey =
      STANDARD_PREFIX + this.elementName + SEQUENCE_LAST_ID_SUFFIX;

    const fromStorage = localStorage.getItem(lastIDGeneratedKey);
    const newID = fromStorage ? 1 + Number(fromStorage) : 0;
    localStorage.setItem(lastIDGeneratedKey, String(newID));

    return newID;
  }

  private setAllIds(ids: number[]) {
    localStorage.setItem(
      STANDARD_PREFIX + this.elementName + AVAILABLE_KEYS_SUFFIX,
      JSON.stringify(ids)
    );
  }

  private getAllIds(): number[] {
    const allKeysJSON = localStorage.getItem(
      STANDARD_PREFIX + this.elementName + AVAILABLE_KEYS_SUFFIX
    );
    return allKeysJSON ? (JSON.parse(allKeysJSON) || []) : [];
  }

  private createKeyForId(id: number): string {
    return STANDARD_PREFIX + this.elementName + id;
  }

  private setElement(id: number, el: ElementType) {
    localStorage.setItem(this.createKeyForId(id), JSON.stringify(el));
  }
  private getElement(id: number): ElementType | undefined {
    const element = localStorage.getItem(this.createKeyForId(id));
    return element ? JSON.parse(element) : element;
  }
  private deleteElement(id: number): ElementType | undefined {
    const elementKey = this.createKeyForId(id);
    const element = localStorage.getItem(elementKey);
    localStorage.removeItem(elementKey);
    return element ? JSON.parse(element) : element;
  }

  create(newElement: Omit<ElementType, "id">): ElementType {
    const newID = this.generateNewID();
    const generatedElement = {
      ...newElement,
      id: newID,
    } as ElementType;
    this.setElement(newID, generatedElement);
    this.setAllIds(this.getAllIds().concat([newID]));
    return generatedElement;
  }
  *readAll(): Iterable<ElementType> {
    for (const id of this.getAllIds()) {
      const readEl = this.read(id);
      if (readEl) {
        yield readEl;
      }
    }
  }

  read(id: number): ElementType | undefined {
    return this.getElement(id);
  }
  update(id: number, update: Partial<ElementType>) {
    const oldElement = this.getElement(id);
    if (oldElement) {
      const updatedElement = {
        ...oldElement,
        ...update,
      };
      this.setElement(id, updatedElement);
      return oldElement;
    } else {
      throw new Error("cannot update non existing element");
    }
  }
  delete(id: number): ElementType | undefined {
    const allIds = this.getAllIds();
    const idIndex = allIds.indexOf(id);
    if (idIndex === -1) {
      throw new Error("cannot delete id " + id + " in " + this.elementName);
    }
    allIds.splice(idIndex, 1);
    this.setAllIds(allIds);
    return this.deleteElement(id);
  }
}
