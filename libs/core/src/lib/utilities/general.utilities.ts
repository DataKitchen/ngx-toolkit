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
