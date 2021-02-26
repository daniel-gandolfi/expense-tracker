import { Observable } from "rxjs";

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

export interface ReactiveDao<DaoElementType extends MinimalDaoElementInterface>
  extends AbstractDao<DaoElementType> {
  elementAdded$: Observable<DaoElementType>;
  elementDeleted$: Observable<DaoElementType>;
  elementUpdated$: Observable<[DaoElementType,DaoElementType]>;
}
