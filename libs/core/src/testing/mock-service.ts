/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Class } from 'utility-types';
export type Mocked<T> = {
  [M in keyof T]: jest.Mock & T[M]
} & T;

export function MockService<T extends new(...args: any[]) => any>(service: T): (klass?: Class<any>) => Mocked<T> {

  const proto = service.prototype as unknown;
  const methods = Object.getOwnPropertyNames(proto)
    .filter((k) => {
      // @ts-ignore
      return typeof proto[k] === 'function';
    })
    .filter((k) => {
      return k !== 'constructor';
    });

  const parentProto = Object.getPrototypeOf(proto) as unknown;
  const parentMethods = Object.getOwnPropertyNames(parentProto)
    .filter((k) => {
      // @ts-ignore
      return typeof proto[k] === 'function';
    })
    .filter((k) => {
      return k !== 'constructor';
    });

  return (_klass = class {
  }): Mocked<T> => {
    const mockedClass = _klass;

    for (const method of [ ...methods, ...parentMethods ]) {
      // @ts-ignore
      (mockedClass.prototype as unknown)[method] = jest.fn();
    }

    return mockedClass as Mocked<T>;
  };
}
