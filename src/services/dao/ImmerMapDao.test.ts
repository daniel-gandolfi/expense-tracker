import { ImmerMapDao } from "services/dao/ImmerMapDao";

type DaoElement = {
  id: number;
  label: string;
};

describe("ImmerMapDaoTests", () => {
  test("can instance with initial value ", () => {
    expect(() => new ImmerMapDao<DaoElement>([])).toBeTruthy();
  });
});
