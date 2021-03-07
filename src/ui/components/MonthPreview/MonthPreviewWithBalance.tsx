import React, { useMemo, useState } from 'react';
import { GridList, GridListTile } from '@material-ui/core';
import {
  getDayArrayForMonth,
  MonthPreviewProps,
  singleDayFormatter
} from 'ui/components/MonthPreview/common';
import { transactionService } from 'services/transaction/PouchOrmTransactionService';
import { usePromiseSafe } from 'ui/hooks/usePromiseSafe';

type SingleDayProps = {
  year: number;
  month: number;
  day: number;
};

function SingleDayWithBalance({ year, month, day }: SingleDayProps) {
  const [balanceForDay, setBalanceForDay] = useState<number>(0);
  usePromiseSafe(transactionService.getBalanceForDay(year, month, day), setBalanceForDay);

  return (
    <>
      <div>{singleDayFormatter.format(new Date(year, month, day))}</div>
      <div>{balanceForDay / 100}</div>
    </>
  );
}
export function MonthPreviewWithBalanceOnly({ year, month }: MonthPreviewProps) {
  const dayList = useMemo(() => getDayArrayForMonth(year, month), [year, month]).map((day) => (
    <GridListTile key={day} cols={1}>
      <SingleDayWithBalance key={day} year={year} month={month} day={day} />
    </GridListTile>
  ));

  return (
    <GridList cols={7} spacing={10}>
      {dayList}
    </GridList>
  );
}
