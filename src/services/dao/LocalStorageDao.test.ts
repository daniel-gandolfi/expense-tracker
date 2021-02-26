import { LocalstorageDao } from "services/dao/LocalstorageDao";

type DaoElement = {
  id: number;
  label: string;
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
});
