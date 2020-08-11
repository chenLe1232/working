import *  as marketSocket  from '../../marketSocket';

const subscribe = () => {
  // console.log('login subscribe')
  marketSocket.subscribe({
    req: 'GetAssetD',
    rid: 'GetAssetDOrder',
    args:{
      vp:3,
    }
  })
}
export default { subscribe };