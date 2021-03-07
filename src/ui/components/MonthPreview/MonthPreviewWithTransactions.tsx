import React, { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  GridList,
  GridListTile,
  Typography
} from '@material-ui/core';
import { groupBy } from 'lodash';
import {
  getDayArrayForMonth,
  MonthPreviewProps,
  singleDayFormatter
} from 'ui/components/MonthPreview/common';
import { transactionService } from 'services/transaction/PouchOrmTransactionService';
import { TransactionModel } from 'collection/TransactionCollection';
import { usePromiseSafe } from 'ui/hooks/usePromiseSafe';
import { formatMoneyLocal } from 'ui/utils/formatting';

type SingleDayProps = {
  year: number;
  month: number;
  day: number;
  transactionList: TransactionModel[];
};

function SingleDayWithTransactions({ year, month, day, transactionList }: SingleDayProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h4">
          {singleDayFormatter.format(new Date(year, month, day))}
        </Typography>
        {transactionList.map((transaction) => (
          <Typography variant="body2" key={transaction._id}>
            <span>{formatMoneyLocal(transaction.amount / 100)}</span>
            &nbsp;
            <span>{transaction.label}</span>
          </Typography>
        ))}
      </CardContent>
    </Card>
  );
}

export function MonthPreviewWithTransactions({ year, month }: MonthPreviewProps) {
  const [transactionForMonth, setTransactionForMonth] = useState<TransactionModel[]>();
  usePromiseSafe(
    transactionService.find({
      date: {
        $gte: new Date(year, month).getTime(),
        $lt: new Date(year, month + 1).getTime()
      }
    }),
    setTransactionForMonth
  );
  const dayList = useMemo(() => {
    const transactionByDay = groupBy(transactionForMonth, (t) => new Date(t.date).getDate());

    return getDayArrayForMonth(year, month).map(function (day) {
      return (
        <GridListTile key={day} cols={1} style={{ background: '#f5f5f5' }}>
          <SingleDayWithTransactions
            year={year}
            month={month}
            day={day}
            transactionList={transactionByDay[day] || []}
          />
        </GridListTile>
      );
    });
  }, [year, month, transactionForMonth]);

  return (
    <GridList cols={7} spacing={10}>
      {dayList}
    </GridList>
  );
}
