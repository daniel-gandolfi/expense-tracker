import {Transaction} from "model/Transaction";
import {ImmerMapDao} from "services/dao/ImmerMapDao";

const transactionDao = new ImmerMapDao<Transaction>(
  JSON.parse(localStorage.getItem("transactions") || "[]")
);

let balance = JSON.parse(localStorage.getItem("balance") || "0") || 0;
for (const transaction of transactionDao.readAll()) {
  balance += transaction.amount;
}
function setBalance(amount: number) {
  balance = amount;
  localStorage.setItem("balance", JSON.stringify(amount));
}
transactionDao.elementAdded$.subscribe(({ amount }) =>
  setBalance(balance + amount)
);
transactionDao.elementDeleted$.subscribe(({ amount }) =>
  setBalance(balance - amount)
);
transactionDao.elementUpdated$.subscribe(
  ([{ amount: amountBefore }, { amount: amountAfter }]) =>
    setBalance(balance - amountBefore + amountAfter)
);

export function getBalance() {
  return balance;
}

export const createTransaction = transactionDao.create.bind(transactionDao);
export const getTransactionById = transactionDao.read.bind(transactionDao);
export const getAllTransactions = transactionDao.readAll.bind(transactionDao);
export const deleteTransaction = transactionDao.delete.bind(transactionDao);
export const updateTransaction = transactionDao.update.bind(transactionDao);