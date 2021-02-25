import { LocalstorageDao } from "services/dao/LocalstorageDao";

type DaoElement = {
  id: number;
  label: string;
};

function deepEquals(a: any, b: any) {
  return JSON.stringify(a) === JSON.stringify(b);
}
const DEFAULT_ELEMENT_NAME = "daoTest";
const DEFAULT_CREATION_ELEMENT = {
  label: " ",
};

describe("LocalstorageDaoTests", () => {
  test("cannot instance without name ", () => {
    expect(() => new LocalstorageDao<DaoElement>("")).toThrow();
  });

  test("can instance with name", () => {
    expect(new LocalstorageDao<DaoElement>("test1")).toBeInstanceOf(
      LocalstorageDao
    );
  });

  test("get returns nothing", () => {
    const localstorageDao = new LocalstorageDao<DaoElement>(
      DEFAULT_ELEMENT_NAME
    );
    expect(localstorageDao.read(1)).toBeFalsy();
  });

  test("localstorageDao.create returns the new LocalstorageDao with an id", () => {
    const localstorageDao = new LocalstorageDao<DaoElement>(
      DEFAULT_ELEMENT_NAME
    );
    const localstorageDaoCreated = localstorageDao.create(
      DEFAULT_CREATION_ELEMENT
    );
    expect(localstorageDaoCreated).toBeTruthy();
    expect(localstorageDaoCreated.label).toBe(localstorageDaoCreated.label);
    expect(localstorageDaoCreated.id).not.toBeNull();
    expect(localstorageDaoCreated.id).not.toBeNaN();
    expect(localstorageDaoCreated.id).toBeDefined();
  });

  test("localstorageDao.readAll returns something", () => {
    const localstorageDao = new LocalstorageDao<DaoElement>(
      DEFAULT_ELEMENT_NAME
    );
    expect(localstorageDao.readAll()).toBeTruthy();
  });

  test("localstorageDao.readAll returns something after a creation", () => {
    const localstorageDao = new LocalstorageDao<DaoElement>(
      DEFAULT_ELEMENT_NAME
    );
    localstorageDao.create(DEFAULT_CREATION_ELEMENT);
    expect(localstorageDao.readAll()).toBeDefined();
  });

  test("localstorageDao.readAll returns an array containing the created LocalstorageDao", () => {
    const localstorageDao = new LocalstorageDao<DaoElement>(
      DEFAULT_ELEMENT_NAME
    );
    const LocalstorageDaoCreated = localstorageDao.create(
      DEFAULT_CREATION_ELEMENT
    );
    for (const anyLocalstorageDao of localstorageDao.readAll()) {
      if (anyLocalstorageDao.id === LocalstorageDaoCreated.id) {
        const equal = deepEquals(anyLocalstorageDao, LocalstorageDaoCreated);
        if (equal) {
          return Promise.resolve();
        } else {
          throw new Error(
            "LocalstorageDaoCreated has not the same fields after retrieval " +
              "LocalstorageDaoCreated: " +
              LocalstorageDaoCreated +
              " LocalstorageDaoFound: " +
              anyLocalstorageDao
          );
        }
      }
    }
    throw new Error(
      "created LocalstorageDao was not found in localstorageDao.readAll"
    );
  });

  test("localstorageDao.read returns undefined if requesting inexistent id", () => {
    const localstorageDao = new LocalstorageDao<DaoElement>(
      DEFAULT_ELEMENT_NAME
    );
    const existingIds = new Set<Number>();
    for (const anyLocalstorageDao of localstorageDao.readAll()) {
      existingIds.add(anyLocalstorageDao.id);
    }
    let randomId;
    while ((randomId = Math.round(Math.random() * 10000))) {
      if (!existingIds.has(randomId)) {
        expect(localstorageDao.read(randomId)).toBeFalsy();
        return;
      }
    }
  });

  test("localstorageDao.read returns the same LocalstorageDao after creation", () => {
    const localstorageDao = new LocalstorageDao<DaoElement>(
      DEFAULT_ELEMENT_NAME
    );
    const LocalstorageDaoCreated = localstorageDao.create(
      DEFAULT_CREATION_ELEMENT
    );
    const retrievedLocalstorageDao = localstorageDao.read(
      LocalstorageDaoCreated.id
    );
    expect(
      deepEquals(LocalstorageDaoCreated, retrievedLocalstorageDao)
    ).toBeTruthy();
  });
  test("localstorageDao.update returns the same LocalstorageDao after update", () => {
    const localstorageDao = new LocalstorageDao<DaoElement>(
      DEFAULT_ELEMENT_NAME
    );
    const LocalstorageDaoCreated = localstorageDao.create(
      DEFAULT_CREATION_ELEMENT
    );
    const retrievedLocalstorageDao = localstorageDao.read(
      LocalstorageDaoCreated.id
    );

    expect(retrievedLocalstorageDao).toBeDefined();
    if (retrievedLocalstorageDao) {
      const update1 = localstorageDao.update(retrievedLocalstorageDao.id, {
        label: "update1",
      });
      expect(
        deepEquals(update1, localstorageDao.read(update1.id))
      ).toBeTruthy();

      const update2 = localstorageDao.update(retrievedLocalstorageDao.id, {
        label: "update2",
      });
      expect(
        deepEquals(update2, localstorageDao.read(update1.id))
      ).toBeTruthy();
    }
  });

  test("localstorageDao.delete with no id should break", () => {
    const localstorageDao = new LocalstorageDao<DaoElement>(
      DEFAULT_ELEMENT_NAME
    );
    expect(localstorageDao.delete).toThrow();
  });

  test("localstorageDao.delete should delete after creation", () => {
    const localstorageDao = new LocalstorageDao<DaoElement>(
      DEFAULT_ELEMENT_NAME
    );
    const { id } = localstorageDao.create(DEFAULT_CREATION_ELEMENT);
    expect(localstorageDao.delete(id)).toBeTruthy();
    expect(localstorageDao.read(id)).toBeFalsy();
  });

  test("localstorageDao.delete returns the deleted element", () => {
    const localstorageDao = new LocalstorageDao<DaoElement>(
      DEFAULT_ELEMENT_NAME
    );
    const createdLocalstorageDao = localstorageDao.create(
      DEFAULT_CREATION_ELEMENT
    );
    const deletedLocalstorageDao = localstorageDao.delete(
      createdLocalstorageDao.id
    );
    expect(
      deepEquals(createdLocalstorageDao, deletedLocalstorageDao)
    ).toBeTruthy();
  });
});
