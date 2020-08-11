import * as tradeSocket from '../../tradeSocket';
const subscribe = (orderNew) => {
  console.log('oreder submit')
  tradeSocket.subscribe({
    req: 'OrderNew',
    rid: 'OrderNew',
    args: orderNew,
  })
}
export default { subscribe };