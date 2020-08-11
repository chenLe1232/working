import * as caclfuture from '$lib/order/caclFuture';
import orderTicksToSym from '$lib/order/orderTicksToSym';

// 基于最新价
export function filterWallets(positions, wallet, orders, tickers, limitRisk, assetd) {
  const tickSyms = orderTicksToSym(tickers);
  let walletsCallback = [];
  caclfuture.calcFutureWltAndPosAndMI(positions.filter(p => p.Sz), wallet, orders, limitRisk, assetd, tickSyms, '1', '0', '0', (val) =>{
    walletsCallback = val.wallets_back;
  });
  return walletsCallback;
};