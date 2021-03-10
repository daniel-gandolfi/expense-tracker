import { TransactionCollection } from 'collection/TransactionCollection';

export const transactionDao = new TransactionCollection();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.transactionService = transactionDao;
