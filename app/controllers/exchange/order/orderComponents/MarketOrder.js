import React, { Component } from 'react';
import { connect } from 'react-redux';
import KbInput from '$components/kb-design/Input';
import AvailableFunds from './AvailableFunds';
import { Select, Option } from '$components/kb-design/Select';
import store from '$store';
import debounce from 'lodash/debounce';
import consts from '$consts'

class LimitOrder extends Component {
  constructor(){
    super();
    this.state= {
      isMarkePrice: false,
      selectMkPrzTwo: '',
    };
    this.dispatchMarketOrder = debounce(this.dispatchMarketOrder, 300);
    this.dispatchMarketOrderSelect = debounce(this.dispatchMarketOrderSelect, 500);
  };
  dispatchMarketOrder = (v, fn) => {
    fn(v);
  };
  dispatchMarketOrderSelect = (v, fn) => {
    fn(v);
  }
  orderInputChange = ( e, type) => {
    const  value = e.target.value;
    const { ORDER } = consts;
    const { setMarketOrderNums, setSelectMkPrzTwo } = this.props;
    if ( type === ORDER.SELECT ){
      this.setState({
        selectMkPrzTwo: value,
      }, () => {
        this.dispatchMarketOrder(value, setSelectMkPrzTwo);
      });
    } else {
      this.dispatchMarketOrder(value, setMarketOrderNums);
    };
  };

  delegateOne = (index) => {
    const {  PrzIndex, PrzLatest } = this.props.currentAssetD;
    const { setWhichSelectTwo, setSelectMkPrzTwo } = this.props;
    if(index === '0'){
      this.setState({
        isMarkePrice: false,
      });
      this.dispatchMarketOrder(index, setWhichSelectTwo);
    } else if ( index === '1'){
      this.setState({
        isMarkePrice: true,
        selectMkPrzTwo: PrzIndex
      }, () => {
        this.dispatchMarketOrder(index, setWhichSelectTwo);
        this.dispatchMarketOrderSelect(PrzIndex, setSelectMkPrzTwo);
      });
    };
    this.setState({
      isMarkePrice: true,
      selectMkPrzTwo: PrzLatest
    }, () => {
      this.dispatchMarketOrder(index, setWhichSelectTwo);
      this.dispatchMarketOrderSelect(PrzLatest, setSelectMkPrzTwo);
    });
  };
  render() {
    const { isMarkePrice, selectMkPrzTwo } = this.state;
    const { currentTicker, marketOrderNums } = this.props;
    return(
      <>
        <AvailableFunds />
        <div className="offer-type">
          <KbInput 
            prefix="触发价"
            suffix={currentTicker.SettleCoin}
            type="number"
            value={selectMkPrzTwo}
            onChange= {(e) => this.orderInputChange(e, 2)}
            className="limit-price"
            disabled={isMarkePrice}
          />
          <Select onSelect={this.delegateOne} defaultIndex="0">
            <Option value="标记价格" />
            <Option value="指数价格"/>
            <Option value="最新价格"/>
          </Select>
        </div>
        <KbInput 
          prefix="委托价"
          suffix={currentTicker.SettleCoin}
          defaultValue="按市场最优价成交"
          disabled
        />
        <KbInput 
          prefix="数量"
          suffix="张"
          value={marketOrderNums}
          name="marketOrderNums"
          type="number"
          onChange={(e) => this.orderInputChange(e, 1)}
        />
      </>
    )
  }
};
const mapStateToProps = (state) => ({
  currentTicker: store.select.ticker.mergeTick(state.ticker),
  selectMkPrzTwo: state.setInputValue.selectMkPrzTwo,
  marketOrderNums: state.setInputValue.marketOrderNums,
  currentAssetD: store.select.ticker.mergeTick(state.ticker),
});
const mapDispatch = (dispatch) => ({
  setMarketOrderNums: dispatch.setInputValue.setMarketOrderNums,
  setWhichSelectTwo: dispatch.setInputValue.setWhichSelectTwo,
  setSelectMkPrzTwo: dispatch.setInputValue.setSelectMkPrzTwo,
})
export default connect(mapStateToProps, mapDispatch)(LimitOrder)