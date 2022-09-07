export function caseInsensitiveIncludes(value: string | string[], searchString: string): boolean {
  const search = String(searchString ?? '').toLowerCase();
  if (Array.isArray(value)) {
    return value
      .filter(item => typeof item === 'string')
      .map(item => item.toLowerCase())
      .includes(search);
  }
  return String(value ?? '').toLowerCase().includes(search);
}

export function parseDate(date: string): Date {
  return new Date(date + '+00:00');
}

<<<<<<< HEAD
export function isValidDate(d: any) {
  return d instanceof Date && !isNaN(d as any);
=======
export function isObject(value: any): boolean {
  const type = typeof value;
  return value != null && (type === 'object' || type === 'function');
}

export function omit(obj: any, keys: string[]) {
  const newObject: any = {};
  Object.entries(obj).filter(([ k ]) => !keys.includes(k)).forEach(([ key, value ]) => {
    newObject[key] = value;
  });
  return newObject;
}

export function pick(obj: any, keys: string[]) {
  const newObject: any = {};
  Object.entries(obj).filter(([ k ]) => keys.includes(k)).forEach(([ key, value ]) => {
    newObject[key] = value;
  });
  return newObject;
>>>>>>> 38eebec (feat(core): add pick, omit, isObject utilities)
}
