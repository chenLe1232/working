import obejectDefault from './objectDefault';

const library = {};

/**
 * 计算仓位相关价值
 * @isReverse 1:反向，0:正向
 */
library.calcVal = function(isReverse, Prz, Sz, LotSz){
  if(!Prz){
    return 0
  }
  if(isReverse){
    return  -1/Prz * Sz * LotSz
  }else{
    return Prz * Sz * LotSz
  }
}

/**
 *  有点没懂 orderArr是啥？
 * @param {Array} orderArr 
 */
library.orderArrToPId = function(orderArr){
  let orderForPid = []
  for(let i = 0;i < orderArr.length;i++){
    let order = orderArr[i]
    if(!orderForPid[order.PId]){
      orderForPid[order.PId] = []
    }
    orderForPid[order.PId].push(order)
  }
  return orderForPid
}

/**
 * 
 * @param {Array} walletArr 
 * @return {Array} 
 * 返回形如 [BTC:{},USDT:{}]
 */
library.walletArrToSym = function(walletArr){
  let walletObj = {}
  for(let i = 0; i < walletArr.length; i++){
    let wallet = walletArr[i]
    walletObj[wallet.Coin] = walletArr[i]
  }
  return walletObj
}

/**
 * 计算委托保证金
 * @param {Array} orderBuy 
 * @param {Array} orderSell 
 * @param {Number} SettPrz 
 * @param {Object} ass 
 * @param {Number} aMIR 
 * @param {Number} Lever 
 * @param {Number} MIR 委托保证金率（不是风险限额）
 */
library.calcOrderMI = function(isStopLAndP, orderBuy, orderSell, SettPrz, ass, aMIR, Lever, Sz, NewMIR, MIRMy){
  let SzBuy = Sz>0 && !isStopLAndP?Math.abs(Sz):0;
  let SzSell = Sz>0||isStopLAndP?0:Math.abs(Sz);
  let _aMIR = NewMIR || aMIR
  let aMISum = 0;
  let _MIR = 0
  let isReverse = (ass.Flag&1) == 1 || ass.TrdCls == 2?1:0;
  
  if(Lever == 0){
    _MIR = Math.max( MIRMy? MIRMy: 0, _aMIR )
  }else{
    _MIR = 1/Math.min(Lever,1/_aMIR)
  }

  for(let i = 0;i < orderBuy.length; i++){
    let item = orderBuy[i], ValIni = 0, ValM = 0, rateMIR = 0, MI = 0, FeeIni = 0, UrL = 0, aMI;

    let Qty = item.Qty - item.QtyF
    if(SzSell > 0){
      SzSell-=Qty
      if(SzSell < 0){
        let Sz = Math.abs(SzSell)
        
        ValIni = this.calcVal(isReverse, item.Prz, item.Dir*Sz, ass.LotSz)
        ValM = this.calcVal(isReverse, SettPrz, item.Dir*Sz, ass.LotSz)
        SzSell = 0
      }
    }else if(SzSell == 0){
      ValIni = this.calcVal(isReverse, item.Prz, item.Dir*Qty, ass.LotSz)
      ValM = this.calcVal(isReverse, SettPrz, item.Dir*Qty, ass.LotSz)
    }
    if(SzSell <= 0 && !((item.OrdFlag&2) != 0)){ //不是只减仓
      if(item.MIRMy){
        if(Lever == 0){
          _MIR = Math.max( item.MIRMy, _aMIR )
        }
      }
      MI = Math.abs(ValIni) * _MIR
      FeeIni =  Math.abs(ValIni) * (ass.FeeTkrR || 0)
      UrL = ValM - ValIni < 0? ValM - ValIni: 0
      if(Lever == 0){
        rateMIR = _MIR
        aMI = MI + FeeIni + Math.abs(UrL)
      }else{
        rateMIR = 1/Math.min(Lever,1/_MIR)//Math.max(1/Lever, _MIR)
        aMI = MI + FeeIni
      }
      aMISum += aMI
    }
  }
  for(let i = 0; i < orderSell.length; i++){
    let item1 = orderSell[i], ValIni1 = 0,ValM1 = 0, rateMIR1 = 0, MI1 = 0, FeeIni1 = 0, UrL1 = 0, aMI1 = 0;

    let Qty = item1.Qty - item1.QtyF
    if(SzBuy > 0){
      SzBuy-=Qty
      if(SzBuy < 0){
        let Sz1 = Math.abs(SzBuy)
        ValIni1 = this.calcVal(isReverse, item1.Prz, item1.Dir*Sz1, ass.LotSz)
        ValM1 = this.calcVal(isReverse, SettPrz, item1.Dir*Sz1, ass.LotSz)
        SzBuy = 0
      }
    }else if(SzBuy == 0){
      ValIni1 = this.calcVal(isReverse, item1.Prz, item1.Dir*Qty, ass.LotSz)
      ValM1 = this.calcVal(isReverse, SettPrz, item1.Dir*Qty, ass.LotSz)
    }
    if(SzBuy <= 0 && !((item1.OrdFlag&2) != 0)){ //不是只减仓
      if(item1.MIRMy){
        if(Lever == 0){
          _MIR = Math.max( item1.MIRMy, _aMIR )
        }
      }
      MI1 = Math.abs(ValIni1) * _MIR
      FeeIni1 =  Math.abs(ValIni1) * (ass.FeeTkrR || 0)
      UrL1 = ValM1 - ValIni1 < 0? ValM1 - ValIni1: 0
      if(Lever == 0){
        rateMIR1 = _MIR
        aMI1 = MI1 + FeeIni1 + Math.abs(UrL1)
      }else{
        rateMIR1 = 1/Math.min(Lever,1/_MIR)//Math.max(1/Lever, _MIR)
        aMI1 = MI1 + FeeIni1
      }
      
      aMISum += aMI1
    }
  }
  return aMISum
}

/**
 * wallet 数组改写成以币对作为key
 * @param {Array} walletArr 
 */
library.walletArrToSym = function(walletArr){
  let walletObj = {}
  for(let i = 0; i < walletArr.length; i++){
    let wallet = walletArr[i]
    walletObj[wallet.Coin] = walletArr[i]
  }
  // console.log( walletObj,'---------walletA-------------') 
  return walletObj
}

/**
 * 委托按价格排序
 * @param {Array} orderArr 
 */
library.orderSplitAndSort = function(orderArr){
  let orderBuy = [], orderSell = [], QtyBuy = 0, QtySell = 0
  for(let i = 0;i < orderArr.length; i++){
    let item = orderArr[i]
    if(item.Dir == 1){
      orderBuy.push(item)
      QtyBuy+=item.Qty
    }else if(item.Dir == -1){
      orderSell.push(item)
      QtySell+=item.Qty
    }
  }
  orderBuy.sort(function(a,b){ //买委托按委托价降序排列
    return b.Prz - a.Prz
  })
  orderSell.sort(function(a,b){  //买委托按委托价升序排列
    return a.Prz - b.Prz
  })
  return {orderBuy, orderSell, QtyBuy, QtySell}
}