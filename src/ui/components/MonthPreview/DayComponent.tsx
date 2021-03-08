import { TransactionModel } from 'collection/TransactionCollection';
import { Box, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import { DayTransactionList } from 'ui/components/MonthPreview/DayTransactionList';
import { DayBalance } from 'ui/components/MonthPreview/DayBalance';
import React from 'react';
import { formatMoneyLocal } from 'ui/utils/formatting';

function transactionListBalanceReducer(total: number, transaction: TransactionModel) {
  return total + transaction.amount;
}

type DayComponentProps = {
  day: number;
  transactionList: TransactionModel[];
};
export function DayComponent({ day, transactionList }: DayComponentProps) {
  const theme = useTheme();
  const isScreenNotSmall = useMediaQuery(theme.breakpoints.up('sm'));
  const isScreenBiggerThanMedium = useMediaQuery(theme.breakpoints.up('md'));
  const dayBalance = transactionList ? transactionList.reduce(transactionListBalanceReducer, 0) : 0;
  const dayComponentBody = isScreenNotSmall ? (
    <DayTransactionList transactionList={transactionList} />
  ) : (
    <DayBalance amount={dayBalance} />
  );
  return (
    <>
      <Box>
        <Typography variant={'h6'} color="textSecondary" component={'span'}>
          {day} &nbsp;
        </Typography>
        {isScreenBiggerThanMedium && transactionList.length !== 0 ? (
          <Typography variant={'body1'} color="textSecondary" component={'span'}>
            {formatMoneyLocal(dayBalance / 100)}
          </Typography>
        ) : null}
      </Box>
      {dayComponentBody}
    </>
  );
}
