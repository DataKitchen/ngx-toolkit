export function isObject(value: any): boolean {
  const type = typeof value;
  return value != null && (type === 'object' || type === 'function');
}

export function omit(obj: object, keys: string[]) {
  if (!isObject(obj)) {
    throw new Error('Input must be an object');
  }

  const newObject: any = {};
  Object.entries(obj).filter(([ k ]) => !keys.includes(k)).forEach(([ key, value ]) => {
    newObject[key] = value;
  });
  return newObject;
}

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]) {
  if (!isObject(obj)) {
    throw new Error('Input must be an object');
  }

  const res: Pick<T, K> = {} as Pick<T, K>;

  keys.forEach((k) => {
    return res[k] = obj[k];
  });

  return res;
}
