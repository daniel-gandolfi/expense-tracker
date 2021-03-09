import { transactionService } from 'services/transaction/PouchOrmTransactionService';
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
    transactionService.getTotalBalance().then((balance) => expect(balance).toBe(0));
  }, 60000);
  test('createTransaction with no amount does not change balance', () => {
    transactionService.getTotalBalance().then((balanceBefore) => {
      transactionService
        .upsert(createTransactionModelWithoutId(new Date(), 0, '1', true, 0, '', 0))
        .then(function () {
          return transactionService.getTotalBalance();
        })
        .then((balanceAfter) => expect(balanceAfter).toBe(balanceBefore));
    });
  });
  test('createTransaction increases balance', () => {
    transactionService.getTotalBalance().then((balanceBefore) => {
      const transactionToCreate = createTransactionModelWithoutId(
        new Date(),
        1,
        '1',
        true,
        0,
        '',
        0
      );
      transactionService
        .upsert(transactionToCreate)
        .then(function () {
          return transactionService.getTotalBalance();
        })
        .then((balanceAfter) => {
          expect(balanceAfter).not.toBe(balanceBefore);
          expect(balanceBefore + transactionToCreate.amount).toBe(balanceAfter);
        });
    });
  });
  test('2 createTransaction increases balance', () => {
    transactionService.getTotalBalance().then((balanceBefore) => {
      const transaction1 = createTransactionModelWithoutId(new Date(), 3, '1', true, 0, '', 0);
      const transaction2 = createTransactionModelWithoutId(new Date(), 9, '2', true, 0, '', 0);
      Promise.all([
        transactionService.upsert(transaction1),
        transactionService.upsert(transaction2)
      ])
        .then(function () {
          return transactionService.getTotalBalance();
        })
        .then((balanceAfter) => {
          expect(balanceAfter).toBe(balanceBefore + transaction1.amount + transaction2.amount);
        });
    });
  });
  test('deleteTransaction changes balance', () => {
    Promise.all([
      transactionService.upsert(
        createTransactionModelWithoutId(new Date(), 3, '1', true, 0, '', 0)
      ),
      transactionService.upsert(createTransactionModelWithoutId(new Date(), 9, '2', true, 0, '', 0))
    ]).then(([transaction1Created]) => {
      expect(transaction1Created._id).toBeDefined();
      transactionService.getTotalBalance().then((balanceAfterAdd) => {
        if (transaction1Created._id) {
          transactionService
            .removeById(transaction1Created._id)
            .then(function () {
              return transactionService.getTotalBalance();
            })
            .then((balanceAfterRemove) => {
              expect(balanceAfterRemove).toBe(balanceAfterAdd - transaction1Created.amount);
            });
        }
      });
    });
  });
  test('updateTransaction to update the transaction', () => {
    transactionService
      .upsert(createTransactionModelWithoutId(new Date(), 3, '1', true, 0, '', 0))
      .then((transaction1Created) => {
        const newAmount = 1231231;
        transactionService
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
      transactionService.upsert(
        createTransactionModelWithoutId(new Date(), 3, '1', true, 0, '', 0)
      ),
      transactionService.upsert(createTransactionModelWithoutId(new Date(), 9, '2', true, 0, '', 0))
    ]).then(function ([transaction1Created]) {
      expect(transaction1Created._id).toBeDefined();
      transactionService.getTotalBalance().then((balanceAfterAdd) => {
        if (transaction1Created._id) {
          const newAmount = 1111;
          transactionService
            .upsert({ ...transaction1Created, amount: newAmount })
            .then(() => transactionService.getTotalBalance())
            .then((finalBalance) =>
              expect(finalBalance).toBe(balanceAfterAdd - transaction1Created.amount + newAmount)
            );
        }
      });
    });
  });
});
