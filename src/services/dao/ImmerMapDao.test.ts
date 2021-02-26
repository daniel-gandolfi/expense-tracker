import { ImmerMapDao } from "services/dao/ImmerMapDao";

type DaoElement = {
  id: number;
  label: string;
};

function deepEquals(a: any, b: any) {
  return JSON.stringify(a) === JSON.stringify(b);
}
const DEFAULT_CREATION_ELEMENT = {
  label: " ",
};

describe("ImmerMapDaoTests", () => {
  test("cannot instance with initial value ", () => {
    expect(() => new ImmerMapDao<DaoElement>([])).toBeTruthy();
  });

  test("get returns nothing", () => {
    const immerMapDao = new ImmerMapDao<DaoElement>([]);
    expect(immerMapDao.read(1)).toBeFalsy();
  });

  test("immerMapDao.create returns the new ImmerMapDao with an id", () => {
    const immerMapDao = new ImmerMapDao<DaoElement>([]);
    const immerMapDaoCreated = immerMapDao.create(DEFAULT_CREATION_ELEMENT);
    expect(immerMapDaoCreated).toBeTruthy();
    expect(immerMapDaoCreated.label).toBe(immerMapDaoCreated.label);
    expect(immerMapDaoCreated.id).not.toBeNull();
    expect(immerMapDaoCreated.id).not.toBeNaN();
    expect(immerMapDaoCreated.id).toBeDefined();
  });

  test("immerMapDao.readAll returns something", () => {
    const immerMapDao = new ImmerMapDao<DaoElement>([]);
    expect(immerMapDao.readAll()).toBeTruthy();
  });

  test("immerMapDao.readAll returns something after a creation", () => {
    const immerMapDao = new ImmerMapDao<DaoElement>([]);
    immerMapDao.create(DEFAULT_CREATION_ELEMENT);
    expect(immerMapDao.readAll()).toBeDefined();
  });

  test("immerMapDao.readAll returns an array containing the created ImmerMapDao", () => {
    const immerMapDao = new ImmerMapDao<DaoElement>([]);
    const ImmerMapDaoCreated = immerMapDao.create(DEFAULT_CREATION_ELEMENT);
    for (const anyImmerMapDao of immerMapDao.readAll()) {
      if (anyImmerMapDao.id === ImmerMapDaoCreated.id) {
        const equal = deepEquals(anyImmerMapDao, ImmerMapDaoCreated);
        if (equal) {
          return Promise.resolve();
        } else {
          throw new Error(
            "ImmerMapDaoCreated has not the same fields after retrieval " +
              "ImmerMapDaoCreated: " +
              ImmerMapDaoCreated +
              " ImmerMapDaoFound: " +
              anyImmerMapDao
          );
        }
      }
    }
    throw new Error("created ImmerMapDao was not found in immerMapDao.readAll");
  });

  test("immerMapDao.read returns undefined if requesting inexistent id", () => {
    const immerMapDao = new ImmerMapDao<DaoElement>([]);
    const existingIds = new Set<Number>();
    for (const anyImmerMapDao of immerMapDao.readAll()) {
      existingIds.add(anyImmerMapDao.id);
    }
    let randomId;
    while ((randomId = Math.round(Math.random() * 10000))) {
      if (!existingIds.has(randomId)) {
        expect(immerMapDao.read(randomId)).toBeFalsy();
        return;
      }
    }
  });

  test("immerMapDao.read returns the same ImmerMapDao after creation", () => {
    const immerMapDao = new ImmerMapDao<DaoElement>([]);
    const ImmerMapDaoCreated = immerMapDao.create(DEFAULT_CREATION_ELEMENT);
    const retrievedImmerMapDao = immerMapDao.read(ImmerMapDaoCreated.id);
    expect(deepEquals(ImmerMapDaoCreated, retrievedImmerMapDao)).toBeTruthy();
  });
  test("immerMapDao.update returns the same ImmerMapDao after update", () => {
    const immerMapDao = new ImmerMapDao<DaoElement>([]);
    const ImmerMapDaoCreated = immerMapDao.create(DEFAULT_CREATION_ELEMENT);
    const retrievedImmerMapDao = immerMapDao.read(ImmerMapDaoCreated.id);

    expect(retrievedImmerMapDao).toBeDefined();
    if (retrievedImmerMapDao) {
      const update1 = immerMapDao.update(retrievedImmerMapDao.id, {
        label: "update1",
      });
      expect(deepEquals(update1, immerMapDao.read(update1.id))).toBeTruthy();

      const update2 = immerMapDao.update(retrievedImmerMapDao.id, {
        label: "update2",
      });
      expect(deepEquals(update2, immerMapDao.read(update1.id))).toBeTruthy();
    }
  });

  test("immerMapDao.delete with no id should break", () => {
    const immerMapDao = new ImmerMapDao<DaoElement>([]);
    expect(immerMapDao.delete).toThrow();
  });

  test("immerMapDao.delete should delete after creation", () => {
    const immerMapDao = new ImmerMapDao<DaoElement>([]);
    const { id } = immerMapDao.create(DEFAULT_CREATION_ELEMENT);
    expect(immerMapDao.delete(id)).toBeTruthy();
    expect(immerMapDao.read(id)).toBeFalsy();
  });

  test("immerMapDao.delete returns the deleted element", () => {
    const immerMapDao = new ImmerMapDao<DaoElement>([]);
    const createdImmerMapDao = immerMapDao.create(DEFAULT_CREATION_ELEMENT);
    const deletedImmerMapDao = immerMapDao.delete(createdImmerMapDao.id);
    expect(deepEquals(createdImmerMapDao, deletedImmerMapDao)).toBeTruthy();
  });
});
