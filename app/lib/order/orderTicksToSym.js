/**
 * key为当前交易币对 value为当前币对详细信息
 * @param {Object} ticks 
 */
// 该方法有用
const orderTicksToSym = (ticks) => {
  let tickSyms = {}
  if(ticks.length > 0){
    ticks.map(item => tickSyms[item.Sym] = item);
    return tickSyms
  };
  return {};
};

export default orderTicksToSym;