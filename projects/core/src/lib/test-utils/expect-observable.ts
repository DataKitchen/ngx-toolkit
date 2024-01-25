/* eslint-disable @typescript-eslint/ban-ts-comment,@typescript-eslint/ban-types */
import { Observable } from 'rxjs';
import { TestScheduler } from './test-scheduler';

interface ExpectObservableMatcher<T> {
  toBe: (marbles: string, values?: { [k: string]: T }, errorValue?: any) => void;
  toEqual: (...vales: Array<T>) => void;
  toContain: (...vales: Array<T>) => void;
}

/**
 * @deprecated use new TestScheduler().expect$
 * @param obs
 */
export function expectObservable<
  K extends Observable<any>,
  T = K extends Observable<infer A> ? A : never>(obs: K): ExpectObservableMatcher<T> {

  const testScheduler = new TestScheduler();

  const alphabet = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ];

  return {
    toBe: (marble: string, values?: {}, errorValue?: any) => {
      testScheduler.run(({ expectObservable }) => {
        expectObservable(obs).toBe(marble, values, errorValue);
      });
    },
    toEqual: (...values: Array<T>) => {

      testScheduler.run(({ expectObservable }) => {

        const marble = values.map((_, index) => {
          return alphabet[index];
        });

        const v = values.reduce((acc, val, index) => {
          // @ts-ignore
          acc[alphabet[index]] = val;
          return acc;
        }, {});

        expectObservable(obs).toBe(marble.join(''), v);
      });
    },
    toContain: (...values: Array<T>) => {

      testScheduler.expect$(obs).toContain(...values);
    }
  };
}
