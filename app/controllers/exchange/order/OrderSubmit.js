import React, { PureComponent } from 'react';
import Checkbox from '$components/kb-design/Checkbox';
import Button from '$components/kb-design/Button';
import { connect } from 'react-redux';
import store from '$store';
import Toast from '$components/kb-design/Toast';
import MgnNeed from './orderComponents/MgnNeed';
import SellPositionsNums from './orderComponents/SellPositionsNums';
import consts from '$consts';
import debouce from 'lodash/debounce';
import asyncFunc from '$lib/order/asyncFunc';

class OrderSubmit extends PureComponent {
  constructor(props){
    super(props);
    this.dispatchChecked = debouce(this.dispatchChecked, 300);
  };
  dispatchChecked = (v, fn) => {
    fn(v);
  };
  // 做多
  buyPositionClick = () => {
    const { orderNewForBuy, aWdrawable, mgnBuy, orderNewLotSubscribe, 
            clearInputValue, activeSelect } = this.props;
    if( orderNewForBuy && orderNewForBuy.Qty && orderNewForBuy.Prz){
     if ( (mgnBuy  && aWdrawable) && mgnBuy > aWdrawable ) {
       Toast({content:'所需保证金不足', type:'error'});
       clearInputValue();
     };
     if ( (activeSelect === 2 || activeSelect === 3) && !orderNewForBuy.StopPrz){
      Toast({content:'请输入标记价格', type:'error'});
      clearInputValue();
     } else {
        // asyncFunc.funcOne(() => { 
        orderNewLotSubscribe(orderNewForBuy) 
      //  }, clearInputValue);
     }
    } else {
      Toast({content:'请输入价格或数量', type:'error'});
      clearInputValue();
     };
  };

  // 做空
  sellPositionClcik = ( ) => {
    const { orderNewForSell, aWdrawable, mgnSell, orderNewEmpSubscribe, activeSelect, clearInputValue } = this.props;
    if( orderNewForSell && orderNewForSell.Qty && orderNewForSell.Prz){
      if ( (mgnSell  && aWdrawable) && mgnSell > aWdrawable ) {
        Toast({content:'所需保证金不足', type:'error'});
        clearInputValue();
      };
      if ( (activeSelect === 2 || activeSelect === 3) && !orderNewForSell.StopPrz){
       Toast({content:'请输入标记价格', type:'error'});
       clearInputValue();
      } else {
        asyncFunc.funcOne(() => { 
          orderNewEmpSubscribe(orderNewForSell)
        }, clearInputValue);
      }
     } else {
       Toast({content:'请输入价格或数量', type:'error'});
       clearInputValue();
      };
  };

  // 平多
  closePositionForLotClick = ( ) => {
    const { POSOP } = consts;
    const { closePositionsLotNums, closePoitionsToLot, closePositionLotSubscribe, 
            posOpSubscribe, userInfo, activeSelect, clearInputValue } = this.props;
    if( closePoitionsToLot && closePoitionsToLot.Qty && closePoitionsToLot.Prz){
      if( closePoitionsToLot.Qty > closePositionsLotNums){
        Toast({content:'超过最大可平张数', type:'error'});
        clearInputValue();
       } else {
         console.log(closePoitionsToLot)
        // asyncFunc.funcTwo(() => {
        //   closePositionLotSubscribe(closePoitionsToLot);
        //  }, () => {
        //    posOpSubscribe(userInfo,closePoitionsToLot.PId, POSOP.DEL);
        //  }, clearInputValue);
       }
    } else {
      Toast({content:'请输入价格或数量', type:'error'});
      clearInputValue();
    }
  };
  // 平空
  closePositionForEmptyClick = () => {
    const { POSOP } = consts;
    const { closePoitionsToEmp, closePositionsEmpNums, closePositionEmpSubscribe, 
            posOpSubscribe, userInfo, clearInputValue} = this.props;
    if( closePoitionsToEmp && closePoitionsToEmp.Qty && closePoitionsToEmp.Prz){
     if( closePoitionsToEmp.Qty > closePositionsEmpNums){
      Toast({content:'超过最大可平张数', type:'error'});
      clearInputValue();
     } else{
       asyncFunc.funcTwo(() => {
        closePositionEmpSubscribe(closePoitionsToEmp);
       }, () => {
         posOpSubscribe(userInfo,closePoitionsToEmp.PId, POSOP.DEL);
       }, clearInputValue);
     }
    //  closePositionEmpSubscribe(closePoitionsToEmp);
    //  posOpSubscribe(userInfo,closePoitionsToEmp.PId, POSOP.DEL);
    } else {
      Toast({content:'请输入价格或数量', type:'error'});
      clearInputValue();
    }
  };
  checkboxClick = (e) => {
    const { setPassiveChecked } = this.props;
    this.dispatchChecked( e.target.checked, setPassiveChecked);
  };
 
