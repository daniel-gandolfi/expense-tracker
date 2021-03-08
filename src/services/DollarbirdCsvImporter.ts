import { categoryDao } from 'services/category/CategoryService';
import { CategoryColor } from 'model/Category';
import { ownerDao } from 'services/owner/OwnerService';
import { transactionService } from 'services/transaction/PouchOrmTransactionService';

export function importData(csvStr: string) {
  const transactionList = csvStr
    .split('\n')
    .slice(1)
    .map((rowString: string) => rowString.split(','))
    .map((rowSplitted: string[]) => {
      const categoryPromise = categoryDao
        .find({
          _id: rowSplitted[4]
        })
        .then((categoryList) => {
          if (categoryList.length !== 0) {
            return categoryList[0];
          } else {
            return categoryDao.upsert({
              _id: rowSplitted[4],
              color: CategoryColor.OLIVE
            });
          }
        })
        .then((category) => category._id || '');
      const ownerPromise = ownerDao
        .find({
          name: rowSplitted[6],
          email: rowSplitted[7]
        })
        .then((ownerList) => {
          if (ownerList.length !== 0) {
            return ownerList[0];
          } else {
            return ownerDao.upsert({
              name: rowSplitted[6],
              email: rowSplitted[7]
            });
          }
        })
        .then((owner) => owner._id || '');
      return { rowSplitted, categoryPromise, ownerPromise };
    })
    .map(({ rowSplitted, categoryPromise, ownerPromise }) => {
      const date = new Date(rowSplitted[0]);
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      return Promise.all([categoryPromise, ownerPromise]).then(function ([categoryId, ownerId]) {
        return {
          amount: Math.floor(+rowSplitted[1] * 100),
          categoryId,
          confirmed: Boolean(rowSplitted[3]),
          date: date.getTime(),
          description: rowSplitted[5],
          label: rowSplitted[2].substring(1, rowSplitted[2].length - 1),
          ownerId
        };
      });
    });
  return Promise.all(transactionList).then((transactionList) => {
    return transactionService.bulkUpsert(transactionList);
  });
}
