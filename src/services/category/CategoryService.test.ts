import {
  createCategory,
  getAllCategories,
  getCategoryById,
} from "services/category/CategoryService";
import { CategoryColor } from "model/Category";

describe("categoryTests", () => {
  test("createCategory returns something", () => {
    const categoryToCreate = {
      color: CategoryColor.BLU,
      name: "test",
    };
    const categoryCreated = createCategory(categoryToCreate);
    expect(categoryCreated).toBeTruthy();
  });

  test("getCategory returns something", () => {
    expect(getCategoryById(1)).toBeTruthy();
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
    expect(getAllCategories().next()).toBeDefined();
  });

  test("getAllCategories returns an array containing the created category", () => {
    const categoryToCreate = {
      color: CategoryColor.OLIVE,
      name: "test",
    };
    const categoryCreated = createCategory(categoryToCreate);
    for (const anyCategory of getAllCategories()) {
      if (anyCategory.id === categoryCreated.id) {
        if (
          anyCategory.name === categoryCreated.name &&
          anyCategory.color === categoryCreated.color
        ) {
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
        expect(getCategoryById(randomId)).toBeUndefined();
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
    expect(JSON.stringify(categoryCreated)).toBe(
      JSON.stringify(retrievedCategory)
    );
  });
});
