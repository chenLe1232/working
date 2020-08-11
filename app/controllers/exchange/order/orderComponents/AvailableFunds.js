import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '$store';
import findArgs from '$lib/order/findPositionsAndOrdAndWal'; 


class AvailableFunds extends Component{

  render(){
    const { aWdrawable, currentCoin } = this.props;
    // const findCoin = findArgs.findPositionsAndOrdAndWal(wallets,'Coin',currentCoin);
    // const avawallet = findCoin ? Number(findCoin.Wdrawable).toFixed(2): 0;
    return (
      <div className="funds">
        <span className="funds-title">可用</span>
        <span className="funds-detail">
          {`${aWdrawable}${ aWdrawable ? currentCoin : ''}`}
        </span>
      </div>
    );
  }
};
const mapStateToPorps = (state) => ({
  // wallets: state.wallets.wallets,
  currentCoin: store.select.ticker.mergeTick(state.ticker).SettleCoin,
  aWdrawable: store.select.caclOrder.aWdrawable(state),
})
export default connect(mapStateToPorps, null)(AvailableFunds)