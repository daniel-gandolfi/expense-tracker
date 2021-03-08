import { Typography } from '@material-ui/core';
import { formatMoneyLocal } from 'ui/utils/formatting';
import React from 'react';
import { TransactionModel } from 'collection/TransactionCollection';

type DayTransactionListProps = {
  transactionList: TransactionModel[];
};
export function DayTransactionList({ transactionList }: DayTransactionListProps) {
  if (transactionList) {
    return (
      <>
        {transactionList.map((transaction) => (
          <Typography key={transaction._id} variant={'body2'}>
            <span>{formatMoneyLocal(transaction.amount / 100)}</span>
            &nbsp;
            <span>{transaction.label}</span>
          </Typography>
        ))}
      </>
    );
  } else {
    return null;
  }
}
