// import * as caclfuture from '$lib/order/caclFuture';
// import orderTicksToSym from '$lib/order/orderTicksToSym';
import caclKeepAndRate from '$lib/order/caclKeepAndRate';
import findArgs from '$lib/order/findPositionsAndOrdAndWal';
import argsState from '$lib/order/argsState';
import caclMgnAndAvaWallets from '$lib/order/caclMgnAndAvaWallets';
import orderSubmit from '$lib/order/orderSubmit';
import closePositionsSubmit from '$lib/order/closePositionsSubmit';
import caclSellPositionsNums from '$lib/order/caclSellPositionsNums';

const caclOrder = {
  state: {}, 
  selectors:{
    // 维持保证金
    stillPrice(){
      return state => {
        const coinSession = caclKeepAndRate(state);
        let stillPrice = coinSession ? Number((coinSession.aMI + coinSession.aMM)).toFixed(2) : 0;
        return stillPrice;
      }
    },
    // 可用余额
    aWdrawable(){
      return state => {
        const coinSession = caclKeepAndRate(state);
        let aWdrawable = coinSession ? Number(coinSession.aWdrawable).toFixed(2) : 0;
        return aWdrawable;
      }
    },
    // 是否有仓位
    hasPositions(){
      return state => {
        const { positions, currentSymbol } = argsState(state);
        return findArgs.findPositions(positions, currentSymbol);
      }
    },
    // 是否有委托单
    hasOrders(){
      return state => {
        const { orders, currentSymbol } = argsState(state);
        return findArgs.findOrder( orders, currentSymbol);
      }
    },
    // 当前杠杆
    lever(){
      return state => {
        const { positions, currentSymbol, userLever, products } = argsState(state);
        const assted =  findArgs.findCurrentAssetd(products, currentSymbol);
        const findLever  = findArgs.findLever(positions, currentSymbol);
        if (assted){
          const baseLever = 1 / assted.MIR;
          const lever = findLever ? findLever : userLever ? userLever : baseLever;
          return lever;
        };
        //  默认20
        return 20;
      }
    },
    // 做多所需保证金
    mgnbuy(){
      return state => {
        const { mgnBuy } = caclMgnAndAvaWallets(state);
        return mgnBuy;
      }
    },
    // 做空所需保证金
    mgnsell(){
      return state => {
        const { mgnSell } = caclMgnAndAvaWallets(state);
        return mgnSell; 
      }
    },
    // 下单 做多
    orderNewForBuy(){
      return state => {
        let dir = 1, orderNewForBuy = {};
        const fixArgs = argsState(state);
        if(fixArgs.userInfo && fixArgs.positions.length){
          orderNewForBuy = orderSubmit({dir, ...fixArgs});
        };
        return orderNewForBuy;
      }
    },
    // 下单 做空
    orderNewForSell(){
      return state => {
        let dir = -1, orderNewForSell = {};
        const fixArgs = argsState(state);
        if(fixArgs.userInfo && fixArgs.positions.length){
          orderNewForSell = orderSubmit({dir, ...fixArgs});
        };
        return orderNewForSell;
      }
    },
    // 平多 持仓量
    closePositionsWithLotNums(){
      return state => {
        const { positions, currentSymbol } = argsState(state);
        let lotNums = 0;
        if(currentSymbol && positions.length){
          const { buyNums } = caclSellPositionsNums(positions, currentSymbol);
          lotNums = buyNums;
        };
        return lotNums;
      }
    },
    // 平空 持仓量
    closePositionsWithEmpNums(){
      return state => {
        const { positions, currentSymbol } = argsState(state);
        let empNums = 0;
        if(currentSymbol && positions.length){
          const { sellNums } = caclSellPositionsNums(positions, currentSymbol);
          empNums = sellNums;
        };
        return empNums;
      }
    },
    // 平多 拼接后的order
    closePoitionsToLot(){
      return state => {
        let dir = -1, closePositionsLot = {};
        const fixArgs = argsState(state);
        if(fixArgs.userInfo && fixArgs.positions.length){
          closePositionsLot = closePositionsSubmit({dir, ...fixArgs});
        };
        return closePositionsLot;
      }
    },
    // 平空 拼接后的order
    closePoitionsToEmp(){
      return state => {
        let dir = 1, closePoitionsToEmp = {};
        const fixArgs = argsState(state);
        if(fixArgs.userInfo && fixArgs.positions.length){
          closePoitionsToEmp = closePositionsSubmit({dir, ...fixArgs});
        };
        return closePoitionsToEmp;
      }
    },
  }
};

export default caclOrder;