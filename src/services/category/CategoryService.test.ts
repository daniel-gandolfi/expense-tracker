import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "services/category/CategoryService";
import { CategoryColor } from "model/Category";

function deepEquals(a: any, b: any) {
  return JSON.stringify(a) === JSON.stringify(b);
}

describe("categoryTests", () => {
  test("createCategory returns something", () => {
    const categoryToCreate = {
      color: CategoryColor.BLU,
      name: "test",
    };
    const categoryCreated = createCategory(categoryToCreate);
    expect(categoryCreated).toBeTruthy();
  });

  test("getCategory returns nothing", () => {
    expect(getCategoryById(1)).toBeFalsy();
  });

  test("createCategory returns the new category with an id", () => {
    const categoryToCreate = {
      color: CategoryColor.RED,
      name: "test",
    };
    const categoryCreated = createCategory(categoryToCreate);
    expect(categoryCreated).toBeTruthy();
    expect(categoryCreated.color).toBe(categoryToCreate.color);
    expect(categoryCreated.name).toBe(categoryToCreate.name);
    expect(categoryCreated.id).not.toBeNull();
    expect(categoryCreated.id).not.toBeNaN();
    expect(categoryCreated.id).toBeDefined();
  });

  test("getAllCategories returns something", () => {
    expect(getAllCategories()).toBeTruthy();
  });

  test("getAllCategories returns something after a creation", () => {
    const categoryToCreate = {
      color: CategoryColor.OLIVE,
      name: "test",
    };
    createCategory(categoryToCreate);
    expect(getAllCategories()).toBeDefined();
  });

  test("getAllCategories returns an array containing the created category", () => {
    const categoryToCreate = {
      color: CategoryColor.OLIVE,
      name: "test",
    };
    const categoryCreated = createCategory(categoryToCreate);
    for (const anyCategory of getAllCategories()) {
      if (anyCategory.id === categoryCreated.id) {
        const equal = deepEquals(anyCategory, categoryCreated);
        if (equal) {
          return Promise.resolve();
        } else {
          throw new Error(
            "categoryCreated has not the same fields after retrieval " +
              "categoryCreated: " +
              categoryCreated +
              " categoryFound: " +
              anyCategory
          );
        }
      }
    }
    throw new Error("created category was not found in getAllCategories");
  });

  test("getCategoryById returns undefined if requesting inexistent id", () => {
    const existingIds = new Set<Number>();
    for (const anyCategory of getAllCategories()) {
      existingIds.add(anyCategory.id);
    }
    let randomId;
    while ((randomId = Math.round(Math.random() * 10000))) {
      if (!existingIds.has(randomId)) {
        expect(getCategoryById(randomId)).toBeFalsy();
        return;
      }
    }
  });

  test("getCategoryById returns the same category after creation", () => {
    const categoryToCreate = {
      color: CategoryColor.OLIVE,
      name: "test",
    };
    const categoryCreated = createCategory(categoryToCreate);
    const retrievedCategory = getCategoryById(categoryCreated.id);
    expect(deepEquals(categoryCreated, retrievedCategory)).toBeTruthy();
  });
  test("updateCategory returns the same category after update", () => {
    const categoryCreated = createCategory({
      color: CategoryColor.OLIVE,
      name: "test",
    });
    const retrievedCategory = getCategoryById(categoryCreated.id);

    expect(retrievedCategory).toBeDefined();
    if (retrievedCategory) {
      const update1 = updateCategory(retrievedCategory.id, {
        color: CategoryColor.BLACK,
      });
      expect(deepEquals(update1, getCategoryById(update1.id))).toBeTruthy();

      const update2 = updateCategory(retrievedCategory.id, {
        name: "test2",
      });
      expect(deepEquals(update2, getCategoryById(update1.id))).toBeTruthy();
    }
  });
});
