import { ImmerMapDao } from "services/dao/ImmerMapDao";
import { LocalstorageDao } from "services/dao/LocalstorageDao";

type DaoElement = {
  id: number;
  label: string;
};

function deepEquals(a: DaoElement | undefined, b: DaoElement | undefined) {
  if ((a === undefined && b === undefined) || (a === null && b === null)) {
    return true;
  }
  if (
    (a === undefined && b !== undefined) ||
    (a !== undefined && b === undefined)
  ) {
    return false;
  }
  if ((a === null && b !== null) || (a !== null && b === null)) {
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return a.id === b.id && a.label === b.label;
}
const DEFAULT_ELEMENT_NAME = "daoTest";
const DEFAULT_CREATION_ELEMENT = {
  label: " ",
};

const abstractDaoList = [
  {
    name: "LocalstorageDao",
    instance: new LocalstorageDao<DaoElement>(DEFAULT_ELEMENT_NAME),
  },
  {
    name: "ImmerMapDao",
    instance: new ImmerMapDao<DaoElement>([]),
  },
];
abstractDaoList.forEach((abstractDaoWrapper) => {
  const abstractDao = abstractDaoWrapper.instance;
  describe("testing " + abstractDaoWrapper.name, () => {
    test(
      abstractDaoWrapper.name + ".create returns the new element with an id",
      () => {
        const elementCreated = abstractDao.create(DEFAULT_CREATION_ELEMENT);
        expect(elementCreated).toBeTruthy();
        expect(elementCreated.label).toBe(elementCreated.label);
        expect(elementCreated.id).not.toBeNull();
        expect(elementCreated.id).not.toBeNaN();
        expect(elementCreated.id).toBeDefined();
      }
    );

    test(abstractDaoWrapper.name + ".readAll returns something", () => {
      expect(abstractDao.readAll()).toBeTruthy();
    });

    test(
      abstractDaoWrapper.name + ".readAll returns something after a creation",
      () => {
        abstractDao.create(DEFAULT_CREATION_ELEMENT);
        expect(abstractDao.readAll()).toBeDefined();
      }
    );

    test(
      abstractDaoWrapper.name +
        ".readAll returns an array containing the created element",
      () => {
        const createdElement = abstractDao.create(DEFAULT_CREATION_ELEMENT);
        for (const elementFound of abstractDao.readAll()) {
          if (elementFound.id === createdElement.id) {
            const equal = deepEquals(elementFound, createdElement);
            if (equal) {
              return Promise.resolve();
            } else {
              throw new Error(
                "createdElement has not the same fields after retrieval " +
                  "createdElement: " +
                  createdElement +
                  " elementFound: " +
                  elementFound
              );
            }
          }
        }
        throw new Error(
          "created AbstractDao was not found in abstractDao.readAll"
        );
      }
    );

    test(
      abstractDaoWrapper.name +
        ".read returns undefined if requesting inexistent id",
      () => {
        const existingIds = new Set<Number>();
        for (const element of abstractDao.readAll()) {
          existingIds.add(element.id);
        }
        let randomId;
        while ((randomId = Math.round(Math.random() * 10000))) {
          if (!existingIds.has(randomId)) {
            expect(abstractDao.read(randomId)).toBeFalsy();
            return;
          }
        }
      }
    );

    test(
      abstractDaoWrapper.name + ".read returns the same element after creation",
      () => {
        const createdElement = abstractDao.create(DEFAULT_CREATION_ELEMENT);
        const retrievedAbstractDao = abstractDao.read(createdElement.id);
        expect(deepEquals(createdElement, retrievedAbstractDao)).toBeTruthy();
      }
    );

    test(
      abstractDaoWrapper.name + ".update returns the same element after update",
      () => {
        const createdElement = abstractDao.create(DEFAULT_CREATION_ELEMENT);
        const retrievedElement = abstractDao.read(createdElement.id);

        expect(retrievedElement).toBeDefined();
        if (retrievedElement) {
          const update1 = abstractDao.update(retrievedElement.id, {
            label: "update1",
          });
          expect(
            deepEquals(update1, abstractDao.read(update1.id))
          ).toBeTruthy();

          const update2 = abstractDao.update(retrievedElement.id, {
            label: "update2",
          });
          const retrievedValueAfterUpdate = abstractDao.read(update1.id);
          expect(deepEquals(update2, retrievedValueAfterUpdate)).toBeTruthy();
        }
      }
    );

    test(abstractDaoWrapper.name + ".delete with no id should break", () => {
      expect(abstractDao.delete).toThrow();
    });

    test(
      abstractDaoWrapper.name + ".delete should delete after creation",
      () => {
        const { id } = abstractDao.create(DEFAULT_CREATION_ELEMENT);
        expect(abstractDao.delete(id)).toBeTruthy();
        expect(abstractDao.read(id)).toBeFalsy();
      }
    );

    test(
      abstractDaoWrapper.name + ".delete returns the deleted element",
      () => {
        const createdElement = abstractDao.create(DEFAULT_CREATION_ELEMENT);
        const deletedElement = abstractDao.delete(createdElement.id);
        expect(deepEquals(createdElement, deletedElement)).toBeTruthy();
      }
    );
  });
});
