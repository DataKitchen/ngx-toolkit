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
export declare class TestScheduler extends RxJsTestScheduler {
    useContain: boolean;
    private alphabet;
    static expect$<T>(observable: Observable<T>): {
        toBe(marbles: string, values?: any, errorValue?: any): void;
        toEqual: (other: Observable<T>) => void;
        toContain: (...values: any[]) => void;
    };
    constructor();
    expect$<T>(observable: Observable<T>): {
        toBe(marbles: string, values?: any, errorValue?: any): void;
        toEqual: (other: Observable<T>) => void;
        toContain: (...values: any[]) => void;
    };
}
