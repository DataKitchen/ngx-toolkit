import { BehaviorSubject, from, of } from 'rxjs';
import { TestScheduler } from './test-scheduler';

describe('TestScheduler', () => {


  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler();
  });

  describe('expectObservable', () => {

    it('.toBe', () => {

      const source$ = new BehaviorSubject(1);
      testScheduler.expectObservable(source$).toBe('(a|)', {a: 1});
    });

    it('.toEqual', () => {

      const source$ = new BehaviorSubject(1);
      testScheduler.expectObservable(source$).toEqual(of(1));

    });

  });

  describe('run', () => {

    it('.run', () => {
      testScheduler.run(({cold, expectObservable}) => {
        const cold$ = cold('---a');

        expectObservable(cold$).toBe('---a');
      });
    });

  })

  describe('expect$', () => {

    it('.toBe', () => {

      testScheduler.expect$(of(1)).toBe('(a|)', {a: 1});

    });

    it('.toEqual', () => {

      const source$ = new BehaviorSubject(1);
      const expected$ = new BehaviorSubject(1);
      testScheduler.expect$(source$).toEqual(expected$);

    });

    it('.toContain', () => {

      testScheduler.expect$(from([ 1, 2, 3 ])).toContain(2);

    });

  })



});
