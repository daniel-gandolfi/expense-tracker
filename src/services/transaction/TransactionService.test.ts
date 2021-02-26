import {
  createTransaction,
  deleteTransaction,
  getBalance, updateTransaction,
} from "services/transaction/TransactionService";
import { createTransactionModelWithoutId } from "model/Transaction";

describe("Transaction balance Tests", () => {
  test("default balance is 0", () => {
    expect(getBalance()).toBe(0);
  });
  test("createTransaction with no amount does not change balance", () => {
    const balanceBefore = getBalance();
    const transactionCreated = createTransactionModelWithoutId(
      new Date(),
      0,
      "1",
      true,
      0,
      "",
      0
    );
    createTransaction(transactionCreated);
    const balanceAfter = getBalance();
    expect(balanceAfter).toBe(balanceBefore);
  });
  test("createTransaction increases balance", () => {
    const balanceBefore = getBalance();
    const transactionCreated = createTransactionModelWithoutId(
      new Date(),
      1,
      "1",
      true,
      0,
      "",
      0
    );
    createTransaction(transactionCreated);
    const balanceAfter = getBalance();
    expect(balanceAfter).not.toBe(balanceBefore);
    expect(balanceBefore + transactionCreated.amount).toBe(balanceAfter);
  });
  test("2 createTransaction increases balance", () => {
    const balanceBefore = getBalance();
    const transaction1Created = createTransaction(
      createTransactionModelWithoutId(new Date(), 3, "1", true, 0, "", 0)
    );
    const transaction2Created = createTransaction(
      createTransactionModelWithoutId(new Date(), 9, "2", true, 0, "", 0)
    );
    expect(getBalance()).toBe(
      balanceBefore + transaction1Created.amount + transaction2Created.amount
    );
  });
  test("deleteTransaction changes balance", () => {
    const transaction1Created = createTransaction(
      createTransactionModelWithoutId(new Date(), 3, "1", true, 0, "", 0)
    );
    createTransaction(
      createTransactionModelWithoutId(new Date(), 9, "2", true, 0, "", 0)
    );
    const balanceAfterAdd = getBalance();
    deleteTransaction(transaction1Created.id);

    expect(getBalance()).toBe(balanceAfterAdd - transaction1Created.amount);
  });
  test("updateTransaction to update the transaction", () => {
    const transaction1Created = createTransaction(
      createTransactionModelWithoutId(new Date(), 3, "1", true, 0, "", 0)
    );
    const newAmount = 1231231;
    const transaction1AfterUpdate = updateTransaction(transaction1Created.id, {
      amount: newAmount,
    });

    expect(transaction1Created.amount).toBe(transaction1AfterUpdate.amount);
    expect(transaction1AfterUpdate.amount).not.toBe(newAmount);
  });
  test("updateTransaction changes balance", () => {
    const transaction1Created = createTransaction(
      createTransactionModelWithoutId(new Date(), 3, "1", true, 0, "", 0)
    );
    createTransaction(
      createTransactionModelWithoutId(new Date(), 9, "2", true, 0, "", 0)
    );
    const balanceAfterAdd = getBalance();

    const newAmount = 1111;
    updateTransaction(transaction1Created.id, {amount: newAmount});

    expect(getBalance()).toBe(balanceAfterAdd - transaction1Created.amount + newAmount);
  });
});
