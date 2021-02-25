import { Category, CategoryWithoutId } from "model/Category";
import {LocalstorageDao} from "services/dao/LocalstorageDao";

const categoryMap = new Map<number, Category>();

const categoryDao = new LocalstorageDao<Category>("__CATEGORY__");

export function createCategory(category: CategoryWithoutId): Category {
  return categoryDao.create(category);
}

export function getCategoryById(id: number): Category | undefined {
  return categoryDao.read(id);
}

export function getAllCategories(): Iterable<Category> {
  return categoryDao.readAll();
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
