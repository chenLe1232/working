import React, { Component } from 'react';
import { injectIntl, defineMessages } from 'react-intl';
import store from '$store';
import { connect } from 'react-redux';
import Container from '$components/kb-design/Container';
import Typography from '$components/kb-design/Typography';

const messages = defineMessages({
  price: {
    id: 'topBar.price',
    defaultMessage: 'Mark',
    description: '标记价格',
  },
  FundingRate: {
    id: 'topBar.FundingRate',
    defaultMessage: 'Funding Rate',
    description: '资金费率'
  },
  range: {
    id: 'topBar.range',
    defaultMessage: 'Change',
    description: '24涨跌',
  },
  high: {
    id: 'topBar.high',
    defaultMessage: '24H High',
    description: '24高'
  },
  low: {
    id: 'topBar.low',
    defaultMessage: '24H Low',
    description: '24低'
  },
  volume: {
    id: 'topBar.volume',
    defaultMessage: '24H Volume',
    description: '24量'
  },
});
class ChartTitle extends Component {
  renderCoinInfo() {
    const {
      intl,
      ticker,
    } = this.props;
    const coinInfo = [
      {
        title: intl.formatMessage(messages.price),
        value: ticker.Prz
      },
      {
        title: intl.formatMessage(messages.FundingRate),
        value: ticker.FundingLongR
      },
      {
        title: intl.formatMessage(messages.range),
        value: `${ticker.Prz24 ? Number((ticker.LastPrz - ticker.Prz24) / ticker.Prz24 * 100).toFixed(2) : 0}%`
      },
      {
        title: intl.formatMessage(messages.high),
        value: ticker.High24
      },
      {
        title: intl.formatMessage(messages.low),
        value: ticker.Low24
      },
      {
        title: intl.formatMessage(messages.volume),
        value: ticker.Volume24
      },
    ]
    return (
      <>
        {coinInfo.map((item, index) => (
          <Container flex direction="column" justify="space-between" className="coin-info-item" key={index}>
            <Typography>
              {item.title}
            </Typography>
            <Typography blod>
              {item.value}
            </Typography>
          </Container>
        ))}
      </>
    )
  }
  render() {
    const {
      ticker,
      handleShowProducts,
    } = this.props;
    return (
      <Container flex className="top-bar">
        <Container flex justify="space-between" className="coin-info">
          <Container onClick={() => handleShowProducts()}>
            {ticker.Sym}
          </Container>
          <Container flex direction="column" justify="space-between" className="mark">
            <Typography blod range="up" style={{ fontSize: '14px' }}>
              {ticker.LastPrz}
            </Typography>
            <Typography>
              {ticker.LastPrz}
            </Typography>
          </Container>
          {this.renderCoinInfo()}
        </Container>
      </Container>
    );
  }
}

const mapState = (state) => {
  return {
    subscribing: state.depth.subscribing,
    ticker: store.select.ticker.indexTick(state.ticker),
  };
}

export default connect(mapState, null)(injectIntl(ChartTitle));
