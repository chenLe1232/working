/**
 * 解构props参数
 * @param {Object} props 
 * @param {Number} king 
 */
const argsProps = (props, kind = 0) => {
  if (kind === 0){
    const { 
      UID,
      currentSymbol,
      submitOrder_subscribe,
      positions, 
      orders, 
      currentTicker,
      posOp_subscribe,
      tabs,
      getInputValue,
      wallets, 
      tickers,
      limitRisk,
      assetd,
      currentCoin,
    } = props;
    return {
      UID,
      currentSymbol,
      submitOrder_subscribe,
      positions, 
      orders, 
      currentTicker,
      posOp_subscribe,
      tabs,
      getInputValue,
      wallets, 
      tickers,
      limitRisk,
      assetd,
      currentCoin,
    }
  } else if (kind === 1){
    const {
      activeSelect, 
      positions,
      wallets, 
      currentCoin,
      limitPrice,
      limitNums,
      marketNums,
      limitOrderPrice,
      limitOrderNums,
      marketOrderNums,
      whichSelectOne,
      whichSelectTwo,
      selectMkPrzOne,
      selectMkPrzTwo,
      currentSymbol,
      tickers,
      orders, 
      limitRisk,
      assetd,
      deepthPrice,
    } = props;
    return {
      activeSelect, 
      positions,
      wallets, 
      currentCoin,
      limitPrice,
      limitNums,
      marketNums,
      limitOrderPrice,
      limitOrderNums,
      marketOrderNums,
      whichSelectOne,
      whichSelectTwo,
      selectMkPrzOne,
      selectMkPrzTwo,
      currentSymbol,
      tickers,
      orders, 
      limitRisk, 
      assetd,
      deepthPrice,
    }
  }
};

export default argsProps;