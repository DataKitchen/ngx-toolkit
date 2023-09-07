import { TestScheduler as RxJsTestScheduler } from 'rxjs/testing';
import { Observable } from 'rxjs';

/**
 * Syntactic sugar for rxjs's TestScheduler.
 *
 * In the where a global `scheduler` is needed in a test, and this is especially
 * true when time operators are used, inject the `testScheduler` creating a new
 * instance.
 *
 * Then use `testScheduler.run` or `testScheduler.observable$`
 *
 * The former being the same as the original, while the latter is a shorthand
 * for when no callback is needed to directly use `expectObservable`
 *
 * @example
 *  let testScheduler: TestScheduler;
 *
 *  beforeEach(() => {
 *     testScheduler = new TestScheduler();
 *
 *     TestBed.configureTestingModule({
 *       providers: [
 *         {
 *           provide: rxjsScheduler,
 *           useValue: testScheduler,
 *         }
 *       ],
 *     });
 *
 *   });
 *
 *   it('should check on observable', () => {
 *     testScheduler.expect$(of(1)).toEqual(of(1));
 *   })
 *
 *   it('should check in a callback', () => {
 *     testScheduler.run(({expectObservable}) => {
 *       // actions
 *       expectObservable(of(1)).toEqual(of(1));
 *     });
 *   })
 */
export class TestScheduler extends RxJsTestScheduler {
  useContain = false;
  private alphabet = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ];


  static expect$<T>(observable: Observable<T>) {
    console.log('running static method');
    const scheduler = new TestScheduler();

    return scheduler.expect$(observable);

  }

  constructor() {
    super((actual, expected) => {
      console.log('actual', actual);
      console.log('expected', expected);
      if (this.useContain) {
        for (const expectedElement of expected) {
          expect(actual).toContainEqual(expectedElement);
        }
      } else {
        expect(actual).toEqual(expected);
      }
    });
  }

  expect$<T>(observable: Observable<T>): {
    toBe(marbles: string, values?: any, errorValue?: any): void;
    toEqual: (other: Observable<T>) => void;
    toContain: (...values: any[]) => void;
  } {

    // reset use contain flag
    this.useContain = false;

    return {
      toBe: (marbles: string, values?: any, errorValue?: any) => {
        this.run(({ expectObservable }) => {
          expectObservable(observable).toBe(marbles, values, errorValue);
        });
      },
      toEqual: (obs) => {
        this.run(({ expectObservable }) => {
          expectObservable(observable).toEqual(obs);
        });
      },
      toContain: (...values: any[]) => {

        this.useContain = true;

        this.run(({expectObservable}) => {

          const marble = values.map((_, index) => {
            return this.alphabet[index];
          });

          const v = values.reduce((acc, val, index) => {
            acc[this.alphabet[index]] = val;
            return acc;
          }, {});

          expectObservable(observable).toBe(marble.join(''), v);
        });
      }
    };

  }


}
