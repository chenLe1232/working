/**
 * 查找仓位信息函数
 * @param {Array} arr 
 * @param {String} des 
 * @param {String} find 
 */
const findArgs = {};
findArgs.findPositionsAndOrdAndWal = (arr, des, find) => {
  return arr.find(item => item[des] === find);
};

findArgs.findPositions = (positions, currentSymbol) => {
  // let hasOrders = orders.length > 0 ?  orders.find((item) => item.Sym === currentSymbol) : 0;
  let hasPositions = positions.length > 0 ?  positions.find((item) => item.Sym === currentSymbol) : 0;
  return hasPositions;
};
findArgs.findOrder = (orders, currentSymbol) =>{
  let hasOrders = orders.length > 0 ?  orders.find((item) => item.Sym === currentSymbol) : 0;
  return hasOrders
};
findArgs.findCurrentAssetd = (products, currentSymbol) => {
  const product = products.find(item => item.Sym === currentSymbol);
  return product;
};

findArgs.findLever = (positions, currentSymbol) => {
  let positionLever = 0;
  if(positions.length > 0){
    const findLever = positions.find(item => item.Sym === currentSymbol);
    if(findLever && findLever.Sz && !findLever.Lever){
      positionLever = 1 / findLever.MIR;
    } else if ( findLever && findLever.Lever){
      positionLever = findLever.Lever
    }
  };
  return positionLever;
}

export default findArgs;