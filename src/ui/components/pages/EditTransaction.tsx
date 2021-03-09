import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, Select, TextField } from '@material-ui/core';
import { usePromiseSafe } from 'ui/hooks/usePromiseSafe';
import { categoryDao } from 'services/category/CategoryService';
import { CategoryModel } from 'collection/CategoryCollection';
import { TransactionModel } from 'collection/TransactionCollection';
import { transactionService } from 'services/transaction/PouchOrmTransactionService';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type EditTransactionProps = {
  id: string;
};
export function EditTransaction({ id }: EditTransactionProps) {
  const [transaction, setTransaction] = useState<TransactionModel>({
    amount: 0,
    categoryId: '',
    confirmed: true,
    date: new Date().getTime(),
    description: '',
    label: '',
    walletId: ''
  });

  usePromiseSafe(transactionService.findById(id), setTransaction);
  const [categoryList, setCategoryList] = useState<CategoryModel[]>();
  usePromiseSafe(categoryDao.find({}), setCategoryList);
  useEffect(() => {
    if (transaction.categoryId === '' && categoryList && categoryList.length > 0) {
      transaction.categoryId = categoryList.filter((cat) => cat._id)[0]._id;
    }
  }, [categoryList, transaction]);
  return (
    <form noValidate autoComplete="off">
      <TextField id="label" label="Name" type={'text'} />
      <TextField id="amount" label="Amount" type={'number'} />
      <FormControl>
        <InputLabel htmlFor="category-input">Category</InputLabel>
        <Select
          native
          value={transaction.categoryId}
          onChange={(e) => {
            return (transaction.categoryId = e.target.value as string);
          }}
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
    </form>
  );
}
