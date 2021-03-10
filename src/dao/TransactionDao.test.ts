import { transactionDao } from './TransactionDao';
import { TransactionModel } from 'collection/TransactionCollection';

function createTransactionModelWithoutId(
  date: Date,
  amount: number,
  label: string,
  confirmed: boolean,
  categoryId: number | string,
  description: string,
  ownerId: number
): TransactionModel {
  return {
    date: date.getTime(),
    amount,
    label,
    confirmed,
    categoryId: categoryId.toString(),
    description,
    walletId: ownerId + ' Wallet'
  };
}
describe('Transaction balance Tests', () => {
  test('default balance is 0', () => {
    transactionDao.getTotalBalance().then((balance) => expect(balance).toBe(0));
  }, 60000);
  test('createTransaction with no amount does not change balance', () => {
    transactionDao.getTotalBalance().then((balanceBefore) => {
      transactionDao
        .upsert(createTransactionModelWithoutId(new Date(), 0, '1', true, 0, '', 0))
        .then(function () {
          return transactionDao.getTotalBalance();
        })
        .then((balanceAfter) => expect(balanceAfter).toBe(balanceBefore));
    });
  });
  test('createTransaction increases balance', () => {
    transactionDao.getTotalBalance().then((balanceBefore) => {
      const transactionToCreate = createTransactionModelWithoutId(
        new Date(),
        1,
        '1',
        true,
        0,
        '',
        0
      );
      transactionDao
        .upsert(transactionToCreate)
        .then(function () {
          return transactionDao.getTotalBalance();
        })
        .then((balanceAfter) => {
          expect(balanceAfter).not.toBe(balanceBefore);
          expect(balanceBefore + transactionToCreate.amount).toBe(balanceAfter);
        });
    });
  });
  test('2 createTransaction increases balance', () => {
    transactionDao.getTotalBalance().then((balanceBefore) => {
      const transaction1 = createTransactionModelWithoutId(new Date(), 3, '1', true, 0, '', 0);
      const transaction2 = createTransactionModelWithoutId(new Date(), 9, '2', true, 0, '', 0);
      Promise.all([transactionDao.upsert(transaction1), transactionDao.upsert(transaction2)])
        .then(function () {
          return transactionDao.getTotalBalance();
        })
        .then((balanceAfter) => {
          expect(balanceAfter).toBe(balanceBefore + transaction1.amount + transaction2.amount);
        });
    });
  });
  test('deleteTransaction changes balance', () => {
    Promise.all([
      transactionDao.upsert(createTransactionModelWithoutId(new Date(), 3, '1', true, 0, '', 0)),
      transactionDao.upsert(createTransactionModelWithoutId(new Date(), 9, '2', true, 0, '', 0))
    ]).then(([transaction1Created]) => {
      expect(transaction1Created._id).toBeDefined();
      transactionDao.getTotalBalance().then((balanceAfterAdd) => {
        if (transaction1Created._id) {
          transactionDao
            .removeById(transaction1Created._id)
            .then(function () {
              return transactionDao.getTotalBalance();
            })
            .then((balanceAfterRemove) => {
              expect(balanceAfterRemove).toBe(balanceAfterAdd - transaction1Created.amount);
            });
        }
      });
    });
  });
  test('updateTransaction to update the transaction', () => {
    transactionDao
      .upsert(createTransactionModelWithoutId(new Date(), 3, '1', true, 0, '', 0))
      .then((transaction1Created) => {
        const newAmount = 1231231;
        transactionDao
          .upsert({
            ...transaction1Created,
            amount: newAmount
          })
          .then((transaction1AfterUpdate) => {
            expect(transaction1Created.amount).not.toBe(transaction1AfterUpdate.amount);
            expect(transaction1AfterUpdate.amount).toBe(newAmount);
          });
      });
  });
  test('updateTransaction changes balance', () => {
    Promise.all([
      transactionDao.upsert(createTransactionModelWithoutId(new Date(), 3, '1', true, 0, '', 0)),
      transactionDao.upsert(createTransactionModelWithoutId(new Date(), 9, '2', true, 0, '', 0))
    ]).then(function ([transaction1Created]) {
      expect(transaction1Created._id).toBeDefined();
      transactionDao.getTotalBalance().then((balanceAfterAdd) => {
        if (transaction1Created._id) {
          const newAmount = 1111;
          transactionDao
            .upsert({ ...transaction1Created, amount: newAmount })
            .then(() => transactionDao.getTotalBalance())
            .then((finalBalance) =>
              expect(finalBalance).toBe(balanceAfterAdd - transaction1Created.amount + newAmount)
            );
        }
      });
    });
  });
});
