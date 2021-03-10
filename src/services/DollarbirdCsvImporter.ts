import { categoryDao, randomColorSequenceGenerator } from 'dao/CategoryDao';
import { ownerDao } from 'dao/OwnerDao';
import { transactionDao } from 'dao/TransactionDao';
import { CategoryColor, ColorKey } from 'collection/CategoryCollection';
import { walletDao } from 'dao/WalletDao';

function importDollarbirdString(str: string) {
  if (str.length > 2) {
    return str.substring(1, str.length - 1);
  } else {
    return str;
  }
}
type IntermediateResult = {
  insertDate: Date;
  amount: number;
  label: string;
  confirmed: boolean;
  categoryName: string;
  description: string;
  ownerName: string;
  ownerMail: string;
};

function createWalletIdForOwner(ownerName: string) {
  return ownerName + ' Wallet';
}

function createDerivatedMaps(intermediateResult: IntermediateResult[]) {
  //map to return
  const ownerMap: Record<string, { name: string; email: string }> = {};
  const walletMap: Record<string, { name: string; ownerList: string[] }> = {};
  const categoryMap: Record<string, { name: string; colorKey: ColorKey }> = {};
  // map to speed up
  const walletListByOwnerEmail: Record<string, string[]> = {};
  const randomColorGenerator = randomColorSequenceGenerator();

  intermediateResult.forEach(function ({ ownerMail, ownerName, categoryName }) {
    ownerMap[ownerMail] = {
      email: ownerMail,
      name: ownerName
    };

    categoryMap[categoryName] = {
      name: categoryName,
      colorKey: randomColorGenerator.next().value
    };

    const walletId = createWalletIdForOwner(ownerName);
    if (!walletListByOwnerEmail[ownerMail]) {
      walletMap[walletId] = {
        name: walletId,
        ownerList: [ownerMail]
      };
      walletListByOwnerEmail[ownerMail] = [walletId];
    } else {
      // strange bahaviour but i shall create another wallet
      if (!walletListByOwnerEmail[ownerMail].includes(walletId)) {
        walletMap[walletId] = {
          name: walletId,
          ownerList: [ownerMail]
        };
        walletListByOwnerEmail[ownerMail] = walletListByOwnerEmail[ownerMail].concat([walletId]);
      }
    }
  });

  return {
    ownerMap,
    walletMap,
    categoryMap
  };
}

export function importData(csvStr: string) {
  const intermediateResultList: IntermediateResult[] = csvStr
    .split('\n')
    .slice(1)
    .map((rowString: string) => {
      const rowSplitted = rowString.split(',');
      const insertDate = new Date(rowSplitted[0]);
      insertDate.setHours(0);
      insertDate.setMinutes(0);
      insertDate.setSeconds(0);
      insertDate.setMilliseconds(0);
      return {
        insertDate,
        amount: Math.floor(+rowSplitted[1] * 100),
        label: importDollarbirdString(rowSplitted[2]),
        confirmed: Boolean(rowSplitted[3]),
        categoryName: importDollarbirdString(rowSplitted[4]),
        description: importDollarbirdString(rowSplitted[5]),
        ownerName: importDollarbirdString(rowSplitted[6]),
        ownerMail: importDollarbirdString(rowSplitted[7])
      };
    });
  const { walletMap, ownerMap, categoryMap } = createDerivatedMaps(intermediateResultList);

  const insertCategoryPromiseList = Object.values(categoryMap).map(function ({ name, colorKey }) {
    return categoryDao.upsert({
      _id: name,
      color: CategoryColor[colorKey]
    });
  });
  const insertOwnerPromiseList = Object.values(ownerMap).map(function ({ name, email }) {
    return ownerDao.upsert({
      _id: email,
      name
    });
  });
  const insertWalletPromiseList = Object.values(walletMap).map(function ({ name, ownerList }) {
    return walletDao.upsert({
      _id: name,
      ownerIdList: ownerList
    });
  });

  const transactionList = intermediateResultList.map((intermediateResult) => {
    return {
      amount: intermediateResult.amount,
      categoryId: intermediateResult.categoryName,
      confirmed: intermediateResult.confirmed,
      date: intermediateResult.insertDate.getTime(),
      description: intermediateResult.description,
      label: intermediateResult.label,
      walletId: createWalletIdForOwner(intermediateResult.ownerName)
    };
  });

  return Promise.all([
    Promise.all(insertCategoryPromiseList),
    Promise.all(insertOwnerPromiseList),
    Promise.all(insertWalletPromiseList),
    transactionDao.bulkUpsert(transactionList)
  ]);
}
