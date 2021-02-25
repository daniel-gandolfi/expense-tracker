import { Category, CategoryWithoutId } from "model/Category";
import {LocalstorageDao} from "services/dao/LocalstorageDao";

const categoryDao = new LocalstorageDao<Category>("__CATEGORY__");

export const createCategory = categoryDao.create.bind(categoryDao);
export const getCategoryById = categoryDao.read.bind(categoryDao);
export const getAllCategories = categoryDao.readAll.bind(categoryDao);
export const deleteCategory = categoryDao.delete.bind(categoryDao);
export const updateCategory = categoryDao.update.bind(categoryDao);
