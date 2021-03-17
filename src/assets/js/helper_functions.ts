
export const uniq = (a: Array<any>): Array<any> => {
  return a.reduce((acc: Array<any>, v: any) => {
    if(!acc.includes(v))acc.push(v);
    return acc;
  }, [])
}
