import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, Select, TextField } from '@material-ui/core';
import { usePromiseSafe } from 'ui/hooks/usePromiseSafe';
import { categoryDao } from 'services/category/CategoryService';
import { Category } from 'collection/CategoryCollection';
import { TransactionModel } from 'collection/TransactionCollection';

type EditTransactionProps = {
  id: string;
};
export function EditTransaction({ id }: EditTransactionProps) {
  const transaction: TransactionModel = {
    amount: 0,
    categoryId: '',
    confirmed: true,
    date: new Date().getTime(),
    description: '',
    label: '',
    ownerId: ''
  };
  const [categoryList, setCategoryList] = useState<Category[]>();
  usePromiseSafe(categoryDao.find({}), setCategoryList);
  useEffect(() => {
    if (categoryList && categoryList.length > 0) {
      transaction.categoryId = categoryList.filter((cat) => cat._id)[0]._id;
    }
  }, [categoryList, transaction, transaction.categoryId === '']);
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
