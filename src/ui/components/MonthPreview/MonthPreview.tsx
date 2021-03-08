import React, { useMemo, useState } from 'react';
import { GridList, GridListTile } from '@material-ui/core';
import { getDayArrayForMonth, MonthPreviewProps } from 'ui/components/MonthPreview/common';
import { DayNameList } from 'ui/components/MonthPreview/DayNameList';
import { TransactionModel } from 'collection/TransactionCollection';
import { usePromiseSafe } from 'ui/hooks/usePromiseSafe';
import { transactionService } from 'services/transaction/PouchOrmTransactionService';
import { groupBy } from 'lodash';
import { DayComponent } from 'ui/components/MonthPreview/DayComponent';

export function MonthPreview({ year, month }: MonthPreviewProps) {
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
            <DayComponent day={day} transactionList={transactionByDay[day] || []} />
        </GridListTile>
      );
    });
  }, [year, month, transactionForMonth]);

  return (
    <>
      <DayNameList year={year} month={month} />
      <GridList cols={7} >{dayList}</GridList>
    </>
  );
}
