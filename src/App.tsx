import React, { useState } from 'react';
import { importData } from 'services/DollarbirdCsvImporter';
import { dollarbirdCsvStr } from 'dollarbird';
import { MonthPreview } from 'ui/components/MonthPreview/MonthPreview';
import { Header } from 'ui/components/Header/Header';
import { usePromiseSafe } from 'ui/hooks/usePromiseSafe';
import { transactionService } from 'services/transaction/PouchOrmTransactionService';
import { ownerDao } from 'services/owner/OwnerService';
import { categoryDao } from 'services/category/CategoryService';
import Swipe from 'react-easy-swipe';

function App() {
  const [dateToShow, changeDateToShow] = useState<Date>(new Date());
  const [isDbInit, setDbInit] = useState<boolean>(false);
  const [importing, setImport] = useState<boolean>(false);
  const [importError, setImportError] = useState<string>('');
  usePromiseSafe(
    Promise.all([transactionService.afterInit(), ownerDao.afterInit(), categoryDao.afterInit()]),
    () => {
      setDbInit(true);
    }
  );

  function onSwipeRight() {
    const newMonth = dateToShow.getMonth() !== 0 ? dateToShow.getMonth() - 1 : 11;
    const newYear = newMonth !== 11 ? dateToShow.getFullYear() : dateToShow.getFullYear() - 1;
    changeDateToShow(new Date(newYear, newMonth));
  }

  function onSwipeLeft() {
    const newMonth = dateToShow.getMonth() !== 11 ? dateToShow.getMonth() + 1 : 0;
    const newYear = newMonth !== 0 ? dateToShow.getFullYear() : dateToShow.getFullYear() + 1;
    changeDateToShow(new Date(newYear, newMonth));
  }

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
          <button onClick={importDataCallback}>Import data</button>
          <Header month={dateToShow.getMonth()} year={dateToShow.getFullYear()} />
          <Swipe
            allowMouseEvents={true}
            tolerance={60}
            onSwipeLeft={onSwipeLeft}
            onSwipeRight={onSwipeRight}
            innerRef={(x) => {
              x;
            }}>
            <MonthPreview month={dateToShow.getMonth()} year={dateToShow.getFullYear()} />;
          </Swipe>
        </>
      );
    }
  } else {
    return <div>Loading...</div>;
  }
}

export default App;
