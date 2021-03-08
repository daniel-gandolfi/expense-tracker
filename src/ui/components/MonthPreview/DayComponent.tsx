import { TransactionModel } from 'collection/TransactionCollection';
import { Typography, useMediaQuery, useTheme } from '@material-ui/core';
import { DayTransactionList } from 'ui/components/MonthPreview/DayTransactionList';
import { DayBalance } from 'ui/components/MonthPreview/DayBalance';
import React from 'react';

function transactionListBalanceReducer(total: number, transaction: TransactionModel) {
  return total + transaction.amount;
}

type DayComponentProps = {
  day: number;
  transactionList: TransactionModel[];
};
export function DayComponent({ day, transactionList }: DayComponentProps) {
  const theme = useTheme();
  const isScreenBig = useMediaQuery(theme.breakpoints.up('sm'));
  const dayComponentBody = isScreenBig ? (
    <DayTransactionList transactionList={transactionList} />
  ) : (
    <DayBalance
      amount={transactionList ? transactionList.reduce(transactionListBalanceReducer, 0) : 0}
    />
  );
  return (
    <>
      <Typography variant={'body1'} color="textSecondary">
        {day}
      </Typography>
      {dayComponentBody}
    </>
  );
}
