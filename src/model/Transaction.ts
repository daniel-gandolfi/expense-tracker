export type Transaction = {
  id: number;
  date: Date;
  amount: number;
  label: string;
  confirmed: boolean;
  categoryId: number;
  description: string;
  ownerId: number;
};

export function createTransactionModel(
  id: number,
  date: Date,
  amount: number,
  label: string,
  confirmed: boolean,
  categoryId: number,
  description: string,
  ownerId: number
) {
  return {
    ...createTransactionModelWithoutId(
      date,
      amount,
      label,
      confirmed,
      categoryId,
      description,
      ownerId
    ),
    id,
  };
}
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
