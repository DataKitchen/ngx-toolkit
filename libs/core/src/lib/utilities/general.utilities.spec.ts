import { caseInsensitiveIncludes, isValidDate, parseDate } from './general.utilities';

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
      expect(parseDate('2019-08-24T14:15:22').toISOString()).toBe('2019-08-24T14:15:22.000Z');
    });
  });

  describe('isValidDate', () => {
    it('should return true if a valid date is passed in input', () => {
      expect(isValidDate(new Date())).toBeTruthy();
    });

    it('should return false if no valid date is passed in input', () => {
      expect(isValidDate(3)).toBeFalsy();
    });
  });
});
