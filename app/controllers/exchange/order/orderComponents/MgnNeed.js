import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import store from '$store';
import caclMgnAndAvaWallets from '$lib/order/caclMgnAndAvaWallets';
class MgnNeed extends Component{
  constructor(){
    super();
    // this.state = {
    //   mgnBuy: 0,
    //   mgnSell: 0,
    //   avaWallet: 0,
    // }
  }
 
  // static getDerivedStateFromProps(nextProps, prevState){
  //   if(  nextProps.wallets.length > 0 && nextProps.positions.length > 0){
  //     // console.log(nextProps.tabs)
  //     const { tabs, getInputValue, ...restArgs } = nextProps;
  //     const {mgnSell, mgnBuy, avaWallet } = caclMgnAndAvaWallets({...tabs, ...getInputValue, ...restArgs});
  //     if (mgnBuy !== prevState.mgnBuy || mgnSell !== prevState.mgnSell){
  //       return{
  //         mgnBuy: mgnBuy,
  //         mgnSell: mgnSell,
  //         avaWallet: avaWallet,
  //       }
  //     }
  //   }
    
  //   return null;
  // }
  render(){
    // const {mgnBuy, mgnSell } = this.state;
    const { currentCoin, mgnBuy, mgnSell } = this.props;
    return(
      <Fragment>
        <div style={{color:'#fff', display:'flex', flex:'1',justifyContent:'space-around',fontSize:'12px',marginTop:'8px'}}>
          <div>
            <p>所需保证金:</p>
            <p>{mgnBuy ? mgnBuy : 0}{currentCoin ? currentCoin : ''}</p>
          </div>
          <div>
            <p>所需保证金:</p>
            <p>{ mgnSell ? mgnSell : 0}{currentCoin ? currentCoin : ''}</p>
          </div>
        </div>
      </Fragment>
    )
  }
};
const mapStateToProps = (state) => ({
  mgnBuy: store.select.caclOrder.mgnbuy(state),
  mgnSell: store.select.caclOrder.mgnsell(state),
  currentCoin: store.select.ticker.mergeTick(state.ticker).SettleCoin,
});
export default connect(mapStateToProps, null)(MgnNeed);