
import * as tradeSocket from '../../tradeSocket';
const subscribe = (UID) => {
  // console.log('login subscribe')
  tradeSocket.subscribe({
    req: 'GetWallets',
    rid: 'GetWallets',
    // expires: (new Date().valueOf() + 1000),
    args: {
      AId: `${UID}01`,
    },
  })
}
export default { subscribe }