import { IModel, PouchCollection } from 'pouchorm';
import PouchDB from 'pouchdb-browser';
import findPlugin from 'pouchdb-find';

export type WalletModel = {
  _id: string; //name
  ownerIdList: string[];
} & IModel;

PouchDB.plugin(findPlugin);

export class WalletCollection extends PouchCollection<WalletModel> {
  constructor() {
    super('wallet', {
      revs_limit: 1,
      auto_compaction: true
    });
  }
}
