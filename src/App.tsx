import React, { useState } from 'react';
import { Header } from 'ui/components/Header/Header';
import { usePromiseSafe } from 'ui/hooks/usePromiseSafe';
import { transactionService } from 'services/transaction/PouchOrmTransactionService';
import { ownerDao } from 'services/owner/OwnerService';
import { categoryDao } from 'services/category/CategoryService';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { MonthBalance } from 'ui/components/pages/MonthBalance';
import {
  createMonthBalanceRoute,
  DAY_BALANCE_ROUTE,
  IMPORT_ROUTE,
  MONTH_BALANCE_ROUTE
} from 'ui/utils/routes';
import { Import } from 'ui/components/pages/Import';
import { DayBalance } from 'ui/components/pages/DayBalance';

function App() {
  const [isDbInit, setDbInit] = useState<boolean>(false);
  usePromiseSafe(
    Promise.all([transactionService.afterInit(), ownerDao.afterInit(), categoryDao.afterInit()]),
    () => {
      setDbInit(true);
    }
  );

  if (isDbInit) {
    return (
      <>
        <Router>
          <Header />
          <Switch>
            <Route path={DAY_BALANCE_ROUTE}>
              <DayBalance />
            </Route>
            <Route path={MONTH_BALANCE_ROUTE}>
              <MonthBalance />
            </Route>
            <Route path={IMPORT_ROUTE}>
              <Import />
            </Route>
            <Route path={'/'}>
              <Redirect
                to={createMonthBalanceRoute(new Date().getFullYear(), new Date().getMonth())}
              />
            </Route>
          </Switch>
        </Router>
      </>
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default App;
