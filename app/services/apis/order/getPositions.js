import * as tradeSocket from '../../tradeSocket';

const subscribe = (UID) => {
  // console.log('login subscribe')
  tradeSocket.subscribe({
    req:'GetPositions',
    rid: 'GetPositionsToOrder',
    args:{
     AId: `${UID}01`
  }
  })
}
export default { subscribe };