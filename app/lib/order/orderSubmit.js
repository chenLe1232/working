import Toast from '$components/kb-design/Toast';
/**
 * 该方法用户复用与下单与平仓两个地方，完成下单或平仓所需要的参数
 * 
 * @param {Number} activeSelect 用户选择的订单方式 限价 市价 限价委托 市价委托
 * @param {Number} quanCang  是否开启全仓 默认0全仓 1逐仓
 * @param {Number} openposition 开仓还是平仓 0开仓 1平仓
 * @param {Strign} UID 用户开通合约后登入成功系统返回的guid
 * @param {Object} currentTicker 最新的币对ticke订阅 请注意 这里与assetD 不同，别传错了。
 * @param {Number} dir 方向 开仓情况下 1 多 -1 空 平仓情况就取反 -1 平多 1 平空
 * @param {Boolean} passiveChecked  被动委托 true选中 false 没有选中 默认false
 * @param {String} currentSymbol 当前交易币对 
 * @param {Object Array} positions 当前仓位信息
 * @param {Number} userLever  用户自定义杠杆倍数
 * @param {Object Array} orders 用户委托单情况
 * @param {Function} Toast 消息提示方法
 * @returns {Object} 返回当前拼接好的订单
 */
const orderSubmit = ({activeSelect, quanCang, userInfo,currentTicker, dir,passiveChecked, positions, userLever,orders, currentSymbol, ...restProps}) => {
  let pidForAll = '',pidForSome = '', findPIdForPos=[], findPIdForOrd=[], lastTick = currentTicker;
  let lever = userLever, Sym = currentSymbol; 
  let orderNew = {
    AId: `${userInfo}01`,
    COrdId: `kangbo${Date.now()}`,
    Sym:Sym,
    Dir: dir,
    Prz: 0,
    Qty: 0,
    QtyDsp: 0,
    OType: 1,
    Tif: 0,
    PrzChg: 0,
    OrdFlag: 0,
  };
  // 判断用户是否已经有该币对对应的仓位, MIRMy后续是根据用户选择的杠杆来的。通过pos.Lever 来判断仓位是逐仓还是全仓
     positions.forEach((item) => {
       if (item.Sym === Sym){
         findPIdForPos.push(item);
       }
     });
     orders.forEach(item => {
       if (item.Sym === Sym && item.Sz){
         findPIdForOrd.push(item);
       }
     });
  //  quancang  0 表示走的是全仓逻辑 1 表示走逐仓逻辑 openposition 0 开仓 1平仓
  // *** 如果当前有委托单或者有仓位为全仓的情况 则用户不允许调整逐仓 或者调整杠杆 杠杆部分内容还没进行编写*****
  if (quanCang === 0 ) {
    // 如果用户没有委托单，但是已经有一个默认的仓位,但是没有Sz表示默认的仓位,Lever表示当前空仓位非逐仓仓位;
    // console.log(findPIdForPos,'pos')
    if (findPIdForPos.length === 1 && !findPIdForPos[0].Sz && !findPIdForPos[0].Lever){
      pidForAll = findPIdForPos[0].PId;
    } else if (findPIdForPos.length === 0 && findPIdForOrd.length === 1 && !findPIdForOrd.Lever) {
      pidForAll = findPIdForOrd[0].PId;
    } else if( findPIdForPos.length === 0 && findPIdForOrd.length ===0 ){
      pidForAll = 'new';
    } else{
      // 通过findBuyPId 和findSellPId 能找出已有持仓且持仓张数不为空的仓位
      const findBuyPId = findPIdForPos.find(item => !item.Lever && item.Sz >= 0 && dir > 0);
      const findSellPId = findPIdForPos.find(item => !item.Lever && item.Sz < 0 && dir < 0);
      const buyPId = findBuyPId ? findBuyPId.PId : '';
      const sellPId = findSellPId ? findSellPId.PId : '';
      // 如果 buyPId 为空 and sellPId为空，就说明用户已经有该币对持仓 但是该dir方向上没有该持仓
      pidForAll = buyPId ? buyPId : sellPId ? sellPId : 'new';
    };
    orderNew.PId = pidForAll;
    // 如果新用户下单没有选择杠杆 默认给以个20倍杠杆 后续 跟张盖在请教这里相关逻辑
    // 如果是全仓 自定义杠杆必须要穿lvr 否则 MIRMY无效
    if (!!lever){
      orderNew.lvr = 0;
      orderNew.MIRMy =  1 / lever;
    }
  } else if (quanCang === 1){
    // pidForSome = findPId && Object.keys(findPId).length > 0 && findPId.Lever ? findPId.PId : 'new';
    if (findPIdForPos.length === 1 && !findPIdForPos[0].Sz && findPIdForPos[0].Lever){
      pidForSome = findPIdForPos[0].PId;
    } else if (findPIdForPos.length === 0 && findPIdForOrd.length === 1 && findPIdForOrd.Lever) {
      pidForSome = findPIdForOrd[0].PId;
    } else if( findPIdForPos.length === 0 && findPIdForOrd.length === 0 ){
      pidForSome = 'new';
    } else{
      // 通过findBuyPId 和findSellPId 能找出已有持仓且持仓张数不为空的仓位
      const findBuyPId = findPIdForPos.find(item => item.Lever && item.Sz >= 0 && dir > 0);
      const findSellPId = findPIdForPos.find(item => item.Lever && item.Sz < 0 && dir < 0);
      const buyPId = findBuyPId ? findBuyPId.PId : '';
      const sellPId = findSellPId ? findSellPId.PId : '';
      // 如果 buyPId 为空 and sellPId为空，就说明用户已经有该币对持仓 但是该dir方向上没有该持仓
      pidForSome = buyPId ? buyPId : sellPId ? sellPId : 'new';
    };
    orderNew.PId = pidForSome;
    if (!!lever){
      orderNew.lvr = lever;
    }
  };
    // 是否选中被动委托
    if (passiveChecked) {
      // orderNew.OrdFlag = (4 | 1024 | 1);
      orderNew.OrdFlag = 1;
    } else {
      // orderNew.OrdFlag = (4 | 1024)
      orderNew.OrdFlag = 1024;
    }
    switch (activeSelect) {
      case 0:
        // 限价单
        const {
          limitPrice, limitNums
        } = restProps;
        // if ( !limitNums || !limitPrice){
        //   Toast({content: '请输入价格或数量', type: 'error'});
        //   return null;
        // }
        orderNew.Prz = Number(limitPrice);
        orderNew.Qty = Number(limitNums);
        orderNew.OType = 1;

        break;
      case 1:
        // 市价单
        const {
          marketNums
        } = restProps;
        // if ( !marketNums ){
        //   Toast({content: '请输入交易数量', type: 'error'});
        //   return null;
        // }
        let lastPrz = lastTick ? lastTick.LastPrz : 0;
        orderNew.Qty = Number(marketNums);
        orderNew.OType = 2;
        orderNew.PrzChg = 5;
        orderNew.Tif = 1;
        orderNew.Prz = lastPrz;

        break;
      case 2:
        // 限价条件单
        const {
          limitOrderPrice, limitOrderNums, selectMkPrzOne, whichSelectOne
        } = restProps;
        // if ( !limitOrderPrice || !limitOrderNums){
        //   Toast({content: '请输入价格或数量', type: 'error'});
        //   return null;
        // } else if ( !selectMkPrzOne){
        //   Toast({content: '您当前选择标记价格，请输入触发价', type: 'error'});
        //   return null;
        // }
        // 触发价
        orderNew.StopPrz = selectMkPrzOne ? Number(selectMkPrzOne) : 0;
        // 委托价
        orderNew.Prz = limitOrderPrice ? Number(limitOrderPrice) : 0;
        if (selectMkPrzOne >= limitOrderPrice) {
          // 止损
          orderNew.OrdFlag = passiveChecked ? 1 : 8;
        } else {
          // 止盈
          orderNew.OrdFlag = passiveChecked ? 1 : 16;
        };
        orderNew.StopBy = Number(whichSelectOne) ;
        // MIRMY 需要看用户是否是开启了全仓模式  或者用户是否有相对应的订单；
        orderNew.Qty = Number(limitOrderNums);
        orderNew.OType = 3;
        break;
      case 3:
        const {
          marketOrderNums, selectMkPrzTwo, whichSelectTwo
        } = restProps;
        // if ( !marketOrderNums ){
        //   Toast({content: '请输入交易数量', type: 'error'});
        //   return null;
        // } else if ( !selectMkPrzTwo){
        //   Toast({content: '请输入标记价格', type: 'error'});
        //   return null;
        // }
        // 市价
        orderNew.StopPrz = selectMkPrzTwo ? Number(selectMkPrzTwo) : 0;
        let prz = lastTick ? lastTick.LastPrz : 0;
        // 触发价
        if (selectMkPrzTwo >= prz) {
          orderNew.OrdFlag = passiveChecked ? 1 : 8;
        } else {
          orderNew.OrdFlag = passiveChecked ? 1 : 16;
        }
        orderNew.StopBy = Number(whichSelectTwo) ;
        orderNew.Qty = Number(marketOrderNums);
        orderNew.PrzChg = 5;
        orderNew.Tif = 1;
        orderNew.OType = 4;
        orderNew.Prz = Number(prz);
        break;
      default:
        break;
    };


  return orderNew;
};

export default orderSubmit;