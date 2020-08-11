/**
 * 本文件为合约持仓信息以及资产信息计算相关
 */
import library from './library';
import _ from 'lodash';

/**
 * 合约数据计算主函数
 * @param {Array} posArr 持仓数据，数组
 * @param {Array} wallets 合约钱包数据，数组
 * @param {Array} orderArr 合约未完成报单数据，数组
 * @param {Object} RSObj 基础风险限额数据，Sym做key 查询用户的风险限额 GetRiskLimits，支持多个交易对查询
 * @param {Object} assetD 合约详情，Sym做key
 * @param {Object} lastTick 最新tick行情，Sym做key 最新的指数家 成交价
 * @param {String} UPNLPrzActive 未实现盈亏计算选择，'1':最新价， '2'：标记价
 * @param {String} MMType 保证金率公式选择，0: 默认，1: 开仓价值/杠杆 
 * @param {String} PrzLiqType 强平价计算公式选择，0: 默认，1: 默认公式中的MMR风险修改为MAX(MIRMy/2，MMR风险)
 * @param {Function} cb 
 * 用该函数处理完成后各个参数新增字段如下：
 * posArr各个持仓新增：
 *    aMIR：风险限额，aMMR：风险限额，aSzNetLong：当前委托净买量，aSzNetShort：当前委托净卖量，aMM：仓位保证金， 
 *    aUrP：仓位未实现盈利，aUrl：仓位未实现亏损，aUPNLforLast：仓位未实现盈亏（最新价），aUPNLforM： 仓位未实现盈亏（标记价），
 *    aProfitPer：合约回报率，aLeverEffective：仓位实际杠杆，aAdjustLevelMax仓位最大可调杠杆，仓位最小可调杠杆，
 *    aPrzLiq：强平价格，aMgnRateforPrzM：保证金率（实际值），aMgnRateforLiq：保证金率(参考值)，aAvailMgnISO：逐仓可取保证金
 * wallets中各个币种新增：
 *    MgnBal:账户权益，aMM:总仓位保证金 , aMI:总委托保证金, aUPNL: 总未实现盈亏, aGift可用赠金, aWdrawable可用保证金， maxTransfer最大划转， walletRate保证金使用率
 */
