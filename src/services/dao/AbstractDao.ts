export interface MinimalDaoElementInterface {
  id: number;
}

export interface AbstractDao<
  DaoElementType extends MinimalDaoElementInterface
> {
  create(newElement: Omit<DaoElementType, "id">): DaoElementType;
  readAll(): Iterable<DaoElementType>;
  read(id: number): DaoElementType | undefined;
  update(id: number, update: Partial<DaoElementType>): DaoElementType;
  delete(id: number): DaoElementType | undefined;
}
