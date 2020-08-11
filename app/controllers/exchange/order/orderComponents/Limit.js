import React, { Component } from 'react';
import { connect } from 'react-redux';
import KbInput from '$components/kb-design/Input';
import AvailableFunds from './AvailableFunds';
import debounce from 'lodash/debounce';
import consts from '$consts';

class Limit extends Component {
  constructor(){
    super();
    this.state= {
      limitPrice: '',
    }
    this.dispatchLimit = debounce(this.dispatchLimit, 300);
  };
  dispatchLimit = (v, fn) => {
    fn(v);
  };
  orderInputChange = (e, type) => {
    const value = e.target.value;
    const { setLimitNums, setLimitPrice } = this.props;
    const { ORDER } = consts;
    if ( type === ORDER.PRICE){
      this.setState({
        limitPrice: value
      }, () => {
        this.dispatchLimit(value, setLimitPrice);
      })
    } else {
      this.dispatchLimit(value, setLimitNums);
    }
  };
  fouceChange = () => {
    const { handleSelectPrice, deepthPrice, setLimitPrice } = this.props;
    const restPrice = '';
    if ( deepthPrice){
      this.setState({
        limitPrice: deepthPrice,
      }, () => {
        handleSelectPrice(restPrice);
      })
    }
    this.dispatchLimit(deepthPrice, setLimitPrice);
  };

  render() {
    const { currentCoin, limitNums, deepthPrice  } = this.props;
    const { limitPrice } = this.state;
    return(
      <>
        <AvailableFunds />
        <KbInput 
          prefix="委托价"
          suffix={currentCoin}
          value={ deepthPrice ? deepthPrice : limitPrice }
          placeholder={deepthPrice}
          type="number"
          name="limitPrice"
          onFocus={this.fouceChange}
          onChange={(e) => this.orderInputChange(e, 0)}
        />
        <KbInput 
          prefix="数量"
          suffix="张"
          name='limitNums'
          type="number"
          value={limitNums}
          onChange={(e) => this.orderInputChange(e, 1)}
        />
      </>
    )
  }
};
const mapStateToProps = (state) => ({
  currentCoin: state.ticker.selectTab,
  limitNums: state.setInputValue.limitNums,
  limitPrice: state.setInputValue.limitPrice,
  deepthPrice: state.depth.selectPrice,
});
const mapDispatch = (dispatch) => ({
  setLimitPrice: dispatch.setInputValue.setLimitPrice,
  setLimitNums: dispatch.setInputValue.setLimitNums,
  handleSelectPrice: dispatch.depth.handleSelectPrice,
})
export default connect(mapStateToProps, mapDispatch)(Limit)