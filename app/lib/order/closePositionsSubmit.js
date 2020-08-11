
/**
 * @description 平仓主函数，
 * @param {String} UID  用户guid
 * @param {Array} positions 当前仓位信息
 * @param {Number} activeSelect 当前价格类型 0限价 1市价 2限价委托 3市价委托
 * @param {Object} currentTicker 当前币对对应最新ticker
 * @param {Object} that 当前组件实例
 * @param {Function} Toast 提示信息函数
 * @param {Object} currentSymbol 当前交易对
 * @param {Number} dir 交易方向 -1 平多 1 平空
 * @param {Object} restArgs input的返回值 
 * @returns {Object} orderNew 拼接好的对象。
 */
const closePositionsSubmit = ({ userInfo, positions,activeSelect, currentTicker,Toast, currentSymbol, dir, ...restArgs }) =>  {
  const Sym = currentSymbol, lastTick = currentTicker, UID = userInfo;
  // 拿到当前币对对应仓位
  // if(!positions){
  //   Toast({content:'当前没有可平仓位', type: 'error'});
  //   return null;
  // };
  const findPIdLot = positions.find(item => item.Sym === Sym && item.Sz > 0),
        findPIdEmpty = positions.find(item => item.Sym === Sym && item.Sz < 0);
  const PIdLot = findPIdLot ? findPIdLot.PId : '',
        PIdEmpty = findPIdEmpty ? findPIdEmpty.PId: '';
  // if ( !PIdLot && dir === -1){
  //   Toast({content: '当前没有可平数量', type: 'error'});
  //   return null;
  // } else if (!PIdEmpty && dir === 1){
  //   Toast({content: '当前没有可平数量', type: 'error'});
  //   return null;
  // }
  const orderNew = {
    AId: `${UID}01`,
    Sym: Sym,
    COrdId: `kangbo${Date.now()}`,
    Dir: dir,
    Prz: 0,
    Qty: 0,
    QtyDsp: 0,
    Tif:0,
    OType: 1,
    OrdFlag: 0,
    PrzChg: 0,
  };
  if ( dir === 1){
    // dir为1 表示平空 -1 平多
    orderNew.PId = PIdEmpty;
  } else {
    orderNew.PId = PIdLot;
  };
  switch (activeSelect) {
    case 0:
      // 限价单
      const {
        limitPrice, limitNums
      } = restArgs;
      // if ( !limitNums || !limitPrice){
      //   Toast({content: '请输入价格或数量', type: 'error'});
      //   return null;
      // } else if ( limitNums > emptyForSz && dir === 1){
      //   Toast({content: '当前数量超过最大可平张数', type: 'error'});
      //   return null;
      // } else if ( limitNums > lotForSz && dir === -1){
      //   Toast({content: '当前数量超过最大可平张数', type: 'error'});
      //   return null;
      // };
      orderNew.Prz = Number(limitPrice);
      orderNew.Qty = Number(limitNums);
      orderNew.OType = 1;
      orderNew.OrdFlag = 2;
      break;
    case 1:
      // 市价单
      const {
        marketNums
      } = restArgs;
      // if ( !marketNums ){
      //   Toast({content: '请输入交易数量', type: 'error'});
      //   return null;
      // } else if ( marketNums > emptyForSz && dir === 1){
      //   Toast({content: '当前数量超过最大可平张数', type: 'error'});
      //   return null;
      // } else if (marketNums > lotForSz && dir === -1){
      //   Toast({content: '当前数量超过最大可平张数', type: 'error'});
      //   return null;
      // };
      let lastPrz = lastTick ? lastTick.LastPrz : 0;
      orderNew.Qty = Number(marketNums);
      orderNew.OType = 2;
      orderNew.PrzChg = 5;
      orderNew.Tif = 1;
      orderNew.Prz = lastPrz;
      orderNew.OrdFlag = 2;

      break;
    case 2:
      // 限价条件单
      const {
        limitOrderPrice, limitOrderNums, selectMkPrzOne, whichSelectOne
      } = restArgs;
      // if ( !limitOrderPrice || !limitOrderNums){
      //   Toast({content: '请输入价格或数量', type: 'error'});
      //   return null;
      // } else if ( !selectMkPrzOne){
      //   Toast({content: '您当前选择标记价格，请输入触发价', type: 'error'});
      //   return null;
      // } else if ( limitOrderNums > emptyForSz && dir === 1 ){
      //   Toast({content: '当前数量超过最大可平张数', type: 'error'});
      //   return null;
      // } else if ( limitOrderNums > lotForSz && dir === -1){
      //   Toast({content: '当前数量超过最大可平张数', type: 'error'});
      //   return null;
      // };
      // 触发价
      orderNew.StopPrz = selectMkPrzOne ? selectMkPrzOne : 0;
      // 委托价
      orderNew.Prz = limitOrderPrice ;
      if (selectMkPrzOne >= limitOrderPrice) {
        // 止损
        orderNew.OrdFlag = 8;
      } else {
        // 止盈
        orderNew.OrdFlag = 16;
      };
      // ********** 备注
      // 张盖在平仓的时候默认传是最新价格 1 这先跟他保持一致，不懂再问
      //********* 
      // orderNew.StopBy = whichSelectOne === '标记价格' ? 0 : whichSelectOne === '指数价格' ? 2 : 1;
      orderNew.StopBy = 1;
      // MIRMY 需要看用户是否是开启了全仓模式  或者用户是否有相对应的订单；
      orderNew.Qty = Number(limitOrderNums);
      orderNew.OType = 3;
      break;
    case 3:
      const {
        marketOrderNums, selectMkPrzTwo, whichSelectTwo
      } = restArgs;
      // if ( !marketOrderNums ){
      //   Toast({content: '请输入交易数量', type: 'error'});
      //   return null;
      // } else if ( !selectMkPrzTwo){
      //   Toast({content: '请输入标记价格', type: 'error'});
      //   return null;
      // } else if ( marketOrderNums > emptyForSz && dir === 1 ){
      //   Toast({content: '当前数量超过最大可平张数', type: 'error'});
      //   return null;
      // } else if ( marketOrderNums > lotForSz && dir === -1){
      //   Toast({content: '当前数量超过最大可平张数', type: 'error'});
      //   return null;
      // };
      // 市价
      orderNew.StopPrz = selectMkPrzTwo ? selectMkPrzTwo : 0;
      let prz = lastTick ? lastTick.LastPrz : 0;
      // 触发价
      if (selectMkPrzTwo >= prz) {
        orderNew.OrdFlag = 8;
      } else {
        orderNew.OrdFlag = 16;
      }
      // ********** 备注
      // 张盖在平仓的时候默认传是最新价格 1 这先跟他保持一致，不懂再问
      //********* 
      // orderNew.StopBy = whichSelectTwo === '标记价格' ? 0 : whichSelectTwo === '指数价格' ? 2 : 1;
      orderNew.StopBy = 1;
      orderNew.Qty = Number(marketOrderNums);
      orderNew.PrzChg = 5;
      orderNew.Tif = 1;
      orderNew.OType = 4;
      orderNew.Prz = prz ? prz: 1;
      break;
    default:
      break;
  };
  return orderNew;
};

export default closePositionsSubmit;