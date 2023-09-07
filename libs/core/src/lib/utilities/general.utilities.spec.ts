<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { caseInsensitiveIncludes, isValidDate, parseDate } from './general.utilities';
=======
import { caseInsensitiveIncludes, isObject, omit, parseDate, pick } from './general.utilities';
>>>>>>> f6ff16e (test(core): add tests for pick, omit, isObject utilities)
=======
import { caseInsensitiveIncludes, isValidDate, isObject, omit, parseDate, pick, stringify } from './general.utilities';
>>>>>>> 4cdf9ee (fix: safely handle null/undefined and stringify values in webhook action)
=======
import { caseInsensitiveIncludes, isValidDate, isObject, omit, parseDate, pick, stringify, difference, removeDuplicates, beginningOfDay } from './general.utilities';
>>>>>>> 95e4ece (test: increate test coverage)

describe('general-utilities', () => {

  describe('caseInsensitiveIncludes()', () => {
    it('should return true only if specified string exists in array, ignoring case', () => {
      const search = 'sEarCH';
      const trueArray = [ 'search', 'hello' ];
      const falseArray = [ 'searching', 'hello' ];

      expect(caseInsensitiveIncludes(trueArray, search)).toBe(true);
      expect(caseInsensitiveIncludes(falseArray, search)).toBe(false);
    });

    it('should return false if specified value is null', () => {
      const search = null;
      const testArray = [ 'search', null ];

      // @ts-ignore
      expect(caseInsensitiveIncludes(testArray, search)).toBe(false);
    });

    it('should ignore null items in the array', () => {
      const search = 'sEarCH';
      const testArray = [ null, 'search' ];

      // @ts-ignore
      expect(caseInsensitiveIncludes(testArray, search)).toBe(true);
    });

    it('should return true only if specified string is a substring, ignoring case', () => {
      const search = 'sEarCH';
      const trueString = 'searchinG';
      const falseString = 'hello';

      expect(caseInsensitiveIncludes(trueString, search)).toBe(true);
      expect(caseInsensitiveIncludes(falseString, search)).toBe(false);
    });
  });

  describe('parseDate()', () => {
    it('should add UTC padding to the ISO string', () => {
      expect((parseDate('2019-08-24T14:15:22') as Date).toISOString()).toBe('2019-08-24T14:15:22.000Z');
    });

    it('should ignore date objects', () => {
      const date = new Date();
      expect(parseDate(date as any)).toBe(date);
    });
  });

<<<<<<< HEAD
  describe('isValidDate', () => {
    it('should return true if a valid date is passed in input', () => {
      expect(isValidDate(new Date())).toBeTruthy();
    });

    it('should return false if no valid date is passed in input', () => {
      expect(isValidDate(3)).toBeFalsy();
=======
  describe('isObject', () => {
    it('should return true if the input value is an object', () => {
      const input = { test: 'test' };
      expect(isObject(input)).toBeTruthy();
    });

    it('should return true if the input value is a function', () => {
      const input = () => {
        return 'test';
      };
      expect(isObject(input)).toBeTruthy();
    });

    it('should return false if the input is null', () => {
      const input = null;
      expect(isObject(input)).toBeFalsy();
    });

    it('should return false if the input is not an object or a function', () => {
      const input = 'test';
      expect(isObject(input)).toBeFalsy();
    });
  });

  describe('omit', () => {
    it('should omit specified properties from input object', () => {
      const input = { name: 'Test', surname: 'Utility', age: 30 };
      const expected = { age: 30 };
      expect(omit(input, [ 'name', 'surname' ])).toEqual(expected);
    });

    it('should throw an error if input is not an object', () => {
      const input = 'test';
      expect(() => omit(input as any, [ 'age' ])).toThrowError('Input must be an object');
    });
  });

  describe('pick', () => {
    it('should pick only specified properties from input object', () => {
      const input = { name: 'Test', surname: 'Utility', age: 30 };
      const expected = { age: 30 };
      expect(pick(input, [ 'age' ])).toEqual(expected);
>>>>>>> f6ff16e (test(core): add tests for pick, omit, isObject utilities)
    });

    it('should throw an error if input is not an object', () => {
      const input = 'test';
      expect(() => pick(input as any, [ 'age' ])).toThrowError('Input must be an object');
    });
  });
<<<<<<< HEAD
=======

  describe('isValidDate', () => {
    it('should return true if a valid date is passed as input', () => {
      expect(isValidDate(new Date())).toBeTruthy();
    });

    it('should return false if a number is passed as input', () => {
      expect(isValidDate(3)).toBeFalsy();
    });

    it('should return false if a string is passed as input', () => {
      expect(isValidDate('test')).toBeFalsy();
    });

    it('should return false if a boolean is passed as input', () => {
      expect(isValidDate(true)).toBeFalsy();
    });

    it('should return false if an object is passed as input', () => {
      expect(isValidDate({ test: 'test' })).toBeFalsy();
    });

    it('should return false if an array is passed as input', () => {
      expect(isValidDate([ 'test' ])).toBeFalsy();
    });
  });
<<<<<<< HEAD
>>>>>>> ed4a231 (test: add more tests for valid date utility)
=======

  describe('stringify', () => {
    it('should cleanly stringify null or undefined', () => {
      expect(stringify(null)).toEqual('');
      expect(stringify(undefined)).toEqual('');
    });

    it('should stringify a string', () => {
      expect(stringify('hello')).toEqual('hello');
    });

    it('should stringify an object', () => {
      const obj = { hello: true };
      expect(stringify(obj)).toEqual(JSON.stringify(obj));
    });
  });

<<<<<<< HEAD
>>>>>>> 4cdf9ee (fix: safely handle null/undefined and stringify values in webhook action)
=======
  describe('removeDuplicates()', () => {
    it('should remove duplicates from an array of objects by the provided property', () => {
      const value = [{id: '1', name: 'A'}, {id: '2', name: 'B'}, {id: '3', name: 'D'}, {id: '4', name: 'A'}];
      expect(removeDuplicates(value, 'name')).toEqual([{id: '1', name: 'A'}, {id: '2', name: 'B'}, {id: '3', name: 'D'}]);
    });
  });

  describe('difference()', () => {
    it('should include the elements in a that are not in b', () => {
      const a = new Set(['a', 'b', 'd', 'e']);
      const b = new Set(['c', 'b', 't', 'y', 'e']);

      expect(Array.from(difference(a, b))).toEqual(['a', 'd']);
    });
  });
>>>>>>> 95e4ece (test: increate test coverage)
});
