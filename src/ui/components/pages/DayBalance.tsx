import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { transactionService } from 'services/transaction/PouchOrmTransactionService';
import { TransactionModel } from 'collection/TransactionCollection';
import { TransactionRow } from 'ui/components/TransactionRow/TransactionRow';
import { List } from '@material-ui/core';

export function DayBalance() {
  const { monthParam, yearParam, dayParam } = useParams<{
    monthParam: string;
    yearParam: string;
    dayParam: string;
  }>();
  const year = yearParam ? +yearParam : new Date().getFullYear();
  const month = monthParam ? +monthParam : new Date().getMonth();
  const day = dayParam ? +dayParam : new Date().getDate();
  const [transactionForDay, setTransactionForDay] = useState<TransactionModel[]>();
  useEffect(() => {
    if (transactionForDay === undefined) {
      transactionService
        .find({
          date: {
            $eq: new Date(year, month, day).getTime()
          }
        })
        .then(setTransactionForDay);
    }
  }, [transactionForDay]);

  return (
    <List>
      {(transactionForDay || []).map(function (transaction) {
        return <TransactionRow key={transaction._id} transaction={transaction} />;
      })}
    </List>
  );
}
