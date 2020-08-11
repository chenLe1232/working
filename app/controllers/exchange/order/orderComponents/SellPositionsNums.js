import React, { Component } from 'react';
import { connect } from 'react-redux';
import caclSellPositionsNums from '$lib/order/caclSellPositionsNums';
import store from '$store';


class SellPositionsNums extends Component{
  constructor(){
    super();
    // this.state = {
    //   sellNums: 0,
    //   buyNums: 0,
    // }
  }
  // static getDerivedStateFromProps(nextProps, prevState){
  //   const { positions, currentSymbol } = nextProps;
  //   if (positions.length > 0 && currentSymbol){
  //     const { buyNums,sellNums } = caclSellPositionsNums(positions, currentSymbol)
  //     if(prevState.sellNums !== sellNums || prevState.buyNums !== buyNums){
  //       return {
  //         sellNums: sellNums,
  //         buyNums: buyNums,
  //       }
  //     }
  //   }
  //   return null;
  // };

  render() {
    // const { buyNums, sellNums } = this.state;
    const { closePositionsEmpNums, closePositionsLotNums } = this.props;
    return(
      <div className="sellPotions" style={{color:'#fff', display:'flex', justifyContent:'space-around', fontSize:'12px',marginTop:'-2px'}}>
        <p>可平张数:{closePositionsLotNums}</p>
        <p>可平张数:{closePositionsEmpNums}</p>
      </div>
    )
  };
}

const mapStateToProps = (state) => ({
  closePositionsLotNums: store.select.caclOrder.closePositionsWithLotNums(state),
  closePositionsEmpNums: store.select.caclOrder.closePositionsWithEmpNums(state),
})
export default connect(mapStateToProps,null)(SellPositionsNums)