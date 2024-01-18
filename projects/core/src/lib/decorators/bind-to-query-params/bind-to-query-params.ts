import { CoreComponent } from '../../core.component';
import { DeferredProp } from '../deferred-props';

const BindToQueryParamsSymbol = Symbol.for('BindToQueryParams');

export function getBindableProperties<T extends CoreComponent>(target: T): string[] {
  return Reflect.getMetadata(BindToQueryParamsSymbol, target) as string[] || [];
}

export function getBindablePropertyNamespace<T extends CoreComponent>(target: T, propertyKey: string): string | DeferredProp {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return Reflect.getMetadata(BindToQueryParamsSymbol, target, propertyKey);
}

export function BindToQueryParams(namespace?: string | DeferredProp) {
  return <T extends CoreComponent>(target: T, propertyKey: string) => {

    const propertiesToBind = getBindableProperties(target);
    propertiesToBind.push(propertyKey);

    Reflect.defineMetadata(BindToQueryParamsSymbol, namespace || '', target, propertyKey);
    return Reflect.defineMetadata(BindToQueryParamsSymbol, propertiesToBind, target);
  };
}


