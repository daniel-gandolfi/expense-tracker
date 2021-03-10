import React, { FormEventHandler, useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  FormGroup,
  Input,
  InputAdornment,
  InputLabel,
  Select,
  TextField
} from '@material-ui/core';
import { categoryDao } from 'services/category/CategoryService';
import { CategoryModel } from 'collection/CategoryCollection';
import { TransactionModel } from 'collection/TransactionCollection';
import { transactionService } from 'services/transaction/PouchOrmTransactionService';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import SaveIcon from '@material-ui/icons/Save';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { createEditTransactionRoute } from 'ui/utils/routes';

function useCategories() {
  const [categoryList, setCategoryList] = useState<CategoryModel[] | undefined>(undefined);
  useEffect(() => {
    if (categoryList == undefined) {
      categoryDao.find({}).then(setCategoryList);
    }
  }, [categoryList]);
  return categoryList;
}

function convertDateTimestampToDateInputValue(timestamp: number) {
  const date = new Date(timestamp);
  return [
    date.getFullYear(),
    (date.getMonth() + 1).toString().padStart(2, '0'),
    date.getDate().toString().padStart(2, '0')
  ].join('-');
}

function useTransaction(
  id?: string
): [TransactionModel, React.Dispatch<React.SetStateAction<TransactionModel>>] {
  const [transaction, setTransaction] = useState<TransactionModel>({
    _id: id,
    amount: 0,
    categoryId: '',
    confirmed: true,
    date: new Date().getTime(),
    description: '',
    label: '',
    walletId: ''
  });
  useEffect(() => {
    if (id) {
      transactionService.findById(id).then(setTransaction);
    }
  }, [id]);
  return [transaction, setTransaction];
}

function _isValidLabel(str: string) {
  return str.trim().length > 0;
}

function _isValidAmount(number: number) {
  return number > 0;
}

export function EditTransaction() {
  const routeMatch = useRouteMatch<{ id: string | undefined }>();
  const id = routeMatch ? routeMatch.params.id : '';
  const categoryList = useCategories();
  const [transaction, setTransaction] = useTransaction(id);
  const history = useHistory();
  useEffect(() => {
    if (transaction) {
      if (transaction.categoryId === '' && categoryList && categoryList.length > 0) {
        transaction.categoryId = categoryList.filter((cat) => cat._id)[0]._id;
      }
    }
  }, [categoryList, transaction]);

  const onChange = function <K extends keyof TransactionModel>(
    field: K,
    value: TransactionModel[K]
  ) {
    setTransaction({
      ...transaction,
      [field]: value
    });
  };

  const onFormSubmit: FormEventHandler<Element> = (event) => {
    if (_isValidLabel(transaction.label) && _isValidAmount(transaction.amount)) {
      const dateClean = new Date(transaction.date);
      dateClean.setMilliseconds(0);
      dateClean.setSeconds(0);
      dateClean.setMinutes(0);
      dateClean.setHours(0);
      transaction.date = dateClean.getTime();
      transactionService.upsert(transaction).then(function (insertedTransaction) {
        history.replace(createEditTransactionRoute(insertedTransaction._id));
        history.push('/');
      });
    }
    event.preventDefault();
  };

  const AmountSign = transaction.amount > 0 ? AddIcon : RemoveIcon;
  if (transaction && categoryList) {
    return (
      <form autoComplete="off" onSubmit={onFormSubmit}>
        <FormGroup row={true}>
          <TextField
            id="label"
            label="Name"
            type={'text'}
            onChange={(e) => onChange('label', e.target.value)}
            value={transaction.label}
            size={'medium'}
            error={!_isValidLabel(transaction.label)}
          />
          <Input
            id={'date'}
            type={'date'}
            onChange={(e) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              onChange('date', e.currentTarget.valueAsNumber);
            }}
            value={convertDateTimestampToDateInputValue(transaction.date)}
          />
        </FormGroup>
        <FormGroup row={true}>
          <TextField
            id="amount"
            label=""
            type={'number'}
            onChange={(e) => onChange('amount', +e.target.value * 100)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AmountSign onClick={() => onChange('amount', -1 * transaction.amount)} />
                </InputAdornment>
              )
            }}
            value={transaction.amount / 100}
            error={!_isValidAmount(transaction.amount)}
          />
        </FormGroup>

        <FormControl>
          <InputLabel htmlFor="category-input">Category</InputLabel>
          <Select
            native
            value={transaction.categoryId}
            onChange={(e) => onChange('categoryId', e.currentTarget.value as string)}
            inputProps={{
              name: 'category',
              id: 'category-input'
            }}>
            {(categoryList || []).map((category) => {
              return (
                <option key={category._id} value={category._id}>
                  {category._id}
                </option>
              );
            })}
          </Select>
        </FormControl>
        <FormGroup row={true}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<SaveIcon />}
            type={'submit'}>
            Save
          </Button>
        </FormGroup>
      </form>
    );
  } else {
    return null;
  }
}
