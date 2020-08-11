import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, defineMessages } from 'react-intl';
import format from '$utils/format';
import Container from '$components/kb-design/Container';
import Typography from '$components/kb-design/Typography';
import Table from '$publicComponents/Table';

const messages = defineMessages({
  fills: {
    id: 'fill.title',
    defaultMessage: 'Market Trades',
    description: '最新成交'
  },
  price: {
    id: 'fill.price',
    defaultMessage: 'Price',
    description: '价格'
  },
  amount: {
    id: 'fill.amount',
    defaultMessage: 'Amount',
    description: '数量'
  },
  date: {
    id: 'fill.date',
    defaultMessage: 'Date',
    description: '时间'
  }
})

class FillsArea extends Component {
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

  renderFillsItem(fill) {
    return [
      <Typography range={fill.Dir === 1 ? 'down' : 'up'}>
        {fill.Prz}
      </Typography>,
      <Typography>
        {fill.Sz}
      </Typography>,
      <Typography>
        {format.formatDate24(fill.At)}
      </Typography>
    ]
  }

  handlePrice(fills) {
    if (fills[0] && fills[0].props) {
      const price = fills[0].props.children;
      this.props.handleSelectPrice(price);
    }
  }


  render() {
    const {
      intl,
      tradeList,
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
        title: intl.formatMessage(messages.date),
      },
    ]
    return (
      <Container flex direction="column" className="fills-container">
        <Container className="fills-title">
          {intl.formatMessage(messages.fills)}
        </Container>
        <Table columns={title} rowClick={(fills) => {this.handlePrice(fills)}} data={tradeList.map(fill => this.renderFillsItem(fill))} />
      </Container>
    );
  }
}
const mapState = (state) => {
  return {
    subscribing: state.trade.subscribing,
    tradeList: state.trade.tradeList,
    symbol: state.ticker.currentSymbol,
  };
};

const mapDispatch = (dispatch) => ({
  subscribe: dispatch.trade.subscribe,
  unsubscribe: dispatch.trade.unsubscribe,
  handleSelectPrice: dispatch.depth.handleSelectPrice,
});

export default connect(mapState, mapDispatch)(injectIntl(FillsArea));
