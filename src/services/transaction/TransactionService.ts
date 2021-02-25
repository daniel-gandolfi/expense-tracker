import { LocalstorageDao } from "services/dao/LocalstorageDao";
import { Transaction } from "model/Transaction";

const transactionDao = new LocalstorageDao<Transaction>("__TRANSACTION__");

let balance = JSON.parse(localStorage.getItem("balance") || "0") || 0;
for (const transaction of transactionDao.readAll()) {
  balance += transaction.amount;
}
function setBalance(amount: number) {
  balance = amount;
  localStorage.setItem("balance", JSON.stringify(amount));
}
export function getBalance() {
  return balance;
}

export function createTransaction(transaction: Omit<Transaction, "id">) {
  const transactionCreated = transactionDao.create(transaction);
  setBalance(balance + transactionCreated.amount);
  return transactionCreated;
}
export function getTransactionById(id: number) {
  return transactionDao.read(id);
}
export function getAllTransactions() {
  return transactionDao.readAll();
}
export function deleteTransaction(id: number) {
  const transactionRemoved = transactionDao.delete(id);
  if (transactionRemoved) {
    setBalance(balance - transactionRemoved.amount);
  }
  return transactionRemoved;
}
export function updateTransaction(
  id: number,
  transaction: Partial<Transaction>
) {
  const transactionBeforeUpdate = getTransactionById(id);
  const transactionAfterUpdate = transactionDao.update(id, transaction);
  if (transactionBeforeUpdate) {
    setBalance(balance - transactionBeforeUpdate.amount);
  }
  setBalance(balance + transactionAfterUpdate.amount);
  return transactionAfterUpdate;
}
