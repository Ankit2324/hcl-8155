import {add, subtract,multiply} from './math.js'
describe("Math Utility Testing",()=>{

    test('should add 2wo numbers',()=>{
        expect(add(10,20)).toBe(30);
    })

    test('should subtract 2wo numbers',()=>{
        expect(subtract(10,20)).toBe(-10);
    })

    test('should multiply 2wo numbers',()=>{
        expect(multiply(10,20)).toBe(200);
    })
}) 