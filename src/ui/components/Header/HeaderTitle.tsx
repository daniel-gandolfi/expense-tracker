import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { IMPORT_ROUTE, MONTH_BALANCE_ROUTE } from 'ui/utils/routes';
import React, { memo, useState } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { transactionService } from 'services/transaction/PouchOrmTransactionService';
import { usePromiseSafe } from 'ui/hooks/usePromiseSafe';
import { formatMoneyLocal } from 'ui/utils/formatting';

function formatDate(date: Date) {
  return new Intl.DateTimeFormat(navigator.language || 'it_IT', {
    month: 'long',
    year: 'numeric'
  }).format(date);
}

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1
  }
}));

function MonthlyBalanceTitle() {
  const classes = useStyles();
  const routeMatch = useRouteMatch<{ monthParam: string; yearParam: string }>(MONTH_BALANCE_ROUTE);
  const year = routeMatch ? +routeMatch.params.yearParam : new Date().getFullYear();
  const month = routeMatch ? +routeMatch.params.monthParam : new Date().getMonth();
  const title = formatDate(routeMatch ? new Date(year, month) : new Date());
  const [monthBalance, setMonthBalance] = useState<number>(0);

  usePromiseSafe(transactionService.getBalanceForMonth(year, month), setMonthBalance, (x) =>
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
      <Route path={MONTH_BALANCE_ROUTE}>
        <MonthlyBalanceTitle />
      </Route>
      <Route path={IMPORT_ROUTE}>
        <ImportTitle />
      </Route>
    </Switch>
  );
}
