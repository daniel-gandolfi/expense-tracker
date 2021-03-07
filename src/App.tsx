import React, { useState } from 'react';
import { importData } from 'services/DollarbirdCsvImporter';
import { dollarbirdCsvStr } from 'dollarbird';
import { MonthPreview } from 'ui/components/MonthPreview/MonthPreview';
import { Header } from 'ui/components/Header/Header';
import { usePromiseSafe } from 'ui/hooks/usePromiseSafe';
import { transactionService } from 'services/transaction/PouchOrmTransactionService';
import { ownerDao } from 'services/owner/OwnerService';
import { categoryDao } from 'services/category/CategoryService';

function App() {
  const todayDate = new Date();
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
        setImportError(err.toString)
      }
    );
  };
  if (isDbInit) {
    if (importing || importError) {
      return <div>{importError || 'Importing...'}</div>;
    } else {
      return (
        <>
          <button onClick={importDataCallback}>Import data</button>
          <Header month={todayDate.getMonth() - 1} year={todayDate.getFullYear()} />
          <MonthPreview month={todayDate.getMonth() - 1} year={todayDate.getFullYear()} />;
        </>
      );
    }
  } else {
    return <div>Loading...</div>;
  }
}

export default App;
