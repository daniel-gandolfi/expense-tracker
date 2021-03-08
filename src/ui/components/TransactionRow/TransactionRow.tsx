import React, { useState } from 'react';
import { TransactionModel } from 'collection/TransactionCollection';
import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  useMediaQuery,
  useTheme
} from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { categoryDao } from 'services/category/CategoryService';
import { usePromiseSafe } from 'ui/hooks/usePromiseSafe';
import { Category } from 'collection/CategoryCollection';
import { formatMoneyLocal } from 'ui/utils/formatting';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { createEditTransactionRoute } from 'ui/utils/routes';
import { Link } from 'react-router-dom';

type TransactionRowProps = {
  transaction: TransactionModel;
};

export function TransactionRow({ transaction }: TransactionRowProps) {
  const theme = useTheme();
  const isScreenNotSmall = useMediaQuery(theme.breakpoints.up('sm'));
  const [transactionCategory, setTransactionCategory] = useState<Category>();
  usePromiseSafe(categoryDao.findById(transaction.categoryId), setTransactionCategory);

  return (
    <ListItem button>
      <ListItemIcon>
        {transactionCategory && <FiberManualRecordIcon htmlColor={transactionCategory.color} />}
      </ListItemIcon>
      <ListItemText
        primary={transaction.label}
        secondary={formatMoneyLocal(transaction.amount / 100)}
      />
      {isScreenNotSmall ? (
        <ListItemSecondaryAction>
          <IconButton edge="end" aria-label="edit">
            <Link to={createEditTransactionRoute(transaction._id)}>
              <EditIcon />
            </Link>
          </IconButton>
          <IconButton edge="end" aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      ) : null}
    </ListItem>
  );
}
