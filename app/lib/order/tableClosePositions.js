/**
 *  仓位处平仓函数
 * @param {String} AId 用户标识
 * @param {String} PId  仓位标识
 * @param {String} currentSymbol 当前交易币对 eg BTC.USDT
 * @param {Number} dir  -1 平多 1 平空
 * @param {Number} activeSelect 0 限价  1 市价
 * @param  {...any} restArgs 用户输入值
 * @param {Object}  currentAssetD 当前币对的交易对
 * @param { Function} Toast 提示函数
 * @param {Object} lastTicker 最新改币对的ticker
 */
const tableClosePositions = (AId, PId, currentSymbol, dir,activeSelect,Toast,currentAssetD,lastTicker, ...restArgs) => {
  const orderNew = {
    AId: AId,
    Sym: currentSymbol,
    COrdId: `kangbo${Date.now()}`,
    Dir: dir,
    Prz: 0,
    Qty: 0,
    QtyDsp: 0,
    Tif:0,
    OType: 1,
    OrdFlag: 0,
    PrzChg: 0,
    PId: PId,

  };
  if ( activeSelect === 0){
    // 限价单 limitPrice 用户输入的价格, limitNums 平的张数,如果没有用户输入
    //  就传 当前可平张数 市价同理
    const {limitPrice, limitNums } = restArgs,
          { PrzMax } = currentAssetD;
    if (!limitPrice){
      Toast({content: '请输入价格', type: 'error'});
      return null;
    };
    if ( limitPrice > PrzMax){
      Toast({content:'当前价格输入过高，请重新输入'});
      return null;
    };
    orderNew.Prz = Number(limitPrice);
    orderNew.Qty = Number(limitNums);
    orderNew.OType = 1;
    orderNew.OrdFlag = 2;
    return orderNew;
  };
  // 市价单
  const { marketNums } = restArgs,
        { lastPrz } = lastTicker;
  orderNew.Qty = Number(marketNums);
  orderNew.OType = 2;
  orderNew.PrzChg = 5;
  orderNew.Tif = 1;
  orderNew.Prz = lastPrz;
  orderNew.OrdFlag = 2;

  return orderNew;
};

export default tableClosePositions;