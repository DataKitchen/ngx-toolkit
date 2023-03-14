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

export function parseDate(date?: string): Date | undefined {
  if (date !== null && date !== undefined && typeof date === 'string') {
    const timezoneOffset = date.endsWith('+00:00') ? '' : '+00:00';
    return new Date(date + timezoneOffset);
  }

  return date;
}

<<<<<<< HEAD
export function isValidDate(d: any) {
  return d instanceof Date && !isNaN(d as any);
=======
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

export function pick(obj: object, keys: string[]) {
  if (!isObject(obj)) {
    throw new Error('Input must be an object');
  }

  const newObject: any = {};
  Object.entries(obj).filter(([ k ]) => keys.includes(k)).forEach(([ key, value ]) => {
    newObject[key] = value;
  });
  return newObject;
>>>>>>> 38eebec (feat(core): add pick, omit, isObject utilities)
}

export function stringify(d: unknown, pretty: boolean = false): string {
  if (d === undefined || d === null) {
    return '';
  }

  if (typeof d === 'string') {
    return d;
  }

  let v = '';

  try {
    if (pretty) {
      v = JSON.stringify(d, null, 2);
    } else {
      v = JSON.stringify(d);
    }
  } catch (e) {
    console.warn(e);
  }

  return v;
}
