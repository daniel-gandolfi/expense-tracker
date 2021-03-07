import {IModel, PouchCollection} from 'pouchorm';
import PouchDB from 'pouchdb-browser';
import findPlugin from 'pouchdb-find';

export type OwnerModel = {
  name: string;
  email: string;
} & IModel;

PouchDB.plugin(findPlugin);

export class OwnerCollection extends PouchCollection<OwnerModel> {
  constructor() {
    super('owner', {
      revs_limit: 1,
      auto_compaction: true
    });
  }
}
