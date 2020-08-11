/**
 * 本文件为成本价算相关
 */
import library from './library'
/**
 * 成本数据计算主函数
 * @param {Array} posArr 持仓数据，数组
 * @param {Array} wallets 合约钱包数据，数组
 * @param {Array} orderArr 合约未完成报单数据，数组
 * @param {Object} RSObj 基础风险限额数据，Sym做key
 * @param {Object} assetD 合约详情，Sym做key
 * @param {Object} lastTick 最新tick行情，Sym做key
 * @param {String} UPNLPrzActive 未实现盈亏计算选择，'1':最新价， '2'：标记价
 * @param {Object} newOrder 计算成本所需下单板数据模版：{
                    Sym: 'BTC.USDT',
                    Prz: 6456,
                    Qty: 100,
                    QtyF: 0, //默认为0
                    Dir: 1,
                    PId: '01DYM4S43QPM5KY5FZ9Y022ZPD',
                    Lvr: 0, //杠杆
                    MIRMy: 0 //自定义委托保证金率
                }
 * @param {String} MMType 仓位保证金公式选择，0: 默认，1: 开仓价值/杠杆 
 * @param {Function} cb 返回成本计算结果
 * 
 */
export function calcFutureWltAndPosAndMI(posArr, wallets, orderArr, RSObj, assetD, lastTick, UPNLPrzActive, newOrder, MMType, cb){
  
  //缺少字段补充
  library.addFieldForPosAndWltAndOrd(posArr, wallets, orderArr, assetD)
  
  let _newOrder = Object.assign({}, newOrder)
  _newOrder.PId = _newOrder.PId?_newOrder.PId:'new'
  let posCallVal = {}
  let _orderArr = addNewOrder(orderArr, _newOrder)
  let orderForPid = library.orderArrToPId(_orderArr);
  let wallet_obj = library.walletArrToSym(wallets)
  let sumMI = {}, WltBal_obj = {}
  let _posArr = []

  for(let i = 0;i < posArr.length;i++){
    _posArr.push(posArr[i])
  }
  // 如果用户没有这个单 的处理方式， 就是很奇怪为啥张数为0；
  if(_newOrder.PId == 'new'){
    _posArr.push({
      Sym: _newOrder.Sym,
      PId: _newOrder.PId,
      Lever: newOrder.Lvr,
      Sz: 0,
    })
  }
  
  // 到这一步，_posArr 有该时刻原来的positonArr 和用户输入的时候创建的_newPosArr,然后对每一个仓位进行遍历
  for(let i = 0;i < _posArr.length;i++){
    let pos = _posArr[i]
    let orderForPidArr = orderForPid[pos.PId]||[],tick = lastTick[pos.Sym] || {}, ass = assetD[pos.Sym] || {},RS = RSObj[pos.Sym]||{}
    
    // orderBuy  买委托降序  orderSell 卖委托 降序, QtyBuy 卖委托总的张数 QtySell 卖委托总的张数
    let {orderBuy, orderSell, QtyBuy, QtySell} = library.orderSplitAndSort(orderForPidArr)
    // SettCoin 结算货币  SettPrz 结算价格从最新的tick里面拿到
    let SettPrz = tick.SettPrz || 0, LastPrz = tick.LastPrz || 0, Sz = 0, SettleCoin = ass.SettleCoin
    // 拿到某个币对的钱包数据 object;
    let wallet = wallet_obj[SettleCoin] || {}
    // 计算钱包余额计算：入金金额 - 出金金额 + 已实现盈亏 + 赠送已实现盈亏（Gif 不为0时使用） + 赠送金额 + 现货出入金 Depo - WDrw - PNL -PNLG + Gift + SPot
    let WltBal = (wallet.Depo || 0) - (wallet.WDrw || 0) + (wallet.PNL || 0) + (wallet.PNLG || 0) + (wallet.Gift || 0) + (wallet.Spot || 0)
    // 每个币对的钱包余额封装成一个Object
    WltBal_obj[SettleCoin] = WltBal
    // 如果当前pos 的pid 等于新订单的pid 则使用新订单的杠杆 Lvr
    let Lever = pos.PId == _newOrder.PId?newOrder.Lvr:pos.Lever
   // aMIR：风险限额，aMMR：风险限额，aSzNetLong：当前委托净买量，aSzNetShort：当前委托净卖量，aMM：仓位保证金，
    let {aMIR, aMMR, aSzNetLong, aSzNetShort} = library.calcMMRAndMIR(pos.StopP || pos.StopL, orderBuy, orderSell, pos.Sz, RS)
    
    // 当前仓位下总的委托保证金
    let aMI = library.calcOrderMI(pos.StopP || pos.StopL, orderBuy, orderSell, SettPrz, ass, aMIR, Lever, pos.Sz, null, pos.MIRMy)
    // posCallVal 预期价位总价值 Object key 为仓位id pid;
    posCallVal[pos.PId] = posCallVal[pos.PId]?posCallVal[pos.PId]:{}
    posCallVal[pos.PId].aMIR = aMIR
    posCallVal[pos.PId].aMMR = aMMR
    posCallVal[pos.PId].aSzNetLong = aSzNetLong
    posCallVal[pos.PId].aSzNetShort = aSzNetShort
    posCallVal[pos.PId].aQtyBuy = QtyBuy
    posCallVal[pos.PId].aQtySell = QtySell

    if(!sumMI[SettleCoin]){
      sumMI[SettleCoin] = 0
    }
    // 计算所有币对所有仓位总的委托保证金
    sumMI[SettleCoin] += aMI
  }
  
  // UsedWltBal 可使用的钱包余额，pos1 没怎么搞得是干啥的？？
  let {pos1, UsedWltBal} = calcPos(posArr, sumMI, assetD, lastTick, UPNLPrzActive, WltBal_obj, posCallVal, MMType)
  posCallVal = Object.assign(posCallVal, pos1)

  let walletCallbackVal = calcfutureWallet(wallets, posArr, UPNLPrzActive, sumMI, UsedWltBal, assetD, posCallVal )
 
  let ass1 = assetD[newOrder.Sym] || {}
  let Coin = ass1.SettleCoin
  let MgnNeed = (walletCallbackVal[Coin]?walletCallbackVal[Coin].aMI + walletCallbackVal[Coin].aMM:0) - (wallet_obj[Coin]?wallet_obj[Coin].aMI + wallet_obj[Coin].aMM:0)
  
  MgnNeed = MgnNeed <= 0? 0: MgnNeed
  cb && cb(MgnNeed)
}


