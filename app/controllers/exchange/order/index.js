import '$styles/exchange/order/index.less';
import React from 'react';
import OrderHeader from './OrderHeader';
import OrderMain from './OrderMain';
import store from '$store';
import { connect } from 'react-redux';
class Order extends React.Component {
  constructor() {
    super();
    // quancnag 0 全仓 1 逐仓  openpositon 0 开仓 1 平仓
    this.state = {
      quancang:0,
      openposition: 0,
      lever: 20,
    }
  }
  getPosition =(position) => {
    if(position || position === 0){
      this.setState({
        openposition: position
      })
    }
  };
  getQuancang = (flag) => {
    if(flag){
      this.setState({
        quancang: flag
      })
    }
  };
  getLever = (lever) => {
    if(lever){
      this.setState({
        lever,
      })
    }
  };

  render() {
    const { quancang, openposition, lever } = this.state;
    return (
      <div className="order">
        <OrderHeader />
        <OrderMain />
      </div>
    );
  }
}
const mapDispatchToProps = (state) => ({
  // test: store.select.caclOrder.getRecog(state),
});
const mapDispatch = () => ({

}) 

export default connect(mapDispatchToProps, mapDispatch)(Order);;
