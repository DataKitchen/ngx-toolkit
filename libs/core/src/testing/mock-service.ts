/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Class } from 'utility-types';

const builtInMethods = Object.keys(Object.getOwnPropertyDescriptors(Object.getPrototypeOf({})));

export type Mocked<T> = {
  [M in keyof T]: jest.Mock & T[M]
} & T;

export function MockService<T extends new(...args: any[]) => any>(service: T): (klass?: Class<any>) => Mocked<T> {

  let proto = service.prototype as unknown;

  const methods: string[] = [];

  while (proto) {
    const ownMethods = Object.keys(Object.getOwnPropertyDescriptors(proto))
      .filter((k) => {
        return !builtInMethods.includes(k);
      });

    methods.push(...ownMethods);

    try {
      proto = Object.getPrototypeOf(proto);
    } catch (e) {
      proto = null;
    }
  }

  return (_klass = class {}): Mocked<T> => {
    const mockedClass = _klass;

    for (const method of methods) {
      // @ts-ignore
      (mockedClass.prototype as unknown)[method] = jest.fn();
    }

    return mockedClass as Mocked<T>;
  };
}

export function MockProvider(klass: Class<any>, overrides: Class<any> = class {}) {
  return {
    provide: klass,
    useClass: MockService(klass)(overrides)
  };
}