export const calcFutureWltAndPosAndMI = (posArr_clone, wallets_clone, orderArr_clone, RSObj_clone, assetD_clone, lastTick_clone, UPNLPrzActive, MMType, PrzLiqType, cb) => {
  let posArr = _.cloneDeep(posArr_clone),
      wallets = _.cloneDeep(wallets_clone),
      orderArr = _.cloneDeep(orderArr_clone),
      RSObj = _.cloneDeep(RSObj_clone),
      assetD = _.cloneDeep(assetD_clone),
      lastTick = _.cloneDeep(lastTick_clone);
  //缺少字段补充 这里有引用类型的影响 先不做币对字段补充
  library.addFieldForPosAndWltAndOrd(posArr, wallets, orderArr, assetD);
  let orderForPid = library.orderArrToPId(orderArr);
  let wallet_obj = library.walletArrToSym(wallets) || {};
 
  let sumMI = {}, WltBal_obj = {}
  for(let i = 0;i < posArr.length;i++){
    let pos = posArr[i]
    let orderForPidArr = orderForPid[pos.PId]||[],tick = lastTick[pos.Sym] || {}, ass = assetD[pos.Sym] || {},RS = RSObj[pos.Sym]||{};
    let {orderBuy, orderSell, QtyBuy, QtySell} = library.orderSplitAndSort(orderForPidArr);
    let SettPrz = tick.SettPrz || 0, LastPrz = tick.LastPrz || 0, Sz = 0, SettleCoin = ass.SettleCoin;
    let wallet = wallet_obj[SettleCoin] || {};
    let WltBal = (wallet.Depo || 0) - (wallet.WDrw || 0) + (wallet.PNL || 0) + (wallet.PNLG || 0) + (wallet.Gift || 0) + (wallet.Spot || 0)
    WltBal_obj[SettleCoin] = WltBal;
    // console.log( orderBuy, orderSell, QtyBuy, QtySell,'****future*****风险限额计算参数是否有特殊情况');
    //aMIR 仓位保证金率  aMMR 委托保证金率;
    let {aMIR, aMMR, aSzNetLong, aSzNetShort} = library.calcMMRAndMIR(pos.StopP || pos.StopL, orderBuy, orderSell, pos.Sz, RS);
    
    // console.log(pos.MIR,'pos')
    let Lever = pos.MIR ? 0: 1;
    // 2020-7-23 下午 乐臣  对pos.lever 进行修改，因为仓位信息里没有返回杠杆数据

    let aMI = library.calcOrderMI(pos.StopP || pos.StopL, orderBuy, orderSell, SettPrz, ass, aMIR, Lever, pos.Sz, null, pos.MIRMy)
      if(i == 2){
        // console.log(Lever, pos.MIRMy,'**FUTURE****');
        // console.log(aMI,'***FUTURE***计算总的委托保证是否正确');
        // console.log(aMIR, aMMR, aSzNetLong, aSzNetShort,'******风险限额计算是否准确');
      }
 
    pos.aMI = aMI
    pos.aMIR = aMIR
    pos.aMMR = aMMR
    pos.aSzNetLong = aSzNetLong
    pos.aSzNetShort = aSzNetShort
    pos.aQtyBuy = QtyBuy
    pos.aQtySell = QtySell

    if(!sumMI[SettleCoin]){
      sumMI[SettleCoin] = 0
    }
    sumMI[SettleCoin] += aMI
    // console.log(pos.aMM,sumMI,'仓位信息，总的仓位保证金')
  }
  let {posArr_return , UsedWltBal} = calcPos(posArr, sumMI, assetD, lastTick, UPNLPrzActive, WltBal_obj, MMType, PrzLiqType);
  // console.log(wallets)
  let wallets_back = calcfutureWallet(wallets, posArr_return , UPNLPrzActive, sumMI, UsedWltBal, assetD );
  cb && cb({posArr_return, wallets_back})
}

/**
 * 杠杆调整验证
 * @param {Object} pos 需要调整的持仓信息
 * @param {Array} orderForPId 需要调整的仓位对应的委托单
 * @param {Object} assetD 需要调整的持仓对应的合约的assetD
 * @param {Object} lastTick 需要调整的持仓对应的合约的最新行情
 * @param {Number} newLever 新调整的杠杆
 * @param {Function} cb cb({
                      code: 0, //code为0时可正常调整，-1调整后会导致仓位被强平， -2保证金不足，
                      changeNeedMM: 0//调整杠杆所需保证金
                    })
 * 
 */
