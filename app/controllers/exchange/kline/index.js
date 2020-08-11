import React, { Component } from 'react';
import { connect } from 'react-redux';
import TradingViewChart from './TradingViewChart';
import { Consumer } from '$components/ThemeContext';

class KLine extends Component {
  componentDidMount() {
    const {
      subscribing,
      subscribe,
      symbol,
      interval,
    } = this.props;
    if (!subscribing) subscribe({ symbol, interval });
  }

  shouldComponentUpdate(nextProps) {
    const {
      subscribe,
      unsubscribe,
      symbol,
      interval
    } = this.props;
    if (symbol !== nextProps.symbol && nextProps.symbol) {
      unsubscribe({ symbol, interval });
      subscribe({ symbol: nextProps.symbol, interval });
      return true;
    }
    if (interval !== nextProps.interval && nextProps.interval) {
      unsubscribe({ symbol, interval });
      subscribe({ symbol, interval: nextProps.interval });
      return true;
    }
    return true;
  }

  componentWillUnmount() {
    const {
      subscribing,
      unsubscribe,
      symbol,
      interval,
    } = this.props;
    if (subscribing) unsubscribe({ symbol, interval });
  }

  render() {
    const {
      symbol,
      handleInterval
    } = this.props;
    return (
      <div
        id="tv_chart_container"
        style={{ width: '100%', display: 'flex', justifyContent: 'stretch', flex: 1 }}
      >
        <Consumer>
          {
            ({ theme }) => <TradingViewChart theme={theme} symbol={symbol} handleInterval={handleInterval} />
          }
        </Consumer>
      </div>
    );
  }
}

const mapState = (state) => ({
  subscribing: state.kline.subscribing,
  symbol: state.ticker.currentSymbol,
  interval: state.kline.interval,
})

const mapDispatch = (dispatch) => ({
  handleInterval: dispatch.kline.handleInterval,
  subscribe: dispatch.kline.subscribe,
  unsubscribe: dispatch.kline.unsubscribe,
});

export default connect(mapState, mapDispatch)(KLine);
