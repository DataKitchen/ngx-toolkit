import { parseParams, SearchParam } from './parse-params';

describe('parseParams', () => {

  it('should be defensive', () => {
    expect(parseParams(undefined as unknown as SearchParam));
    expect(parseParams(null as unknown as SearchParam));
  });

  it('should parse params', () => {

    const result = parseParams({
      string: 'a-string',
      boolean: true,
      number: 1,
      boolean2: false,
      number2: 0,
      emptyString: '',
      undefined,
      null: null,
      notANumber: NaN,
      nestedObject: {
        string: 'a-string',
        boolean: true,
        number: 1,
        boolean2: false,
        number2: 0,
        emptyString: '',
        undefined,
        null: null,

        thirdLevelNesting: {
          string: 'a-string',
          boolean: true,
          number: 1,
          boolean2: false,
          number2: 0,
          emptyString: '',
          undefined,
          null: null,
        }
      }
    });

    expect(result).toEqual({
      string: 'a-string',
      boolean: 'true',
      number: '1',
      boolean2: 'false',
      number2: '0',
      nestedObject: {
        string: 'a-string',
        boolean: 'true',
        number: '1',
        boolean2: 'false',
        number2: '0',
        thirdLevelNesting: {
          string: 'a-string',
          boolean: 'true',
          number: '1',
          boolean2: 'false',
          number2: '0',

        }
      }
    });

  });

});
