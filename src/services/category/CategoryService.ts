import { Category, CategoryWithoutId } from "model/Category";

const categoryMap = new Map<number, Category>();

let lastId = 0;
function _createId() {
  return ++lastId;
}

export function createCategory(category: CategoryWithoutId): Category {
  const id = _createId();
  const newCategory = {
    id,
    ...category,
  };
  categoryMap.set(id, newCategory);
  return newCategory;
}

export function getCategoryById(id: number): Category | undefined {
  return categoryMap.get(id);
}

export function getAllCategories(): IterableIterator<Category> {
  return categoryMap.values();
}

export function updateCategory(
  id: number,
  update: Partial<CategoryWithoutId>
): Category {
  const categoryStored = getCategoryById(id);
  if (!categoryStored) {
    throw new Error("Category not found");
  }
  const categoryUpdatedLocally = {
    ...categoryStored,
    update,
  };
  categoryMap.set(id, categoryUpdatedLocally);
  const categoryUpdated = getCategoryById(id);
  if (!categoryUpdated) {
    throw new Error("Category not found after update");
  }
  return categoryUpdated;
}
