import { Typography } from '@material-ui/core';
import { formatMoneyLocal } from 'ui/utils/formatting';
import React from 'react';

type DayBalanceProps = { amount: number };
export function DayBalance({ amount }: DayBalanceProps) {
  return <Typography variant={'body2'}>{formatMoneyLocal(amount / 100)}</Typography>;
}
