import * as tradeSocket from '../../tradeSocket';
const subscribe = (AId, Sym, PId, lvr) => {
  tradeSocket.subscribe({
    req: 'PosLeverage',
    rid: 'PosLeverage',
    args: {
      AId,
      Sym,
      PId,
      Param: lvr,
    },
  })
}
export default { subscribe };