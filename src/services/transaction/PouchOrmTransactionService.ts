import { TransactionCollection } from 'collection/TransactionCollection';

export const transactionService = new TransactionCollection();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.transactionService = transactionService;
