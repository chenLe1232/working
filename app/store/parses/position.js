import * as caclfuture from '$lib/order/caclFuture';
import orderTicksToSym from '$lib/order/orderTicksToSym'; 
// 基于最新价
export function filterPosition(positions, wallets, orders, tickers, limitRisk, assetd) {
  const tickSyms = orderTicksToSym(tickers);
  let posArr = []
  // 空仓筛查：不存在Sz字段(不显示空仓)
  caclfuture.calcFutureWltAndPosAndMI(positions.filter(p => p.Sz), wallets, orders, limitRisk, assetd, tickSyms,'1','0','0', (val) =>{
    posArr = val.posArr_return;
  });
  return posArr;
};