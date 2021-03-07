import {IModel, PouchCollection} from 'pouchorm';
import PouchDB from 'pouchdb-browser';
import findPlugin from 'pouchdb-find';

export enum CategoryColor {
  BLACK = '#000000',
  RED = '#FF0000',
  GREEN = '#00FF00',
  BLU = '#0000FF',
  GRAY = '#888888',
  OLIVE = '#888800',
  CYAN = '#007788',
  PURPLE = '#770088'
}
export type Category = {
  name: string;
  color: CategoryColor;
} & IModel;

PouchDB.plugin(findPlugin);

export class CategoryCollection extends PouchCollection<Category> {
  constructor() {
    super('owner', {
      revs_limit: 1,
      auto_compaction: true
    });
  }
  beforeInit(): Promise<void> {
    return this.addIndex(['name']).then(() => {
      return super.beforeInit();
    });
  }
}
