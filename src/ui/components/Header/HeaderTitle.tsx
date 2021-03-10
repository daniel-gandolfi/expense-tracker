import { Route, Switch, useRouteMatch } from 'react-router-dom';
import {
  createMonthBalanceRoute,
  DAY_BALANCE_ROUTE,
  IMPORT_ROUTE,
  MONTH_BALANCE_ROUTE
} from 'ui/utils/routes';
import React, { memo, useState } from 'react';
import { makeStyles, Typography, Link, Box } from '@material-ui/core';
import { transactionDao } from 'dao/TransactionDao';
import { usePromiseSafe } from 'ui/hooks/usePromiseSafe';
import { formatMoneyLocal } from 'ui/utils/formatting';

function formatMonthForDayPage(date: Date) {
  return new Intl.DateTimeFormat(navigator.language || 'it_IT', {
    month: 'numeric',
    year: 'numeric'
  }).format(date);
}

function formatMonthDate(date: Date) {
  return new Intl.DateTimeFormat(navigator.language || 'it_IT', {
    month: 'long',
    year: 'numeric'
  }).format(date);
}

const useStyles = makeStyles(() => ({
  title: {
    flexGrow: 1
  }
}));
function DailyBalanceTitle() {
  const classes = useStyles();
  const routeMatch = useRouteMatch<{ monthParam: string; yearParam: string; dayParam: string }>(
    DAY_BALANCE_ROUTE
  );
  const year = routeMatch ? +routeMatch.params.yearParam : new Date().getFullYear();
  const month = routeMatch ? +routeMatch.params.monthParam : new Date().getMonth();
  const day = routeMatch ? +routeMatch.params.dayParam : new Date().getDate();
  const [dayBalance, setDayBalance] = useState<number>(0);

  usePromiseSafe(transactionDao.getBalanceForDay(year, month, day), setDayBalance, (x) =>
    // eslint-disable-next-line no-console
    console.error(x)
  );
  return (
    <Typography variant="h6" className={classes.title}>
      <Link color={'inherit'} href={createMonthBalanceRoute(year, month)} underline={'always'}>
        {formatMonthForDayPage(new Date(year, month))}
      </Link>
      <Box marginLeft={1} marginRight={1} component={'span'}>
        {day},
      </Box>
      ({formatMoneyLocal(dayBalance / 100)})
    </Typography>
  );
}

function MonthlyBalanceTitle() {
  const classes = useStyles();
  const routeMatch = useRouteMatch<{ monthParam: string; yearParam: string }>(MONTH_BALANCE_ROUTE);
  const year = routeMatch ? +routeMatch.params.yearParam : new Date().getFullYear();
  const month = routeMatch ? +routeMatch.params.monthParam : new Date().getMonth();
  const title = formatMonthDate(routeMatch ? new Date(year, month) : new Date());
  const [monthBalance, setMonthBalance] = useState<number>(0);

  usePromiseSafe(transactionDao.getBalanceForMonth(year, month), setMonthBalance, (x) =>
    // eslint-disable-next-line no-console
    console.error(x)
  );
  return (
    <Typography variant="h6" className={classes.title}>
      {title} ({formatMoneyLocal(monthBalance / 100)})
    </Typography>
  );
}

const ImportTitle = memo(function _ImportTitle() {
  const classes = useStyles();
  return (
    <Typography variant="h6" className={classes.title}>
      Import
    </Typography>
  );
});

export function HeaderTitle() {
  return (
    <Switch>
      <Route path={DAY_BALANCE_ROUTE}>
        <DailyBalanceTitle />
      </Route>
      <Route path={MONTH_BALANCE_ROUTE}>
        <MonthlyBalanceTitle />
      </Route>
      <Route path={IMPORT_ROUTE}>
        <ImportTitle />
      </Route>
    </Switch>
  );
}
