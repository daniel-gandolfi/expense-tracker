import React, { useState } from 'react';
import { importData } from 'services/DollarbirdCsvImporter';
import { dollarbirdCsvStr } from 'dollarbird';
import { Header } from 'ui/components/Header/Header';
import { usePromiseSafe } from 'ui/hooks/usePromiseSafe';
import { transactionService } from 'services/transaction/PouchOrmTransactionService';
import { ownerDao } from 'services/owner/OwnerService';
import { categoryDao } from 'services/category/CategoryService';
import {
  BrowserRouter as Router,
  Switch,
  Route,Redirect
} from "react-router-dom";
import {MonthBalance} from "ui/components/MonthBalance";

function App() {
  const [dateToShow, ] = useState<Date>(new Date());
  const [isDbInit, setDbInit] = useState<boolean>(false);
  const [importing, setImport] = useState<boolean>(false);
  const [importError, setImportError] = useState<string>('');
  usePromiseSafe(
    Promise.all([transactionService.afterInit(), ownerDao.afterInit(), categoryDao.afterInit()]),
    () => {
      setDbInit(true);
    }
  );

  const importDataCallback = () => {
    setImport(true);
    importData(dollarbirdCsvStr).then(
      function () {
        setImport(false);
      },
      function (err) {
        setImport(false);
        setImportError(err.toString);
      }
    );
  };
  if (isDbInit) {
    if (importing || importError) {
      return <div>{importError || 'Importing...'}</div>;
    } else {
      return (
        <>
          <Router>
            <button onClick={importDataCallback}>Import data</button>
            <Header month={dateToShow.getMonth()} year={dateToShow.getFullYear()} />

            <Switch>
              <Route path="/balance/byMonth/:year/:month" >
                <MonthBalance/>
              </Route>
              <Route path={"/"}>
                <Redirect to={`/balance/byMonth/${new Date().getFullYear()}/${new Date().getMonth()}`}/>
              </Route>
            </Switch>
          </Router>
        </>
      );
    }
  } else {
    return <div>Loading...</div>;
  }
}

export default App;
