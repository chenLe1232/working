import argsState from './argsState';
import orderTicksToSym from './orderTicksToSym';
import * as caclfuture from './caclFuture';
// 有用
const caclKeepAndRate = (state) => {
  const resultObj = argsState(state);
  // console.log(resultObj)
  const { positions, ordersToTest=[], limitRisk, products, tickers, futures, currentSymbol } = resultObj;
  let posArr = [], walletsCallback = {}, SettleCoin='USDT', coinSession;
  if(futures.length && positions.length && products.length && tickers.length ){
    const tickSyms = orderTicksToSym(tickers);
    const assetD = orderTicksToSym(products);
    const findSettleCoin = products.find(item => item.Sym === currentSymbol );
    SettleCoin = findSettleCoin ? findSettleCoin.SettleCoin : '';
    caclfuture.calcFutureWltAndPosAndMI(positions,futures,ordersToTest,limitRisk,assetD,tickSyms,'1','0','0', (val) =>{
      posArr = val.posArr_return;
      walletsCallback = val.wallets_back
    });
    coinSession = walletsCallback.find((item) => item.Coin === SettleCoin);
  };
  return coinSession;
};

export default caclKeepAndRate;