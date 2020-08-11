import React, { Component } from 'react';
import { connect } from 'react-redux';
import KbInput from '$components/kb-design/Input';
import AvailableFunds from './AvailableFunds';
import { Select, Option } from '$components/kb-design/Select';
import store from '$store';
import debounce from 'lodash/debounce';
import consts from '$consts';

class LimitOrder extends Component {
  constructor(){
    super();
    this.state= {
      isMarkePrice: false,
      limitOrderPrice: '',
      selectMkPrzOne:'',
    }
    this.dispatchLimitOrder = debounce(this.dispatchLimitOrder, 300);
    this.dispatchLimitOrderSelect = debounce(this.dispatchLimitOrderSelect, 500);
  };
  dispatchLimitOrder = (v, fn) => {
    fn(v);
  };
  dispatchLimitOrderSelect = (v, fn) => {
    fn(v);
  };
  orderInputChange = (e, type) => {
    const  value = e.target.value;
    const { ORDER } = consts;
    const { setLimitOrderNums, setLimitOrderPrice, setSelectMkPrzOne } = this.props;
    if ( type === ORDER.SELECT){
      this.setState({
        selectMkPrzOne: value
      }, () => {
        this.dispatchLimitOrder(value, setSelectMkPrzOne);
      })
    } else if ( type === ORDER.NUMBERS){
      this.dispatchLimitOrder(value, setLimitOrderNums);
    } else {
      this.setState({
        limitOrderPrice: value,
      }, () => {
        this.dispatchLimitOrder(value, setLimitOrderPrice);
      })
    };
    };

  delegateOne = (index) => {
    const {  PrzIndex, PrzLatest } = this.props.currentAssetD;
    const { setWhichSelectOne, setSelectMkPrzOne } = this.props;
    if(index === '0'){
      this.setState({
        isMarkePrice: false,
      });
      this.dispatchLimitOrder(index, setWhichSelectOne);
    } else if ( index === '1'){
      this.setState({
        isMarkePrice: true,
        selectMkPrzOne: PrzIndex,
      });
      this.dispatchLimitOrder(index, setWhichSelectOne);
      this.dispatchLimitOrderSelect(PrzIndex, setSelectMkPrzOne);
    } else {
      this.setState({
        isMarkePrice: true,
        selectMkPrzOne: PrzLatest,
      });
      this.dispatchLimitOrder(index, setWhichSelectOne);
      this.dispatchLimitOrderSelect(PrzLatest, setSelectMkPrzOne);
    }
  };
  priceOnFocus = () => {
    const { handleSelectPrice, deepthPrice, setLimitOrderPrice } = this.props;
    const restPrice = '';
    if ( deepthPrice){
      this.setState({
        limitOrderPrice: deepthPrice,
      }, () => {
        handleSelectPrice(restPrice);
      });
    };
    this.dispatchLimitOrderSelect(deepthPrice, setLimitOrderPrice);
  }
  render() {
    const { isMarkePrice, limitOrderPrice, selectMkPrzOne} = this.state;
    const { currentAssetD, limitOrderNums, deepthPrice } = this.props;
    return(
      <>
        <AvailableFunds />
        <div className="offer-type">
          <KbInput 
            prefix="触发价"
            suffix={currentAssetD.SettleCoin}
            type="number"
            value={selectMkPrzOne}
            onChange= {(e) => this.orderInputChange(e, 2)}
            className="limit-price"
            disabled={isMarkePrice}
          />
          <Select onSelect={(index) => this.delegateOne(index)} defaultIndex="0">
            <Option value="标记价格" />
            <Option value="指数价格"/>
            <Option value="最新价格"/>
          </Select>
        </div>
        <KbInput 
          prefix="委托价"
          suffix={currentAssetD.SettleCoin}
          value={deepthPrice ? deepthPrice : limitOrderPrice}
          onFocus={this.priceOnFocus}
          type="number"
          name="limitOrderPrice"
          onChange={(e) => this.orderInputChange(e, 0)}
        />
        <KbInput 
          prefix="数量"
          suffix="张"
          defaultValue={limitOrderNums}
          type="number"
          name="limitOrderNums"
          onChange={(e) => this.orderInputChange(e, 1)}
        />
      </>
    )
  }
};
const mapStateToProps = (state) => ({
  selectMkPrzOne: state.setInputValue.selectMkPrzOne,
  limitOrderNums: state.setInputValue.limitOrderNums,
  limitOrderPrice: state.setInputValue.limitOrderPrice,
  currentAssetD: store.select.ticker.mergeTick(state.ticker),
  deepthPrice: state.depth.selectPrice,
});
const mapDispatch = (dispatch) => ({
  setLimitOrderPrice: dispatch.setInputValue.setLimitOrderPrice,
  setLimitOrderNums: dispatch.setInputValue.setLimitOrderNums,
  setWhichSelectOne: dispatch.setInputValue.setWhichSelectOne,
  setSelectMkPrzOne: dispatch.setInputValue.setSelectMkPrzOne,
  handleSelectPrice: dispatch.depth.handleSelectPrice,
});
export default connect(mapStateToProps, mapDispatch)(LimitOrder)