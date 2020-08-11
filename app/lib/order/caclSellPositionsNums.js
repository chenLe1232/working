/**
 * 计算可开张数
 * @param {Array} positions 
 * @param {String} currentSymbol 
 */
// 有用
const caclSellPositionsNums = (positions, currentSymbol) => {
  let sellNums=0, buyNums=0,findSellNums={},findBuyNums={};
  findSellNums = positions.find(item => item.Sym === currentSymbol && item.Sz < 0);         
  findBuyNums = positions.find(item => item.Sym === currentSymbol && item.Sz > 0);
  sellNums = findSellNums ? Math.abs(findSellNums.Sz) : 0;
  buyNums = findBuyNums ? findBuyNums.Sz : 0;  
  return {buyNums: Number(buyNums), sellNums: Number(sellNums)}
}

export default caclSellPositionsNums;