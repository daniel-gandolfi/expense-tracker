import { LocalstorageDao } from "services/dao/LocalstorageDao";
import { Owner } from "model/Owner";

const ownerDao = new LocalstorageDao<Owner>("__OWNER__");

export const createOwner = ownerDao.create.bind(ownerDao);
export const getOwnerById = ownerDao.read.bind(ownerDao);
export const getAllOwners = ownerDao.readAll.bind(ownerDao);
export const deleteOwner = ownerDao.delete.bind(ownerDao);
export const updateOwner = ownerDao.update.bind(ownerDao);
