import React, { Component } from 'react';
import { connect } from 'react-redux';
import KbInput from '$components/kb-design/Input';
import AvailableFunds from './AvailableFunds';
import debounce from 'lodash/debounce';

class Market extends Component {
  constructor(){
    super();
    this.dispatchNums = debounce(this.dispatchNums, 300);
  };
  dispatchNums = (val, fn) => {
    fn(val);
  };
  orderInputChange = ( e ) => {
    const value = e.target.value;
    const { setMaketNums } = this.props;
    this.dispatchNums(value, setMaketNums)
  };

  render() {
    const { currentCoin, marketNums } = this.props;
    return(
      <>
        <AvailableFunds />
        <KbInput 
          prefix="委托价"
          suffix={ currentCoin}
          disabled
          defaultValue="按市场最优价成交"
        />
        <KbInput 
          prefix="数量"
          suffix="张"
          type="number"
          value={marketNums}
          name="marketNums"
          onChange={(e) => this.orderInputChange(e)}
        /> 
      </>
    )
  }
};
const mapStateToProps = (state) => ({
  currentCoin: state.ticker.selectTab,
  marketNums: state.setInputValue.marketNums,
});
const mapDispatch = (dispatch) => ({
  setMaketNums: dispatch.setInputValue.setMaketNums,
})
export default connect(mapStateToProps, mapDispatch)(Market)