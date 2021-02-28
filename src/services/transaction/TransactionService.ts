import { Transaction } from 'model/Transaction';
import { ImmerMapDao } from 'services/dao/ImmerMapDao';
import { from } from 'rxjs';
import {filter, reduce, shareReplay} from 'rxjs/operators';

const transactionDao = new ImmerMapDao<Transaction>(
  JSON.parse(localStorage.getItem('transactions') || '[]')
);

let balance = JSON.parse(localStorage.getItem('balance') || '0') || 0;
function setBalance(amount: number) {
  balance = amount;
  localStorage.setItem('balance', JSON.stringify(amount));
}

const keepConfirmedTransaction = filter<Transaction>((transaction) => transaction.confirmed);
const getBalanceFromTransactionStream = reduce<Transaction, number>(
  (total, { amount }) => total + amount,
  0
);

transactionDao.elementAdded$.subscribe(({ amount }) => setBalance(balance + amount));
transactionDao.elementDeleted$.subscribe(({ amount }) => setBalance(balance - amount));
transactionDao.elementUpdated$.subscribe(([{ amount: amountBefore }, { amount: amountAfter }]) =>
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
export function getBalanceForDay(day: number, month: number, year: number) {
  return from(transactionDao.readAll()).pipe(
    keepConfirmedTransaction,
    filter(
      (t) => t.date.getDate() == day && t.date.getMonth() === month && t.date.getFullYear() === year
    ),
    getBalanceFromTransactionStream,
      shareReplay(1)
  );
}
export function getBalanceForMonth(month: number, year: number) {
  return from(transactionDao.readAll()).pipe(
    keepConfirmedTransaction,

    filter((t) => t.date.getMonth() === month && t.date.getFullYear() === year),
    getBalanceFromTransactionStream,
      shareReplay(1)
  );
}
export function getBalanceForYear(year: number) {
  return from(transactionDao.readAll()).pipe(
    keepConfirmedTransaction,
    filter((t) => t.date.getFullYear() === year),
    getBalanceFromTransactionStream,
      shareReplay(1)
  );
}

export function getBalanceBetween(beginDateInclusive: Date, endDateExclusive: Date) {
  return from(transactionDao.readAll()).pipe(
    keepConfirmedTransaction,
    filter(
      (t) =>
        beginDateInclusive.getTime() > t.date.getTime() &&
        t.date.getTime() < endDateExclusive.getTime()
    ),
    getBalanceFromTransactionStream,
      shareReplay(1)
  );
}
