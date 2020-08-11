
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { CalculatorIcon } from '$components/icons';
import Button from '$components/kb-design/Button';
import Warehouse from './Warehouse';
import Lever from './slider';
import { connect } from 'react-redux';
import Toast from '$components/kb-design/Toast';
import debounce from 'lodash/debounce';
import store from '$store'; 

class OrderHeader extends PureComponent {
  constructor() {
    super();
    this.state = {
      postionActive: true,
      isShowWarehouse: false,
      isShowLever: false,
    };
    this.dispatchPositions = debounce(this.dispatchPositions, 100);
    this.dispatchFlag = debounce(this.dispatchFlag, 500);
  };
  dispatchPositions = (v, fn) => {
    fn(v);
  };
  dispatchFlag = (v, fn) => {
    fn(v);
  };

  positonClick = ( ) => {
   const { hasPositions, hasOrders } = this.props;
   if ( hasOrders  || hasPositions && hasPositions.Sz){
     Toast({content:'当前已有持仓或委托，不允许调整仓位', type:'error'})
   } else {
    this.setState( (pre ) => {
      return {
        isShowWarehouse: !pre.isShowWarehouse,
      };
    });
   };
  };

  leverClick = () => {
    const { hasOrders, hasPositions } = this.props;
    if ( hasOrders  || hasPositions && hasPositions.Sz){
      Toast({content:'当前已有持仓或委托，不允许调整仓位', type:'error'})
    } else {
      this.setState( (pre ) => {
        return {
          isShowLever: !pre.isShowLever,
        }
      });
    };
  };

  handleBtnClick = () => {
    const { setOpenPositions, sellPositionFlag, clearInputValue} = this.props;
    this.setState((pre) => {
      return {
        postionActive: !pre.postionActive
      }
    }, () => {
      const { postionActive } = this.state;
      if (postionActive === true ){
        this.dispatchPositions(0, setOpenPositions);
        this.dispatchFlag(false, sellPositionFlag);
      } else {
        this.dispatchPositions(1, setOpenPositions);
        this.dispatchFlag(true, sellPositionFlag);
      }
    });
    clearInputValue();
  };
  render() {
    const { postionActive, isShowWarehouse, isShowLever } = this.state;
    const {  quanCang, lever } = this.props;
    const openPositon = classNames('position', {
      'is-active': postionActive,
    });
    const closeOut = classNames('position', {
      'is-active': !postionActive,
    });
    return (
      <div className="order-header">
        <div className="header-box">
          <span className="order-title">下单</span>
          <span className="calculator-icon">
            <CalculatorIcon />
          </span>
        </div>
        <div className="header-desc">
          <Button
            btnType="default"
            className="header-button"
            onClick={this.positonClick}
          >
            { quanCang === 1 ? '逐仓' : '全仓'}
          </Button>
          <Button
            btnType="default"
            className="header-button"
            onClick={this.leverClick}
          >
            { `${lever}X`}
          </Button>
          <Button
            btnType="default"
            className="header-button"
          >
            BTC
          </Button>
        </div>
        <div className="order-position">
          <Button
            className={openPositon}
            onClick={this.handleBtnClick}
          >
            开仓
          </Button>
          <Button
            className={closeOut}
            onClick={this.handleBtnClick}
          >
            平仓
          </Button>
        </div>
        { isShowWarehouse && <Warehouse warehouseClick={this.positonClick} />}
        { isShowLever && <Lever leverClick={this.leverClick}  /> }
        {/* 下面lever 代码今日测试用  2020-7-31 */}
        {/* {<Lever leverClick={this.leverClick} leverValueChange={this.leverValueChange} />} */}
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  quanCang: state.tabs.quanCang,
  hasPositions: store.select.caclOrder.hasPositions(state),
  hasOrders: store.select.caclOrder.hasOrders(state),
  lever: store.select.caclOrder.lever(state),
});
const mapDispatch = (dispatch) => ({
  sellPositionFlag: dispatch.sellPosition.setSellPositionFlag,
  setQuancang: dispatch.tabs.setQuancang,
  setOpenPositions: dispatch.tabs.setOpenPositions,
  clearInputValue: dispatch.setInputValue.clearInputValue,
})
export default connect(mapStateToProps, mapDispatch)(OrderHeader);
