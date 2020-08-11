import * as tradeSocket from '../../tradeSocket';
/**
 * 增加/删除/调整自定义保证金率 请求函数
 * @param {String} UID 用户guid
 * @param {*} PId 仓位PId
 * @param {*} Op 0 新建仓位，1删除当前仓位 3 调整用户自定义保证金率
 */
const subscribe = (UID,PId, Op) => {
  // console.log('login subscribe')
  tradeSocket.subscribe({
    req:'PosOp',
    rid: 'PosOp',
    args:{
     AId: `${UID}01`,
     Sym:'BTC.USDT',
     PId,
     Op: Op,
  }
  })
};
export default { subscribe };