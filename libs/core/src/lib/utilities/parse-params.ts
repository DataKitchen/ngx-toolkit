type SearchParam = { [param: string]: any | SearchParam };

export function parseParams(params: SearchParam): { [key: string]: any } {
  return Object.keys(params || {})
    .filter((k) => {
      return params[k] !== null && params[k] !== undefined && params[k] !== '' && !Number.isNaN(params[k]);
    })
    .reduce((accumulator, k) => {
      if (typeof params[k] !== 'object') {
        accumulator[k] = String(params[k]);
      } else {
        accumulator[k] = parseParams(params[k] as SearchParam);
      }
      return accumulator;
    }, {} as { [key: string]: any });
}

