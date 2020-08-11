import * as tradeSocket from '../../tradeSocket';

const subscribe = (UID) => {
  tradeSocket.subscribe({
    req: 'GetRiskLimits',
    rid: 'GetRiskLimits',
    args:{
      // 先给一个gmex的默认值把
      AId: `${UID}01`,          
      Sym: "BTC.USDT,BTC.BTC",
    }
  })
}
export default { subscribe };