import {IModel} from "pouchorm";

export type Transaction = {
  date: Date;
  amount: number;
  label: string;
  confirmed: boolean;
  categoryId: number;
  description: string;
  ownerId: number;
} & IModel;

export function createTransactionModelWithoutId(
  date: Date,
  amount: number,
  label: string,
  confirmed: boolean,
  categoryId: number,
  description: string,
  ownerId: number
) {
  return {
    date,
    amount,
    label,
    confirmed,
    categoryId,
    description,
    ownerId,
  };
}
