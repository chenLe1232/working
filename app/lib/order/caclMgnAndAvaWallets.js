import orderTicksToSym from './orderTicksToSym';
import orderMgnNeed from './orderMgnNeed';
import argsState from './argsState';

/**
 *  计算当前币对 可用资金 所需保证金
 * @param {Object} args 
 * @param {Number} type 
 */
// 该方法继续可用
const caclMgnAndAvaWallets = ( args ) => {
  // const { ...restArgs } = argsProps(args, 1);
  const returnObj = argsState(args);
  const { tickers, products,...restArgs} = returnObj;
  const { futures, positions } = returnObj;
  let mgnBuyBack = 0, mgnSellBack = 0;
  const assetd = orderTicksToSym(products);
  // const findCoin = findArgs.findPositionsAndOrdAndWal(restArgs.wallets,'Coin', restArgs.currentCoin);
  const tickersSym = orderTicksToSym(tickers);
  if(tickers.length && futures.length && positions.length && products.length){
    const { mgnBuy, mgnSell } = orderMgnNeed({tickersSym, assetd,...restArgs});
          mgnBuyBack = mgnBuy ? Number(mgnBuy).toFixed(4) : 0,
          mgnSellBack = mgnSell ? Number(mgnSell).toFixed(4): 0;
  }
  return {mgnBuy: mgnBuyBack, mgnSell: mgnSellBack }
};

export default caclMgnAndAvaWallets;