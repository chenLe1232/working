export function filterStrong(records) {
  return records.filter(i => (i.Via === 4 || i.Via === 3 && i.SzCls !== 0 && Math.abs(i.Sz) === Math.abs(i.SzCls)));
};