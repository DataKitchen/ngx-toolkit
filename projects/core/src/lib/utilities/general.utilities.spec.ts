import { isObject, omit, pick, } from './general.utilities';

describe('general-utilities', () => {

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
    });

    it('should throw an error if input is not an object', () => {
      const input = 'test';
      expect(() => pick(input as any, [ 'age' ])).toThrowError('Input must be an object');
    });
  });

});
