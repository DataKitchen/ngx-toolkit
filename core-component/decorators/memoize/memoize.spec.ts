import { Memoize } from './memoize';
import spyOn = jest.spyOn;

describe('@Memoize', () => {

  class TestClass {

    @Memoize
    testMemo(value: number): number {
      return this.doCalculation(value);
    }

    doCalculation(value: number): number {
      return value * 2;
    }

    @Memoize
    testMemoTwoArgs(value: number, prepend: string) {
      return `${prepend}-${this.doCalculation(value)}`;
    }

    @Memoize
    testArray(arr: number[]) {
      return this.sum(arr);
    }

    sum(arr: number[]) {
      return arr.reduce((acc, value) => acc += value, 0);
    }

    @Memoize
    testObject(obj: { a: number; b: string }) {
      return this.parseObject(obj);
    }

    parseObject(obj: { a: number; b: string }) {
      return `${obj.a * 2}-${obj.b}`;
    }

  }

  let instance: TestClass;

  beforeEach(() => {
    instance = new TestClass();

    spyOn(instance, 'doCalculation');
    spyOn(instance, 'sum');
    spyOn(instance, 'parseObject');
  });

  it('should memoize subsequent calls with same argument ', () => {
    const ret1 = instance.testMemo(0);
    const ret2 = instance.testMemo(0);
    expect(ret1).toEqual(ret2);
    expect(instance.doCalculation).toHaveBeenCalledTimes(1);

    const ret3 = instance.testMemo(1);
    const ret4 = instance.testMemo(1);
    expect(ret3).toEqual(ret4);
    expect(instance.doCalculation).toHaveBeenCalledTimes(2);

  });

  it('should still work with two argument', () => {
    const ret1 = instance.testMemoTwoArgs(0, 'a');
    const ret2 = instance.testMemoTwoArgs(0, 'a');
    expect(ret1).toEqual(ret2);
    expect(instance.doCalculation).toHaveBeenCalledTimes(1);

    const ret3 = instance.testMemoTwoArgs(0, 'b');
    const ret4 = instance.testMemoTwoArgs(0, 'b');
    expect(ret3).toEqual(ret4);
    expect(instance.doCalculation).toHaveBeenCalledTimes(2);

  });

  it('should still work with an array as argument', () => {
    const ret1 = instance.testArray([ 1, 2 ]);
    const ret2 = instance.testArray([ 1, 2 ]);
    expect(ret1).toEqual(ret2);
    expect(instance.sum).toHaveBeenCalledTimes(1);

    const ret3 = instance.testArray([ 1, 3 ]);
    const ret4 = instance.testArray([ 1, 3 ]);
    expect(ret3).toEqual(ret4);
    expect(instance.sum).toHaveBeenCalledTimes(2);

    // be aware [1, 4] != [4, 1]
    const ret5 = instance.testArray([ 1, 4 ]);
    const ret6 = instance.testArray([ 4, 1 ]);
    expect(ret5).toEqual(ret6);
    expect(instance.sum).toHaveBeenCalledTimes(4);
  });

  it('should work with an object as argument', () => {
    const ret1 = instance.testObject({a: 1, b: '2'});
    const ret2 = instance.testObject({a: 1, b: '2'});
    expect(ret1).toEqual(ret2);
    expect(instance.parseObject).toHaveBeenCalledTimes(1);

    const ret3 = instance.testObject({a: 1, b: '3'});
    const ret4 = instance.testObject({a: 1, b: '3'});
    expect(ret3).toEqual(ret4);
    expect(instance.parseObject).toHaveBeenCalledTimes(2);

  });
});
