import { IModel, PouchCollection } from 'pouchorm';
import PouchDB from 'pouchdb-browser';
import findPlugin from 'pouchdb-find';

//i have to remove this this, i'm not good with colors
export enum CategoryColor {
  WHITE = '#FFFFFF',
  LIGHT_GRAY_1 = '#E6E7E8',
  LIGHT_GRAY_2 = '#BCBEC0',
  LIGHT_GRAY_3 = '#939598',
  GRAY = '#6D6E71',
  DARK_GRAY_1 = '#414042',
  DARK_GRAY_2 = '#231F20',
  BLACK = '#000000',

  CREAM = '#FFFCBB',
  CANARY = '#FFF689',
  YELLOW = '#FDE74C',
  LIGHT_ORANGE = '#FFAD32',
  ORANGE_ALIVE = '#FF6B00',
  DEAD_ORANGE = '#DF8600',
  DARK_ORANGE = '#AF4319',
  PEACHY = '#FB9F82',
  VERMILLION = '#E03616',
  RED = '#FF0000',
  RED_DARK = '#AA0000',
  RED_ULTRA_DARK = '#660000',
  BORDEAUX = '#460000',

  WOODY_BROWN = '#A2742B',
  BROWN = '#573D1C',
  DARK_BROWN = '#32240D',

  GREEN = '#00FF00',
  MINT = '#00CF91',
  GREEN_DARK = '#00AA00',
  GREEN_ULTRA_DARK = '#006600',
  KAKI = '#748700',
  GREEN_ROTTEN = '#1E3C00',
  GREEN_SEA_WATER = '#004156',

  LIGHTEST_BLU = '#00FFFF',
  LIGHT_BLU = '#0077FF',
  BLU = '#0000FF',
  BLU_DARK = '#0000AA',
  BLU_ULTRA_DARK = '#000066',

  OLIVE = '#888800',

  LIGHT_VIOLET = '#A771FE',
  VIOLET = '#761CEA',
  DARK_VIOLET = '#3F0B81',
  PINKY_PURPLE = '#FD0079',
  PURPLE = '#7C3668',
  DARK_PURPLE = '#380438',
  PINK = '#F59BAF',
  PINK_SHINY = '#F375F3'
}

export type CategoryModel = {
  _id: string;
  color: CategoryColor;
} & IModel;

PouchDB.plugin(findPlugin);

export class CategoryCollection extends PouchCollection<CategoryModel> {
  constructor() {
    super('owner', {
      revs_limit: 1,
      auto_compaction: true
    });
  }
  beforeInit(): Promise<void> {
    return this.addIndex(['_id']).then(() => {
      return super.beforeInit();
    });
  }
}