/**
 * 
 * @param {Array} posArr 持仓数据
 * @param {Object} 总委托保证金，Coin做key
 * @param {Object} assetD 合约详情
 * @param {Object} lastTick 最新tick行情，Sym做key
 * @param {String} UPNLPrzActive 未实现盈亏计算选择，'1':最新价， '2'：标记价
 * @param {Object} WltBal_obj 钱包余额，Coin做key
 */
export function calcPos(posArr, sumMI, assetD, lastTick, UPNLPrzActive, WltBal_obj, posCallVal, MMType){
  let UsedWltBal = {}, SumUrl = {}, SumMM = {},SumMMForLever0 = {}, SumMgnCalcAndMgnISO = 0;
  for(let i = 0; i < posArr.length; i++){
    let pos = posArr[i]
    let Sym = pos.Sym
    let ass = assetD[Sym] || {}, tick = lastTick[Sym] || {}, ValIni = 0, ValM = 0, ValL = 0, MgnCalcAndMgnISO = 0;

    let isReverse = (ass.Flag&1) == 1 || ass.TrdCls == 2?1:0
    ValIni = library.calcVal(isReverse, pos.PrzIni, pos.Sz, (ass.LotSz|| 0))
    ValM = library.calcVal(isReverse, tick.SettPrz, pos.Sz, (ass.LotSz|| 0))
    ValL = library.calcVal(isReverse, tick.LastPrz, pos.Sz, (ass.LotSz|| 0))
    
    if(pos.Lever != 0){
      MgnCalcAndMgnISO = Math.abs(ValIni)/Math.min(pos.Lever,1/posCallVal[pos.PId].aMIR) + pos.MgnISO
    }

    SumMgnCalcAndMgnISO += MgnCalcAndMgnISO
    
    let MM = 0, _MM = 0, UPNLforM = 0, UPNLforLast = 0, UrP = 0, UrL = 0, profitPer = 0, AvailMgnISO = 0;

    UPNLforLast = ValL-ValIni
    UPNLforM = ValM-ValIni

    UrP = UPNLforM>0? UPNLforM: 0
    UrL = UPNLforM<0? UPNLforM: 0

    if(!SumUrl[ass.SettleCoin]){
      SumUrl[ass.SettleCoin] = 0
    }
    SumUrl[ass.SettleCoin] += (UrL || 0)
    
    if(pos.Lever == 0){
      if(MMType == 1){
        let Lever = 1/Math.max(pos.MIRMy, posCallVal[pos.PId].aMIR)
        MM = Math.abs(ValIni)/Lever
      }else{
        MM = Math.abs(ValIni)*posCallVal[pos.PId].aMMR
      }
      _MM = Math.abs(ValIni)*posCallVal[pos.PId].aMMR
    } else {
      _MM = MM = MgnCalcAndMgnISO + pos.PNLISO
      AvailMgnISO = Math.max(pos.MgnISO+UrL,0)
    }

    if(!SumMM[ass.SettleCoin]){
      SumMM[ass.SettleCoin] = 0
    }
    SumMM[ass.SettleCoin] += (_MM || 0)
    if(pos.Lever == 0){
      if(!SumMMForLever0[ass.SettleCoin]){
        SumMMForLever0[ass.SettleCoin] = 0
      }
      SumMMForLever0[ass.SettleCoin] += (_MM || 0)
    }
    

    if(!UsedWltBal[ass.SettleCoin]){
      UsedWltBal[ass.SettleCoin] = 0
    }
    if(pos.Lever == 0){
      UsedWltBal[ass.SettleCoin] += (Math.abs(UrL) + MM + MgnCalcAndMgnISO)
    }else{
      UsedWltBal[ass.SettleCoin] += (MM + MgnCalcAndMgnISO)
    }

    if(UPNLPrzActive == '1'){
      profitPer = UPNLforLast / MM
    }else if(UPNLPrzActive == '2'){
      profitPer = UPNLforM / MM
    }

    posCallVal[pos.PId] = posCallVal[pos.PId]?posCallVal[pos.PId]:{}
    posCallVal[pos.PId].aMM = MM
    posCallVal[pos.PId]._MM = _MM
    posCallVal[pos.PId].aUrP = UrP
    posCallVal[pos.PId].aUrL = UrL
    posCallVal[pos.PId].aUPNLforLast = UPNLforLast
    posCallVal[pos.PId].aUPNLforM = UPNLforM
    
    posCallVal[pos.PId].aMgnCalcAndMgnISO = MgnCalcAndMgnISO
    posCallVal[pos.PId].aSumMgnCalcAndMgnISO = SumMgnCalcAndMgnISO
    posCallVal[pos.PId].aValIni = ValIni
    posCallVal[pos.PId].aValM = ValM
    posCallVal[pos.PId].aValL = ValL
    posCallVal[pos.PId].aProfitPer = profitPer
  }

  for(let key in UsedWltBal){
    UsedWltBal[key] += (sumMI[key] || 0)
  }

  for(let i = 0;i< posArr.length;i++){
    let pos = posArr[i]
    let Sym = pos.Sym
    let ass = assetD[Sym] || {}, tick = lastTick[Sym] || {};
    let UrL2 = 0, WltBal = 0, MM2 = 0, WltForPos = 0, LeverEffective = 0, AdjustLevelMax = 0, AdjustLeverMin = 0;

    let FeeTkrR = ass.FeeTkrR
    FeeTkrR = 0
    WltBal = WltBal_obj[ass.SettleCoin] || {}
    UrL2 = Number(Math.abs(SumUrl[ass.SettleCoin] - pos.aUrL)+ sumMI[ass.SettleCoin])

    if(pos.Lever == 0){
      WltForPos = WltBal - pos.aSumMgnCalcAndMgnISO - UrL2 - Math.abs(SumMM[ass.SettleCoin] - pos._MM)
    }else{
      WltForPos = pos.aMM//pos.aMgnCalcAndMgnISO + pos.PNLISO
      AdjustLevelMax = pos.aValIni / (pos.aMM-pos.aUrL-pos.MgnISO-pos.PNLISO)
      AdjustLeverMin = pos.aValIni / (pos.aMM + WltBal - UsedWltBal[ass.SettleCoin])
    }
    
    LeverEffective = Math.abs(pos.aValIni)/WltForPos

    posCallVal[pos.PId].aLeverEffective = LeverEffective
    posCallVal[pos.PId].aAdjustLevelMax = AdjustLevelMax
    posCallVal[pos.PId].aAdjustLeverMin = AdjustLeverMin

    let isReverse = (ass.Flag&1) == 1 || ass.TrdCls == 2?1:0
    let PrzLiq = library.calcPrzLiq(isReverse, pos.PrzIni, pos.aValIni, WltForPos, FeeTkrR, posCallVal[pos.PId].aMMR, ass.LotSz, pos.Sz, ass.PrzMinInc, ass.PrzMax)

    posCallVal[pos.PId].aPrzLiq = PrzLiq
    // posCallVal[pos.PId].aPrzBr = PrzBr


    let MgnRateforPrzM = 0, MgnRateforLiq = 0;
    
    if((ass.Flag&1) == 1 || ass.TrdCls == 2){
      MgnRateforPrzM = tick.SettPrz?1 - pos.PrzIni/tick.SettPrz:0
      MgnRateforLiq = 1 - pos.PrzIni/PrzLiq
     }else {
      MgnRateforPrzM = tick.SettPrz/pos.PrzIni - 1
      MgnRateforLiq = PrzLiq/pos.PrzIni - 1
    }


    posCallVal[pos.PId].aMgnRateforPrzM = MgnRateforPrzM
    posCallVal[pos.PId].aMgnRateforLiq = MgnRateforLiq
  }
  return {posCallVal, UsedWltBal}
}

