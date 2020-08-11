import '$styles/exchange/recognizance.less';
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import store from '$store';

class Recognizance extends PureComponent {
  constructor(){
    super();
  }

  render() {
    const { stillPrice, aWdrawable, currentCoin } = this.props;
    return (
      <div className="recognizance-box">
        <p className="title">保证金</p>
        <div className="detail-box">
          <span className="text-descript">保证金比例</span>
          <span className="num-descript color">{`${ aWdrawable > 0 ? Number(stillPrice/aWdrawable).toFixed(4) : 0}%`}</span>
        </div>
        <div className="detail-box">
          <span className="text-descript">维持保证金</span>
          <span className="num-descript">{`${stillPrice} ${currentCoin}`}</span>
        </div>
        <div className="detail-box">
          <span className="text-descript">保证金余额</span>
          <span className="num-descript">{`${aWdrawable}${currentCoin}`}</span>
        </div>
      </div>
    );
  }
}

const mapStateToprops = (state) => ({
  stillPrice: store.select.caclOrder.stillPrice(state),
  aWdrawable: store.select.caclOrder.aWdrawable(state),
  currentCoin: store.select.ticker.mergeTick(state.ticker).SettleCoin,
});
export default connect(mapStateToprops, null)(Recognizance);
