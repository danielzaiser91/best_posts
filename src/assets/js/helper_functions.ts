
export const uniq = (arr: Array<any>): Array<any> => Array.from(new Set([...arr]))

// credit: https://www.30secondsofcode.org/blog/s/javascript-array-comparison
export const deepEquals = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (a instanceof Date && b instanceof Date)
    return a.getTime() === b.getTime();
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object'))
    return a === b;
  if (a.prototype !== b.prototype) return false;
  let keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every(k => deepEquals(a[k], b[k]));
};