/**
 * 钱包数据计算
 * @param {Array} wallets 
 * @param {Array} posArr 
 * @param {String} UPNLPrzActive 
 * @param {Object} sumMI 
 * @param {Object} UsedWltBal 
 * @param {Object} assetD 
 * 计算后钱包数据新增字段，WltBal:钱包余额,MgnBal:保证金余额，aMM:总维持保证金 , aMI:总委托保证金, aUPNL: 总未实现盈亏, aPNL总已实现盈亏，aGift可用赠金, aWdrawable可用资金， maxTransfer最大划转
 */
export function calcfutureWallet(wallets, posArr, UPNLPrzActive, sumMI, UsedWltBal, assetD, posCallVal){
  let walletCallbackVal = {}
  for(let i = 0; i< wallets.length;i++){
    let wallet = wallets[i], MgnBal = 0, AvailBal = 0, GiftRemain = 0, Wdrawable = 0, WltBal = 0, PNLISO = 0, SumUrP = 0, SumUrl = 0, profit = 0, aUPNL = 0, aPNL = 0, maxTransfer = 0, SumMM = {};
    
    for(let i = 0; i< posArr.length;i++){
      let _pos = posArr[i]
      let pos = posCallVal[_pos.PId]
      let ass = assetD[_pos.Sym] || {}
      PNLISO += (_pos.PNLISO || 0)
      SumUrP += (pos.aUrP || 0)
      SumUrl += (pos.aUrl || 0)
      if(UPNLPrzActive == '1'){
        aUPNL += (pos.aUPNLforLast || 0)
      }else if(UPNLPrzActive == '2'){
        aUPNL += (pos.aUPNLforM || 0)
      }
      aPNL += (_pos.RPNL || 0)
      if(!SumMM[ass.SettleCoin]){
        SumMM[ass.SettleCoin] = 0
      }
      SumMM[ass.SettleCoin] += (pos.aMM || 0)
    }

    WltBal = (wallet.Depo || 0) - (wallet.WDrw || 0) + (wallet.PNL || 0) + (wallet.PNLG || 0) + (wallet.Gift || 0) + (wallet.Spot || 0)
    MgnBal = WltBal + PNLISO + SumUrP + SumUrl
    AvailBal = WltBal - (UsedWltBal[wallet.Coin] || 0)
    GiftRemain = (wallet.Gift || 0) + (wallet.PNLG || 0)
    Wdrawable = WltBal - GiftRemain - (UsedWltBal[wallet.Coin] > GiftRemain? (UsedWltBal[wallet.Coin] || 0) - GiftRemain: 0)
    profit = (UsedWltBal[wallet.Coin] || 0) / WltBal
    // WltBal += PNLISO
    walletCallbackVal[wallet.Coin] = walletCallbackVal[wallet.Coin]?walletCallbackVal[wallet.Coin]:{}
    walletCallbackVal[wallet.Coin].WltBal = WltBal
    walletCallbackVal[wallet.Coin].MgnBal = MgnBal
    walletCallbackVal[wallet.Coin].aMI = (sumMI[wallet.Coin] || 0)
    walletCallbackVal[wallet.Coin].aMM = SumMM[wallet.Coin] || 0
    walletCallbackVal[wallet.Coin].aUPNL = aUPNL
    walletCallbackVal[wallet.Coin].aPNL = aPNL
    walletCallbackVal[wallet.Coin].aGift = GiftRemain
    walletCallbackVal[wallet.Coin].aWdrawable = AvailBal
    walletCallbackVal[wallet.Coin].maxTransfer = Wdrawable
    
  }
  return walletCallbackVal
}

export function addNewOrder(orderArr, newOrder){
  let arr = []
  for(let i = 0; i < orderArr.length; i++){
    let order = orderArr[i]
    arr.push(order)
  }
  arr.push(newOrder)
  
  return arr
  // return [...orderArr, newOrder]
}