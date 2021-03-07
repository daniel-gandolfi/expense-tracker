import React, { useState } from 'react';
import { Container } from '@material-ui/core';
import { usePromiseSafe } from 'ui/hooks/usePromiseSafe';
import { transactionService } from 'services/transaction/PouchOrmTransactionService';
import {formatMoneyLocal} from "ui/utils/formatting";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat(navigator.language || 'it_IT', {
    month: 'long',
    year: 'numeric'
  }).format(date);
}

type HeaderProps = {
  month: number;
  year: number;
};

export function Header({ month, year }: HeaderProps) {
  const monthStartDate = new Date(year, month, 1, 0, 0, 0, 0);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  // eslint-disable-next-line no-console
  usePromiseSafe(transactionService.getTotalBalance(), setTotalBalance, (x) => console.log(x));
  return (
    <Container>
      <>
        <h1>{formatDate(monthStartDate)}</h1>
        <div>{formatMoneyLocal(totalBalance/100)}</div>
      </>
    </Container>
  );
}
