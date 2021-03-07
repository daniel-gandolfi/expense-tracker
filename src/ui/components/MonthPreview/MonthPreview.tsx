import React from 'react';
import { useMediaQuery, useTheme } from '@material-ui/core';
import { MonthPreviewWithTransactions } from 'ui/components/MonthPreview/MonthPreviewWithTransactions';
import { MonthPreviewWithBalanceOnly } from 'ui/components/MonthPreview/MonthPreviewWithBalance';
import { MonthPreviewProps } from 'ui/components/MonthPreview/common';

export function MonthPreview({ year, month }: MonthPreviewProps) {
  const theme = useTheme();
  const isScreenBig = useMediaQuery(theme.breakpoints.up('sm'));

  const MonthPreviewComponent = isScreenBig
    ? MonthPreviewWithTransactions
    : MonthPreviewWithBalanceOnly;
  return <MonthPreviewComponent year={year} month={month} />;
}
