import React, { Component } from 'react';
import { injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import Container from '$components/kb-design/Container';
import { Tabs, TabPane } from '$components/kb-design/KTabs';
import DepthAskSide from '$components/icons/DepthAskSide';
import DepthBidSide from '$components/icons/DepthBidSide';
import DepthBothSide from '$components/icons/DepthBothSide';
import DepthTopBar from './DepthTopBar';
import DepthTable from './DepthTable';
import DepthBothPane from './DepthBothPane';


const messages = defineMessages({
  price: {
    id: 'depth.price',
    defaultMessage: 'Price',
    description: '价格'
  },
  amount: {
    id: 'depth.amount',
    defaultMessage: 'Amount',
    description: '数量'
  },
  sum: {
    id: 'depth.sum',
    defaultMessage: 'Sum',
    description: '金额'
  }
})

class DepthArea extends Component {
  componentDidMount() {
    const {
      subscribing,
      subscribe,
      symbol,
    } = this.props;
    if (!subscribing) subscribe(symbol);
  }

  shouldComponentUpdate(nextProps) {
    const {
      subscribe,
      unsubscribe,
      symbol,
    } = this.props;
    if (symbol !== nextProps.symbol) {
      unsubscribe(symbol);
      subscribe(nextProps.symbol);
      return true;
    }
    return true;
  }

  componentWillUnmount() {
    const {
      subscribing,
      unsubscribe,
      symbol,
    } = this.props;
    if (subscribing) unsubscribe(symbol);
  }

  handlePrice(depth) {
    if (depth[0] && depth[0].props) {
      const price = depth[0].props.children;
      this.props.handleSelectPrice(price);
    }
  }

  render() {
    const {
      intl,
      asks,
      bids,
      symbol,
      ticker,
    } = this.props;

    const title = [
      {
        key: 0,
        width: 3,
        title: intl.formatMessage(messages.price),
      },
      {
        key: 1,
        width: 3,
        title: intl.formatMessage(messages.amount),
      },
      {
        key: 2,
        width: 3,
        title: intl.formatMessage(messages.sum),
      },
    ]
    return (
      <Container flex direction="column" className="depth-container">
        {/* <DepthTopBar /> */}
        <Tabs defaultIndex="0">
          <TabPane tab={<DepthBothSide />}>
            <DepthBothPane title={title} asks={asks} bids={bids} symbol={symbol} ticker={ticker} handleSelectPrice={(depth) => this.handlePrice(depth)} />
          </TabPane>
          <TabPane tab={<DepthAskSide />}>
            <DepthBothPane title={title} asks={asks} symbol={symbol} ticker={ticker} handleSelectPrice={(depth) => this.handlePrice(depth)} />
          </TabPane>
          <TabPane tab={<DepthBidSide />}>
            <DepthBothPane title={title} bids={bids} symbol={symbol} ticker={ticker} handleSelectPrice={(depth) => this.handlePrice(depth)} />
          </TabPane>
        </Tabs>
      </Container>
    );
  }
}

const mapState = (state) => {
  return {
    subscribing: state.depth.subscribing,
    asks: state.depth.asks,
    bids: state.depth.bids,
    symbol: state.ticker.currentSymbol,
    ticker: state.ticker.currentTicker,
  };
};

const mapDispatch = (dispatch) => ({
  subscribe: dispatch.depth.subscribe,
  unsubscribe: dispatch.depth.unsubscribe,
  handleSelectPrice: dispatch.depth.handleSelectPrice,
});

export default connect(mapState, mapDispatch)(injectIntl(DepthArea));
