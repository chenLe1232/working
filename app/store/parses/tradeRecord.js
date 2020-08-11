export function filterTrade(records) {
  return records.filter(i => (i.Via === 4 || i.Via === 5 || i.Via === 6 || i.Via === 7 || i.Via === 13 || i.Via === 14));
};