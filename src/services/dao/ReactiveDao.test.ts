import {ImmerMapDao} from "services/dao/ImmerMapDao";
import {ReactiveDao} from "services/dao/interfaces";

type TestType = {id:number, label: string}
describe("ReactiveDaoTests", () => {
    const immerMapDao : ReactiveDao<TestType>= new ImmerMapDao([]);
    test("creating element dispatches event", ()=> {
        immerMapDao.elementAdded$.subscribe(
            (el) => expect(el).toBeTruthy()
        );
        immerMapDao.create({label: "test"})
    })
    test("update element dispatches event", ()=> {
        const createdElement = immerMapDao.create({label: "testCreate"});
        immerMapDao.elementUpdated$.subscribe(
            (el) => {
                expect(el[0]).toBe(createdElement)
                expect(el[1].label).toBe("testUpdated")
            }
        );
        immerMapDao.update(createdElement.id, {label: "testUpdated"})
    })
    test("delete element dispatches event", ()=> {
        const createdElement = immerMapDao.create({label: "testCreate"});
        immerMapDao.elementAdded$.subscribe(
            (el) => expect(el).toBe(createdElement)
        );
        immerMapDao.delete(createdElement.id)
    })
})