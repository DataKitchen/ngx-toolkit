import 'reflect-metadata';
import { DeferredProp } from '../deferred-props';
import { CoreComponent } from '../../core.component';

const PersistOnLocalStorageSymbol = Symbol.for('PersistOnLocalStorageSymbol');

export interface PersistOnLocalStorageOptions {
  namespace?: string | DeferredProp;
  whiteList?: string[];
  blackList?: string[];
}

export function getPersistOnLocalStorage<T extends CoreComponent>(target: T): string[] {
  return Reflect.getMetadata(PersistOnLocalStorageSymbol, target) as string[] || [];
}

export function getLocalStorageOptions<T extends CoreComponent>(target: T, propertyKey: string): PersistOnLocalStorageOptions {
  return Reflect.getMetadata(PersistOnLocalStorageSymbol, target, propertyKey) as PersistOnLocalStorageOptions || {};
}

export function PersistOnLocalStorage(options?: PersistOnLocalStorageOptions) {
  return <T extends CoreComponent>(target: T, propertyKey: string): void => {
    const propertiesToBind = getPersistOnLocalStorage(target);

    propertiesToBind.push(propertyKey);

    // store options
    Reflect.defineMetadata(PersistOnLocalStorageSymbol, options || {}, target, propertyKey);
    return Reflect.defineMetadata(PersistOnLocalStorageSymbol, propertiesToBind, target);
  };
}
