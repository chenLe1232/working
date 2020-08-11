import * as tradeSocket from '../../marketSocket';
const subscribe = (user) => {
  tradeSocket.subscribe({
    req: 'Sub',
    rid: 'Sub_tick_BTC.USDT',
    args: ['tick_BTC.USDT','__slow__'],
  })
}
export default { subscribe };