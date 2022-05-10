import { caseInsensitiveIncludes } from './general.utilities';

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
