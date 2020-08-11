/* eslint-disable lines-between-class-members */
import '$styles/exchange/rootView.less';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '$store';
// import KLineChart from './kline';
import ChartArea from './chartArea';
import DepthArea from './depthArea';
import FillsArea from './fillsArea';
import AssetDetail from './asset';
import Container from '$components/kb-design/Container';
import Order from './order';
import Recognizance from './recognizance';
import OrderTable  from './orderTable';

class RootView extends Component {
  componentDidMount() {
    this.props.subscribe();
    this.props.getAssetD();
    this.props.getCompositeIndex();
  }

  shouldComponentUpdate(nextProps) {
    const {
      ticker,
      indexList,
      subscribeIndex,
      unsubscribeIndex,
    } = this.props;
    // 因为是select里的数据，会数据更改不一致，所以使用ToC判断
    if (ticker.ToC && nextProps.ticker.ToC && ticker.ToC !== nextProps.ticker.ToC) {
      unsubscribeIndex({indexList, symbol: ticker.ToC});
      subscribeIndex({indexList, symbol: nextProps.ticker.ToC});
      return true;
    }
    return true;
  }

  render() {
    return (
      <Container className="flex-col-1" flex justify="space-between" style={{ marginTop: 52, minHeight: 'calc(100vh - 52px)', maxHeight: 'calc(100vh - 52px)' }}>
        <Container flex direction="column" className="page-exchange-container">
          <Container flex justify="space-between" className="page-exchange-content">
            {/* <ChartArea /> */}
            <Container flex direction="column" className="page-deal-container">
              {/* 买卖盘 */}
              <Container className="page-buy-sell">
                <DepthArea />
              </Container>
              {/* 最新成交 */}
              <Container className="page-lastest">
                <FillsArea />
              </Container>
            </Container>
          </Container>
          {/* 表格数据 */}
          {/* <OrderTable /> */}
        </Container>
        <Container flex direction="column" className="page-order-container">
          {/* 下单 */}
          <Container className="page-order-content">
            <Order />
          </Container>
          {/* 保证金 */}
          <Container className="page-earnest-content">
            <Recognizance />
          </Container>
          <Container className="page-asset-content">
            <AssetDetail />
          </Container>
        </Container>
      </Container>
    );
  }
}

const mapState = (state) => {
  return {
    orders: state.order.orders,
    symbol: state.ticker.currentSymbol,
    indexList: state.ticker.indexList,
    ticker: store.select.ticker.mergeTick(state.ticker),
  };
};

const mapDispatch = (dispatch) => ({
  subscribe: dispatch.login.subscribe,
  getAssetD: dispatch.ticker.getAssetD,
  getCompositeIndex: dispatch.ticker.getCompositeIndex,
  subscribeIndex: dispatch.ticker.subscribeIndex,
  unsubscribeIndex: dispatch.ticker.unsubscribeIndex,
  subscribeOrder: dispatch.order.subscribe,
});

export default connect(mapState, mapDispatch)(RootView);
