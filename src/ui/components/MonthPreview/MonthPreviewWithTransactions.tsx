import React, { useMemo, useState } from 'react';
import { GridList, GridListTile } from '@material-ui/core';
import { groupBy } from 'lodash';
import {
  getDayArrayForMonth,
  MonthPreviewProps,
  singleDayFormatter
} from 'ui/components/MonthPreview/common';
import { transactionService } from 'services/transaction/PouchOrmTransactionService';
import { TransactionModel } from 'collection/TransactionCollection';
import { usePromiseSafe } from 'ui/hooks/usePromiseSafe';
import {formatMoneyLocal} from "ui/utils/formatting";

type SingleDayProps = {
  year: number;
  month: number;
  day: number;
  transactionList: TransactionModel[];
};

function SingleDayWithTransactions({ year, month, day, transactionList }: SingleDayProps) {
  return (
    <>
      <div>{singleDayFormatter.format(new Date(year, month, day))}</div>
      <div>
        {transactionList.map((transaction) => (
          <div key={transaction._id}>{transaction.label + ' ' + formatMoneyLocal(transaction.amount / 100)}</div>
        ))}
      </div>
    </>
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
        <GridListTile key={day} cols={1}>
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
