import { NavLink } from 'react-router-dom';
import React, { useState } from 'react';
import { importData } from 'services/DollarbirdCsvImporter';
import { dollarbirdCsvStr } from 'dollarbird';
import { transactionService } from 'services/transaction/PouchOrmTransactionService';
import HomeIcon from '@material-ui/icons/Home';
import { Box } from '@material-ui/core';

export function Import() {
  const [importing, setImport] = useState<boolean>(false);
  const [importMessage, setImportMessage] = useState<string>('');

  const importDefaultDataCallback = () => {
    setImport(true);
    importData(dollarbirdCsvStr).then(
      function () {
        setImportMessage('reloading db');
        transactionService.findOne({}).then((r) => {
          setImportMessage('Transactions imported, computing balance...');
          transactionService.getTotalBalance().then(function () {
            setImportMessage('balance calculated');
            setTimeout(() => setImportMessage(''), 2000);
            setImport(false);
          });
        });
      },
      function (err) {
        setImport(false);
        setImportMessage(err.toString);
      }
    );
  };
  if (importing || importMessage) {
    return <div>{importMessage || 'Importing...'}</div>;
  } else {
    return (
      <>
        <Box padding={1}>
          <NavLink to={'/'}>
            <HomeIcon />
          </NavLink>
        </Box>
        <Box padding={1}>
          <button onClick={importDefaultDataCallback}>Import Default data</button>
        </Box>
      </>
    );
  }
}
