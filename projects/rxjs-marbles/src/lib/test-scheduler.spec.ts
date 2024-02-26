import { BehaviorSubject, from, of } from 'rxjs';
import { TestScheduler } from './test-scheduler';

describe('expect-observable', () => {

  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler();
  })


  it('should match on an observable (.toBe)', () => {

    testScheduler.expect$(of(1)).toBe('(a|)', {a: 1});

  });

  it('should match on an observable (.toEqual)', () => {

    const source$ = new BehaviorSubject(1);
    const expected$ = new BehaviorSubject(1);
    testScheduler.expect$(source$).toEqual(expected$);

  });

  it('should match on an observable (.toEqual)', () => {

    const source$ = new BehaviorSubject(1);
    testScheduler.expectObservable(source$).toEqual(of(1));

  });

  it('should match on an observable (.toContain)', () => {

    testScheduler.expect$(from([ 1, 2, 3 ])).toContain(2);

  });

});
