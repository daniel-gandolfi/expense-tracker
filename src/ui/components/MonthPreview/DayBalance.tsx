import { Typography, useMediaQuery } from '@material-ui/core';
import { formatMoneyLocal } from 'ui/utils/formatting';
import React from 'react';

type DayBalanceProps = { amount: number };

function getFontSizeByMoneyFormatted(moneyFormatted: string) {
  return '10px';
}

export function DayBalance({ amount }: DayBalanceProps) {
  const isSmall = useMediaQuery('sm');
  const moneyFormatted = formatMoneyLocal(amount / 100);

  return (
    <Typography
      variant={isSmall ? 'caption' : 'body2'}
      style={{ fontSize: getFontSizeByMoneyFormatted(moneyFormatted) }}>
      {moneyFormatted}
    </Typography>
  );
}
