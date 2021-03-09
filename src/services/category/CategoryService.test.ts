import { CategoryColor } from 'collection/CategoryCollection';
import { categoryDao } from 'services/category/CategoryService';

function deepEquals(a: any, b: any) {
  return JSON.stringify(a) === JSON.stringify(b);
}
const DEFAULT_CREATION_ELEMENT = {
  color: CategoryColor.OLIVE,
  _id: 'test'
};

describe('categoryTests', () => {
  test('createCategory returns something', async () => {
    const categoryToCreate = {
      color: CategoryColor.BLU,
      _id: 'test'
    };
    const categoryCreated = await categoryDao.upsert(categoryToCreate);
    expect(categoryCreated).toBeTruthy();
  });

  test('getCategory returns nothing', () => {
    categoryDao.findById('1').then((res) => expect(res._id).toBeUndefined());
  });

  test('createCategory returns the new category with an id', () => {
    const categoryToCreate = {
      color: CategoryColor.RED,
      _id: 'test'
    };
    const categoryCreatedPromise = categoryDao.upsert(categoryToCreate);
    categoryCreatedPromise.then((categoryCreated) => {
      expect(categoryCreated).toBeTruthy();
      expect(categoryCreated.color).toBe(categoryToCreate.color);
      expect(categoryCreated._id).toBe(categoryToCreate._id);
      expect(categoryCreated._id).not.toBeNull();
      expect(categoryCreated._id).not.toBeNaN();
      expect(categoryCreated._id).toBeDefined();
    });
  });

  test('getAllCategories returns something', () => {
    categoryDao.find().then((res) => expect(res).toBeTruthy());
  });

  test('getAllCategories returns something after a creation', () => {
    const categoryToCreate = {
      color: CategoryColor.OLIVE,
      _id: 'test'
    };
    categoryDao.upsert(categoryToCreate).then(function (createdCategory) {
      categoryDao.find().then(function (res) {
        expect(res.length).toBe(1);
      });
    });
  });

  test('getAllCategories returns an array containing the created category', () => {
    categoryDao
      .upsert({
        color: CategoryColor.OLIVE,
        _id: 'test'
      })
      .then(function (categoryCreated) {
        categoryDao.find().then(function (transactionList) {
          for (const anyCategory of transactionList) {
            if (anyCategory._id === categoryCreated._id) {
              const equal = deepEquals(anyCategory, categoryCreated);
              if (equal) {
                return Promise.resolve();
              } else {
                throw new Error(
                  'categoryCreated has not the same fields after retrieval ' +
                    'categoryCreated: ' +
                    categoryCreated +
                    ' categoryFound: ' +
                    anyCategory
                );
              }
            }
          }
          throw new Error('created category was not found in getAllCategories');
        });
      });
  });

  test('getCategoryById returns the same category after creation', () => {
    const categoryToCreate = {
      color: CategoryColor.OLIVE,
      _id: 'test'
    };
    categoryDao.upsert(categoryToCreate).then(function (categoryCreated) {
      categoryDao.findById(categoryCreated._id || '').then((retrievedCategory) => {
        expect(deepEquals(categoryCreated, retrievedCategory)).toBeTruthy();
      });
    });
  });
  test('updateCategory returns the previous category after update', () => {
    categoryDao.upsert(DEFAULT_CREATION_ELEMENT).then(function (categoryCreated) {
      categoryDao.findById(categoryCreated._id || '').then(function (retrievedCategory) {
        expect(retrievedCategory).toBeDefined();
        if (retrievedCategory) {
          categoryDao
            .upsert({
              ...retrievedCategory,
              color: CategoryColor.BLACK
            })
            .then(function () {
              return categoryDao.findById(retrievedCategory._id || '').then(function (update1) {
                expect(deepEquals(update1, update1)).toBeFalsy();

                categoryDao
                  .upsert({
                    ...update1,
                    _id: 'test2'
                  })
                  .then(function (update2) {
                    expect(deepEquals(update2, update1)).toBeFalsy();
                  });
              });
            });
        }
      });
    });
  });

  test('deleteCategory should delete after creation', () => {
    categoryDao.upsert(DEFAULT_CREATION_ELEMENT).then(({ _id }) => {
      categoryDao.removeById(_id || '').then(function () {
        categoryDao.findById(_id || '').then((categoryAfterInsert) => {
          expect(categoryAfterInsert._id).toBeFalsy();
        });
      });
    });
  });

});
