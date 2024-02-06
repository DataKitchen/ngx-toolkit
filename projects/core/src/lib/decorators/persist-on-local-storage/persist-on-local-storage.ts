import 'reflect-metadata';
import { DeferredProp } from '../deferred-props';
import { CoreComponent } from '../../core.component';

const PersistOnLocalStorageSymbol = Symbol.for('PersistOnLocalStorageSymbol');

export interface PersistOnLocalStorageOptions {
  /**
  * A string for the namespace to scope the property value with
  * A `DeferredProp` as in
  *
  * @example
  *   @PersistOnLocalStorage({namespace: Prop('myNamespace')})
  *   heroEmailDeferred: string = 'spiderman';
  *
  *   ngOnInit() {
  *     this.myNamespace = someAsyncValue;
  *   }
  *
  * the `Prop` is resolved after ngOnInit inside CoreComponent
  */
  namespace?: string | DeferredProp;

  /**
  * When the decorated property is an object we can whilelist some properties
  * so that only those are persisted.
  *
  * @example
  *
  *  @PersistOnLocalStorage({whiteList: [ 'age' ]})
  *  fgWithWhiteList = new FormGroup({
  *    age: new FormControl(),
  *    birthDate: new FormControl(),
  *  });
  */
  whiteList?: string[];


  /**
  * When the decorated property is an object we can blackList some properties
  * so that only those are not persisted.
  *
  * @example
  *
  *  @PersistOnLocalStorage({blackList: [ 'age' ]})
  *  fgWithBlackList = new FormGroup({
  *    age: new FormControl(),
  *    birthDate: new FormControl(),
  *  });
  */
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