export  const calcChangeLever = (pos, orderForPId, assetD, lastTick, newLever, cb) =>{
  // ****全仓是没有pos.Lever的 所以要做一个处理,如果没有就pos.Lever为0;
  pos.Lever = pos.Lever === void 0 ? 0 : pos.Lever;
  // ****** 2020-7-30 carline *****修改pos.Lever
  if(!pos || pos.Lever == newLever){
    cb && cb({
      code: 0,
      changeNeedMM: 0
    })
    return
  }
  let NewAvailBal = 0,NewMgnCalcAndMgnISO = 0,NewMIR = 0, NewMI = 0, NewMgn = 0;
  let _aUrL = Math.abs(pos.aUrL), _aMM = pos.aMM, _aMI = pos.aMI, aValIni = Math.abs(pos.aValIni)

  if(pos.Lever == 0){
    NewAvailBal = pos.aAvailBal + _aUrL + _aMM + _aMI
  }else{
    NewAvailBal = pos.aAvailBal + _aMM + _aMI
  }

  

  NewMIR = 1/Math.min(newLever,1/pos.aMIR)
  NewMgnCalcAndMgnISO = aValIni*NewMIR + (pos.MgnISO || 0)

  let {orderBuy, orderSell, QtyBuy, QtySell} = library.orderSplitAndSort(orderForPId);
  NewMI = library.calcOrderMI(pos.StopP || pos.StopL, orderBuy, orderSell, lastTick.SettPrz || 0, assetD, pos.aMIR, newLever, pos.Sz, NewMIR, pos.MIRMy)//aValIni*NewMIR + (pos.FeeIni || 0)
  

  NewMgn = NewMgnCalcAndMgnISO + NewMI

  let changeNeedMM = 0

  if(pos.Lever == 0 && newLever != 0){
    changeNeedMM = NewMgnCalcAndMgnISO - _aUrL - _aMM - _aMI
  }else if(pos.Lever != 0 && newLever != 0){
    changeNeedMM = NewMgnCalcAndMgnISO - _aMM - _aMI
  }

  changeNeedMM = changeNeedMM > 0? changeNeedMM:0
  // console.log(changeNeedMM, NewMgnCalcAndMgnISO, NewMIR)s
  
  if(pos.Sz == 0 || newLever == 0){
    cb && cb({
      code: 0,
      changeNeedMM: 0
    })
  }else if(newLever > 1/pos.aMIR){
    cb && cb({
      code: -3,
      errorText: '超出风险限额最大可调整杠杆，杠杆调整失败！',
      changeNeedMM: 0
    })
  }else if(newLever != 0 && NewMgn <= NewAvailBal && (_aUrL+aValIni * pos.aMMR < NewMgnCalcAndMgnISO)){
    // NewMgnCalcAndMgnISO <= NewAvailBal && (_aUrL + (aValIni * pos.aMMR)) < NewMgnCalcAndMgnISO
    // NewMgn ≤ NewAvailBal & _aUrL+aValIni*pos.aMMR ＜ NewMgnCalcAndMgnISO
    cb && cb({
      code: 0, 
      changeNeedMM,
    })
  }else if(newLever != 0 && NewMgn <= NewAvailBal && (_aUrL+aValIni * pos.aMMR >= NewMgnCalcAndMgnISO)){
    // NewMgnCalcAndMgnISO <= NewAvailBal && (_aUrL + (aValIni * pos.aMMR)) >= NewMgnCalcAndMgnISO
    cb && cb({
      code: -1, 
      errorText: '该操作导致仓位强平，调整杠杆失败！',
      changeNeedMM,
    })
  }else if(newLever != 0 && NewMgn > NewAvailBal){
    cb && cb({
      code: -2, 
      errorText: '可用保证金不足，调整杠杆失败！',
      changeNeedMM,
    })
  }
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
export var calcPos = (posArr_clone, sumMI_clone, assetD_clone, lastTick_clone, UPNLPrzActive, WltBal_obj_clone, MMType, PrzLiqType) => {
  let posArr_pos = _.cloneDeep(posArr_clone),
      sumMI = _.cloneDeep(sumMI_clone),
      assetD = _.cloneDeep(assetD_clone),
      lastTick = _.cloneDeep(lastTick_clone),
      WltBal_obj = _.cloneDeep(WltBal_obj_clone);

  let UsedWltBal = {}, UsedWltBalForDeduction = {}, SumUrlForLever0 = {}, SumMM = {}, SumMMForLever0 = {},SumMgnCalcAndMgnISO = 0, SumUPNLForM = {};
  for(let i = 0; i < posArr_pos.length; i++){
    let pos = posArr_pos[i]
    let Sym = pos.Sym
    let ass = assetD[Sym] || {}, tick = lastTick[pos.Sym] || {}, ValIni = 0, ValM = 0, ValL = 0, MgnCalcAndMgnISO = 0;
    // ****全仓是没有pos.Lever的 所以要做一个处理,如果没有就pos.Lever为0;
    pos.Lever = pos.Lever === void 0 ? 0 : pos.Lever;
    // ****** 2020-7-30 carline *****修改pos.Lever
    let isReverse = (ass.Flag&1) == 1 || ass.TrdCls == 2?1:0
    ValIni = library.calcVal(isReverse, pos.PrzIni, pos.Sz, (ass.LotSz|| 0))
    ValM = library.calcVal(isReverse, tick.SettPrz, pos.Sz, (ass.LotSz|| 0))
    ValL = library.calcVal(isReverse, tick.LastPrz, pos.Sz, (ass.LotSz|| 0))
    
    if(pos.Lever != 0){
      MgnCalcAndMgnISO = Math.abs(ValIni)/Math.min(pos.Lever,1/pos.aMIR) + pos.MgnISO
    }

    SumMgnCalcAndMgnISO += MgnCalcAndMgnISO
    
    let MM = 0, _MM = 0, UPNLforM = 0, UPNLforLast = 0, UrP = 0, UrL = 0, profitPer = 0, AvailMgnISO = 0;

    UPNLforLast = ValL-ValIni
    UPNLforM = ValM-ValIni

    UrP = UPNLforM>0? UPNLforM: 0
    UrL = UPNLforM<0? UPNLforM: 0

    if(!SumUrlForLever0[ass.SettleCoin]){
      SumUrlForLever0[ass.SettleCoin] = 0
    }
    if(pos.Lever == 0){
      SumUrlForLever0[ass.SettleCoin] += UrL
    }
    
    
    if(pos.Lever == 0){
      if(MMType == 1){
        let Lever = 1/Math.max((pos.MIRMy ? pos.MIRMy : 0), pos.aMIR)
        MM = Math.abs(ValIni)/Lever
      }else{
        MM = Math.abs(ValIni)*pos.aMMR
      }
      if(PrzLiqType && pos.Lever == 0){
        let MMR = Math.max((pos.MIRMy ? pos.MIRMy : 0)/2, pos.aMMR)
        _MM = Math.abs(ValIni)*MMR
      }else{
        _MM = Math.abs(ValIni)*pos.aMMR
      }
    } else {
      _MM = MM = MgnCalcAndMgnISO + pos.PNLISO
      AvailMgnISO = Math.max(pos.MgnISO+UrL,0)
    }

    //累计全部仓位保证金
    if(!SumMM[ass.SettleCoin]){
      SumMM[ass.SettleCoin] = 0
    }
    SumMM[ass.SettleCoin] += (_MM || 0)
    

    if(pos.Lever == 0){ //累计全仓相关保证金
      if(!SumMMForLever0[ass.SettleCoin]){
        SumMMForLever0[ass.SettleCoin] = 0
      }
      SumMMForLever0[ass.SettleCoin] += (_MM || 0)
    }
    // 你这个写的什么代码
    // !SumUPNLForM[ass.SettleCoin]?SumUPNLForM[ass.SettleCoin] = 0:''
    if(!SumUPNLForM[ass.SettleCoin]){
      SumUPNLForM[ass.SettleCoin] = 0
    }
    if(pos.Lever == 0){
      SumUPNLForM[ass.SettleCoin] += (UPNLforM ||0)
    }

    if(!UsedWltBal[ass.SettleCoin]){
      UsedWltBal[ass.SettleCoin] = 0
    }
    // if(!UsedWltBalForDeduction[ass.SettleCoin]){
    //   UsedWltBalForDeduction[ass.SettleCoin]
    // }
    
    if(pos.Lever == 0){
      UsedWltBal[ass.SettleCoin] += Math.abs(UrL) + (MM || 0)
      UsedWltBalForDeduction[ass.SettleCoin] += (MM || 0)
    }else{
      UsedWltBal[ass.SettleCoin] += MgnCalcAndMgnISO
      UsedWltBalForDeduction[ass.SettleCoin] += MgnCalcAndMgnISO
    }
    

    if(UPNLPrzActive == '1'){
      profitPer = UPNLforLast / MM
    }else if(UPNLPrzActive == '2'){
      profitPer = UPNLforM / MM
    }

    pos.aMM = MM
    pos._MM = _MM
    
    pos.aUrP = UrP
    pos.aUrL = UrL
    pos.aUPNLforLast = UPNLforLast
    pos.aUPNLforM = UPNLforM
    
    pos.aMgnCalcAndMgnISO = MgnCalcAndMgnISO
    pos.aSumMgnCalcAndMgnISO = SumMgnCalcAndMgnISO
    pos.aValIni = ValIni
    pos.aValM = ValM
    pos.aValL = ValL
    pos.aProfitPer = profitPer
    pos.aAvailMgnISO = AvailMgnISO
  }

  for(let key in UsedWltBal){
    UsedWltBal[key] += (sumMI[key] || 0)
  }
  for(let key in UsedWltBalForDeduction){
    UsedWltBalForDeduction[key] += Math.abs(Math.min(SumUPNLForM[key] || 0, 0))
  }
 let posArr_return =  calcPos1(posArr_pos,SumUrlForLever0,SumMM,UsedWltBal, sumMI,assetD, lastTick, WltBal_obj, SumUPNLForM, SumMMForLever0, PrzLiqType)
  return {posArr_return , UsedWltBal}
}

export var calcPos1 = (posArr_pos1_clone,SumUrlForLever0,SumMM,UsedWltBal, sumMI,assetD, lastTick, WltBal_obj, SumUPNLForM, SumMMForLever0, PrzLiqType) =>{
  let posArr_pos1 = _.cloneDeep(posArr_pos1_clone);
  for(let i = 0;i< posArr_pos1.length;i++){
    let pos = posArr_pos1[i]
    let Sym = pos.Sym
    let ass = assetD[Sym] || {}, tick = lastTick[pos.Sym] || {};
    let UrL2 = 0, WltBal = 0, MM2 = 0, WltForPos = 0, LeverEffective = 0, AdjustLevelMax = 0, AdjustLeverMin = 0;

    let FeeTkrR = ass.FeeTkrR
    FeeTkrR = 0
    WltBal = WltBal_obj[ass.SettleCoin] || 0;
    // **** 2020-7-23 乐臣  *****  处理pos.Lver没有返回的情况（y也就是全部是全仓的订单）
    let lever = pos.MIR ? 0 : 1;

    UrL2 = Number(Math.abs(SumUrlForLever0[ass.SettleCoin] - pos.aUrL)+ sumMI[ass.SettleCoin])

    //计算强平价相关的WltForPos用原公式的仓位保证金计算公式
    if(lever == 0){
      WltForPos = WltBal - pos.aMgnCalcAndMgnISO - UrL2 - Math.abs(SumMM[ass.SettleCoin] - pos._MM)//Math.abs(SumMMForLever0[ass.SettleCoin] - pos._MM)
    }else{
      WltForPos = pos.aMM
      AdjustLevelMax = pos.aValIni / (pos.aMM-pos.aUrL-pos.MgnISO-pos.PNLISO)
      AdjustLeverMin = pos.aValIni / (pos.aMM + WltBal - UsedWltBal[ass.SettleCoin])
    }
    
    LeverEffective = Math.abs(pos.aValIni)/WltForPos

    pos.aLeverEffective = LeverEffective
    pos.aAdjustLevelMax = AdjustLevelMax
    pos.aAdjustLeverMin = AdjustLeverMin

    let isReverse = ((ass.Flag&1) == 1 || ass.TrdCls == 2)?1:0
    let MMR = 0;
    if(PrzLiqType && pos.Lever == 0){
      MMR = Math.max(pos.MIRMy/2, pos.aMMR)
    }else{
      MMR = pos.aMMR
    }
    let PrzLiq = library.calcPrzLiq(isReverse, pos.PrzIni, pos.aValIni, WltForPos, FeeTkrR, MMR, ass.LotSz, pos.Sz, ass.PrzMinInc, ass.PrzMax)

    pos.aPrzLiq = PrzLiq
    // pos.aPrzBr = PrzBr


    let MgnRateforPrzM = 0, MgnRateforLiq = 0;
    
    if((ass.Flag&1) == 1 || ass.TrdCls == 2){
      MgnRateforPrzM = tick.SettPrz?1 - pos.PrzIni/tick.SettPrz:0
      MgnRateforLiq = 1 - pos.PrzIni/PrzLiq
     }else {
      MgnRateforPrzM = tick.SettPrz/pos.PrzIni - 1
      MgnRateforLiq = PrzLiq/pos.PrzIni - 1
    }


    pos.aMgnRateforPrzM = MgnRateforPrzM
    pos.aMgnRateforLiq = MgnRateforLiq

    pos.aAvailBal = (WltBal - (UsedWltBal[ass.SettleCoin] || 0))
    pos.aAvailBal = pos.aAvailBal>0?pos.aAvailBal:0
  };
  return posArr_pos1;
}

/**
 * 钱包数据计算
 * @param {Array} wallets 
 * @param {Array} posArr 
 * @param {String} UPNLPrzActive 
 * @param {Object} sumMI 
 * @param {Object} UsedWltBal 
 * @param {Object} assetD 
 * 计算后钱包数据新增字段，MgnBal:保证金余额，aMM:总仓位保证金 , aMI:总委托保证金, aUPNL: 总未实现盈亏, aGift可用赠金, aWdrawable可用保证金， maxTransfer最大划转
 */
export var calcfutureWallet =(wallets_clone, posArr, UPNLPrzActive, sumMI, UsedWltBal, assetD) => {
  let wallets = _.cloneDeep(wallets_clone);
  for(let i = 0; i< wallets.length;i++){
    let wallet = wallets[i], MgnBal = 0, AvailBal = 0, GiftRemain = 0, Wdrawable = 0, WltBal = 0, PNLISO = 0, SumUrP = 0, SumUrlForLever0 = 0, profit = 0, aUPNL = 0, aPNL = 0, maxTransfer = 0, SumMM = {};
    
    for(let i = 0; i< posArr.length;i++){
      let pos = posArr[i]
      let ass = assetD[pos.Sym] || {}
      if(ass.SettleCoin == wallet.Coin){
        PNLISO += (pos.PNLISO || 0)
        aUPNL += (pos.aUPNLforM || 0)
        aPNL += (pos.RPNL || 0)
        if(!SumMM[ass.SettleCoin]){
          SumMM[ass.SettleCoin] = 0
        }
        SumMM[ass.SettleCoin] += (pos.aMM || 0)
      } 
    }
    WltBal = (wallet.Depo || 0) - (wallet.WDrw || 0) + (wallet.PNL || 0) + (wallet.PNLG || 0) + (wallet.Gift || 0) + (wallet.Spot || 0)
    MgnBal = WltBal + PNLISO + aUPNL//SumUrP + SumUrlForLever0
    
    AvailBal = WltBal - (UsedWltBal[wallet.Coin] || 0)
    AvailBal = AvailBal>0?AvailBal:0

    GiftRemain = (wallet.Gift || 0) + (wallet.PNLG || 0)
    GiftRemain = GiftRemain>0?GiftRemain:0

    Wdrawable = WltBal - GiftRemain - (UsedWltBal[wallet.Coin] > GiftRemain? (UsedWltBal[wallet.Coin] || 0) - GiftRemain: 0)
    // Wdrawable = Wdrawable>0?Wdrawable:0

    profit = (UsedWltBal[wallet.Coin] || 0) / WltBal
    // WltBal += PNLISO

    WltBal = WltBal > 0?WltBal:0
    MgnBal = MgnBal > 0?MgnBal:0
    Wdrawable = Wdrawable > 0?Wdrawable:0


    wallet.WltBal = WltBal
    wallet.MgnBal = MgnBal
    wallet.aMI = (sumMI[wallet.Coin] || 0)
    wallet.aMM = SumMM[wallet.Coin] || 0
    wallet.aUPNL = aUPNL
    wallet.aPNL = aPNL
    wallet.aGift = GiftRemain
    wallet.aWdrawable = AvailBal
    wallet.maxTransfer = Wdrawable
    wallet.walletRate = 1- AvailBal/WltBal
  };
  return wallets;
}