  render() {
    const { buySubmitFlag, sellSubmitFlag , closePotionForLotFlag, 
            closePotionForEmptyFlag, sellPositionFlag, openPosition} = this.props;
    return (
      <div className="order-submit">
        <div className="order-flag">
          <Checkbox onClick={this.checkboxClick}> 被动委托</Checkbox>
          {/*  目前没这个功能 暂时先注释掉 2020-8-1 by carline ***
           **** 备注: 如果用户选了被动委托 orderFlag为1 如果能立即成交就成交不能立即成交就系统撤单，所以对应TIf设置为
                      选了被动委托就 IFC 没选就GTC默认 参数根据ordFLag来填写
          <Checkbox className="flag-margin"> 生效时间</Checkbox>
          <Select defaultValue="GTC" className="flag-select">
            <Option>
              GTC
            </Option>
            <Option>
              OFC
            </Option>
            <Option>
              IFC
            </Option>
          </Select> */}
        </div>
        {
          openPosition === 0 ? 
          <div className="position-box">
          <div className="open-position">
            <Button 
              className="open-positon-button"
              onClick={this.buyPositionClick}
              disabled={ buySubmitFlag }
            >
              买入开多
            </Button>
          </div>
          <div className="sell-position">
            <Button 
              className="sell-position-button"
              onClick={this.sellPositionClcik}
              disabled={ sellSubmitFlag }
            >
              卖出开空
            </Button>
          </div>
        </div>
          :
          <div className="position-box">
          <div className="open-position">
            <Button 
              className="sell-position-button"
              disabled={ closePotionForLotFlag}
              onClick={this.closePositionForLotClick}
            >
              卖出平多
            </Button>
          </div>
          <div className="sell-position">
            <Button 
              className="open-positon-button"
              disabled={ closePotionForEmptyFlag }
              onClick={this.closePositionForEmptyClick}
            >
              买入平空
            </Button>
          </div>
        </div>
        }
        {sellPositionFlag ? <SellPositionsNums /> : <MgnNeed />}
      </div>
    );
  }
}

const mapStateToProps = ({loading, ...state}) => ({
  activeSelect: state.tabs.activeSelect,
  mgnBuy: store.select.caclOrder.mgnbuy(state),
  mgnSell: store.select.caclOrder.mgnsell(state),
  aWdrawable: store.select.caclOrder.aWdrawable(state),
  newOrders: state.submitOrder,
  sellPositionFlag: state.sellPosition.flag,
  buySubmitFlag: loading.effects.submitOrder.orderNewLotSubscribe,
  sellSubmitFlag: loading.effects.submitOrder.orderNewEmpSubscribe,
  closePotionForLotFlag: loading.effects.submitOrder.closePositionLotSubscribe,
  closePotionForEmptyFlag: loading.effects.submitOrder.closePositionEmpSubscribe,
  userInfo: state.login.userInfo,
  openPosition: state.tabs.openPosition,
  orderNewForBuy: store.select.caclOrder.orderNewForBuy(state),
  orderNewForSell: store.select.caclOrder.orderNewForSell(state),
  closePositionsLotNums: store.select.caclOrder.closePositionsWithLotNums(state),
  closePositionsEmpNums: store.select.caclOrder.closePositionsWithEmpNums(state),
  closePoitionsToLot: store.select.caclOrder.closePoitionsToLot(state),
  closePoitionsToEmp: store.select.caclOrder.closePoitionsToEmp(state),
});
const mapDispatch = (dispatch) => ({
  orderNewLotSubscribe: dispatch.submitOrder.orderNewLotSubscribe,
  orderNewEmpSubscribe: dispatch.submitOrder.orderNewEmpSubscribe,
  closePositionLotSubscribe: dispatch.submitOrder.closePositionLotSubscribe,
  closePositionEmpSubscribe: dispatch.submitOrder.closePositionEmpSubscribe,
  posOpSubscribe: dispatch.posOp.posOpSubscribe,
  setPassiveChecked: dispatch.tabs.setPassiveChecked,
  clearInputValue: dispatch.setInputValue.clearInputValue,
})
export default connect(mapStateToProps, mapDispatch)(OrderSubmit);
