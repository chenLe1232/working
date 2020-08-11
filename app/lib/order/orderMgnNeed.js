import * as caclFuture from './caclFuture';
import * as caclMgnNeed from './caclMgnNeed';

/**
 *  所需保证金计算函数
 * @param {Number} activeSelect 选择的下单方式 0限价 1市价 2限价委托 3 市价委托
 * @param {Array} positions 仓位数据
 * @param {Object} wallets 钱包数据
 * @param {Array} orders 委托单
 * @param {Object} limitRisk 风险限额
 * @param {Object} assetd 交易对
 * @param {Object} tickersSym 最新的tick详情
 * @param {Object} restProps 计算所需要的用户输入值
 * @param {String} currentSymbol 当前币对
 * @returns {Object} 做多所需保证金 mgnBuy 做空所需保证金 mgnSell
 * @author carline
 */
const orderMgnNeed = ({activeSelect, positions, futures,orders,limitRisk,assetd,tickersSym, currentSymbol,selectPrice, ...restProps }) => {
  // 查看仓位信息
  let buyPid = '', sellPid = '', mgnBuy = 0, mgnSell = 0, Lvr = 0, Sym = currentSymbol;
  let lastTick = tickersSym;
  let deepthPrice = selectPrice, wallets = futures ;
  if(positions && positions.length > 0){
    let buyPosition = positions.find((item) => item.Sym === Sym && item.Sz > 0);
    let sellPosition = positions.find((item) => item.Sym === Sym && item.Sz < 0);
    buyPid = buyPosition ? buyPosition.PId : '';
    sellPid = sellPosition ? sellPosition.PId : '';
    // 判断全仓杠杆还是逐仓杠杆
    Lvr = positions.find((item) => item.Sym === Sym && item.Lever && item.Sz !== void 0) ?
          positions.find((item) => item.Sym === Sym && item.Lever && item.Sz !== void 0).Lever : 0;

  }
  let newOrderForBuy = (prz, nums) => ({
    Sym: Sym,
    Prz: Number(prz),
    Qty: Number(nums),
    QtyF: 0,
    Dir: 1,
    Lvr: Lvr,
    // OrdFlag: 1028,
    PId: buyPid, 
    // Lvr: 60,
    MIR: 0.01
    // MIRMy: MIRMy
  });
  let newOrderForSell = (prz, nums) => ({
    Sym: Sym,
    Prz: Number(prz),
    Qty: Number(nums),
    QtyF: 0,
    Dir: -1,
    Lvr: Lvr,
    // OrdFlag: 1028,
    PId: sellPid, 
    // Lvr: 60,
    MIR: 0.01
    // MIRMy: MIRMy
  });
  // 0 限价单  1 市价单  2 限价委托 3 市价委托
  switch (activeSelect) {
    case 0:
      const { limitPrice, limitNums } = restProps;
      const prize = limitPrice ? limitPrice: deepthPrice ? deepthPrice : 0;
      // 第一步先计算保证金
      if(limitNums && prize && wallets && assetd){
      caclFuture.calcFutureWltAndPosAndMI(positions,wallets,orders,limitRisk,assetd,lastTick,'1','0','0',(val) => {
        caclMgnNeed.calcFutureWltAndPosAndMI(positions,wallets,orders,limitRisk,assetd,lastTick,'2', 
                                            newOrderForSell(prize, limitNums),'0',val.wallets_back,
                                            (val) => mgnSell =  Number(val).toFixed(2));
        caclMgnNeed.calcFutureWltAndPosAndMI(positions,wallets,orders,limitRisk,assetd,lastTick,'2',
                                            newOrderForBuy(prize,limitNums),'0',val.wallets_back,
                                            (val) =>  mgnBuy =  Number(val).toFixed(2));
      });
    
    }
      break;
      case 1:
       const { marketNums } = restProps;
       if ( !!assetd && !!marketNums && !!wallets ){
        // console.log(orders)
        const PrzIndex = assetd[Sym].PrzLatest;
        caclFuture.calcFutureWltAndPosAndMI(positions,wallets,orders,limitRisk,assetd,lastTick,'1','0','0',(val) => {
          caclMgnNeed.calcFutureWltAndPosAndMI(positions,wallets,orders,limitRisk,assetd,lastTick,'2', 
                                              newOrderForSell(PrzIndex, marketNums),'0',val.wallets_back,
                                              (val) => mgnSell =  Number(val).toFixed(5));
          caclMgnNeed.calcFutureWltAndPosAndMI(positions,wallets,orders,limitRisk,assetd,lastTick,'2',
                                              newOrderForBuy(PrzIndex,marketNums),'0',val.wallets_back,
                                              (val) =>  mgnBuy =  Number(val).toFixed(5));
        });
       };
      break;
      case 2:
        const{ selectMkPrzOne,  whichSelectOne, limitOrderPrice, limitOrderNums} = restProps;
        const orderPrize = limitOrderPrice ? limitOrderPrice: deepthPrice ? deepthPrice : 0;
        if( orderPrize && limitOrderNums && wallets){
          const {PrzLatest, PrzIndex } =  assetd[Sym]
          let stopBy = 0, prz = 0;
          if( whichSelectOne === 0){
            prz = selectMkPrzOne;
          } else if( whichSelectOne == 1){
            prz = PrzIndex;
            stopBy = 2;
          } else{
            prz = PrzLatest;
            stopBy = 1
          }
          let newOrderForBuy_order = {
            Sym: Sym,
            Prz: Number(orderPrize),
            Qty: Number(limitOrderNums),
            QtyF: 0,
            Dir: 1,
            Lvr: Lvr,
            // OrdFlag: 1028,
            StopBy: stopBy,
            PId: buyPid, 
            // Lvr: 60,
            MIR: 0.01
            // MIRMy: MIRMy
          }
          let newOrderForSell_order = {
            Sym: Sym,
            Prz: Number(orderPrize),
            Qty: Number(limitOrderNums),
            QtyF: 0,
            Dir: -1,
            Lvr: Lvr,
            StopBy: stopBy,
            StopPrz: Number(prz),
            // OrdFlag: 1028,
            PId: sellPid, 
            // Lvr: 60,
            MIR: 0.01
            // MIRMy: MIRMy
          }
          caclFuture.calcFutureWltAndPosAndMI(positions,wallets,orders,limitRisk,assetd,lastTick,'1','0','0',(val) => {
            caclMgnNeed.calcFutureWltAndPosAndMI(positions,wallets,orders,limitRisk,assetd,lastTick,'2', 
                                                newOrderForSell_order,'0',val.wallets_back,
                                                (val) => mgnSell =  Number(val).toFixed(2));
            caclMgnNeed.calcFutureWltAndPosAndMI(positions,wallets,orders,limitRisk,assetd,lastTick,'2',
                                                newOrderForBuy_order,'0',val.wallets_back,
                                                (val) =>  mgnBuy =  Number(val).toFixed(2));
          });
       }; 
      break;
      case 3:
        const{ selectMkPrzTwo,  whichSelectTwo, marketOrderNums } = restProps;
        if( !!assetd && !!marketOrderNums && wallets){
          const {PrzLatest, PrzIndex } =  assetd[Sym]
          let stopBy = 0, prz = 0;
          if( whichSelectTwo === 0){
            prz = selectMkPrzTwo;
          } else if( whichSelectTwo === 1){
            prz = PrzIndex;
            stopBy = 2;
          } else{
            prz = PrzLatest;
            stopBy = 1
          }
          let newOrderForBuy_order = {
            Sym: Sym,
            Prz: Number(PrzIndex),
            Qty: Number(marketOrderNums),
            QtyF: 0,
            Dir: 1,
            Lvr: Lvr,
            // OrdFlag: 1028,
            StopBy: stopBy,
            PId: buyPid, 
            // Lvr: 60,
            MIR: 0.01
            // MIRMy: MIRMy
          }
          let newOrderForSell_order = {
            Sym: Sym,
            Prz: Number(PrzIndex),
            Qty: Number(marketOrderNums),
            QtyF: 0,
            Dir: -1,
            Lvr: Lvr,
            StopBy: stopBy,
            StopPrz: prz,
            // OrdFlag: 1028,
            PId: sellPid, 
            // Lvr: 60,
            MIR: 0.01
            // MIRMy: MIRMy
          }
          caclFuture.calcFutureWltAndPosAndMI(positions,wallets,orders,limitRisk,assetd,lastTick,'1','0','0',(val) => {
            caclMgnNeed.calcFutureWltAndPosAndMI(positions,wallets,orders,limitRisk,assetd,lastTick,'2', 
                                                newOrderForSell_order,'0',val.wallets_back,
                                                (val) => mgnSell =  Number(val).toFixed(2));
            caclMgnNeed.calcFutureWltAndPosAndMI(positions,wallets,orders,limitRisk,assetd,lastTick,'2',
                                                newOrderForBuy_order,'0',val.wallets_back,
                                                (val) =>  mgnBuy =  Number(val).toFixed(2));
          });
       }; 
      break;
    default:
      break;
  };
  return {mgnBuy, mgnSell}
}

export default orderMgnNeed;