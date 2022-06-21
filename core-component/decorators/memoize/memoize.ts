export function Memoize(_target: unknown, _propertyKey: string, descriptor: PropertyDescriptor) {
  const previousResults: { [key: string]: unknown } = {};

  const originalMethod = descriptor.value as unknown;

  if (originalMethod instanceof Function) {
    descriptor.value = function (...args: any[]) {

      const key = JSON.stringify(args);

      if (!(key in previousResults)) {
        const result = originalMethod.apply(this, args) as unknown;
        previousResults[key] = result;
        return result;
      }

      return previousResults[key];
    };
  }
  return undefined;
}
