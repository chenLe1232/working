import React, { Component } from 'react';
import { injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import Container from '$components/kb-design/Container';
import Tab from '$components/kb-design/Tab';
import TabPane from '$components/kb-design/Tab';
import PositionTable from './PositionTable';
import CurrentTable from './CurrentTable';
import HistoryTable from './HistoryTable';
import StrongTable from './StrongTable';
import TradeTable from './TradeTable';
import AssetsLogTable from './AssetsLogTable';
import PropsCompo from '$decorators/themeDecorator';
import Toast from '$components/kb-design/Toast';

const messages = defineMessages({
  holdPosition: {
    id: 'futures.table.tab.hold',
    defaultMessage: 'Hold Position',
    description: '持有仓位',
  },
  current: {
    id: 'futures.table.tab.current',
    defaultMessage: 'Current commission({length})',
    description: '当前委托({length})',
  },
  history: {
    id: 'futures.table.tab.history',
    defaultMessage: 'Historical commission',
    description: '历史委托',
  },
  historyDeal: {
    id: 'futures.table.tab.deal',
    defaultMessage: 'Historical deal',
    description: '历史成交',
  },
  strong: {
    id: 'futures.table.tab.strong',
    defaultMessage: 'Historical strong',
    description: '历史强平',
  },
  flow: {
    id: 'futures.table.tab.flow',
    defaultMessage: 'Capital flow',
    description: '资金流水',
  },
  all: {
    id: 'futures.table.deal.all',
    defaultMessage: 'Cancel all',
    description: '全部撤销',
  },
});

const tableInfo = (intl, length) => [
  {
    label: 'hold', value: intl.formatMessage(messages.holdPosition),
  },
  {
    label: 'current', value: intl.formatMessage(messages.current, {length: length}),
  },
  {
    label: 'history', value: intl.formatMessage(messages.history),
  },
  {
    label: 'historyDeal', value: intl.formatMessage(messages.historyDeal),
  },
  {
    label: 'strong', value: intl.formatMessage(messages.strong),
  },
  {
    label: 'flow', value: intl.formatMessage(messages.flow),
  },
];

@PropsCompo
class OrderTable extends Component {
  constructor() {
    super();
    this.state = {
      label: 'hold',
    };
  }

  handleCancelAll() {
    const { orders, subscribeOrder } = this.props;
    orders.length > 0 && orders.map(order => {
      subscribeOrder({AId: order.AId, OrderId: order.OrdId, symbol: order.Sym})
    })
    Toast({ content: '委托已全部撤销', type: 'success' })
  }

  renderDiffTable() {
    const { label } = this.state;
    switch(label) {
      case 'hold': 
        return <PositionTable />;
      case 'current': 
        return <CurrentTable />;
      case 'history': 
        return <HistoryTable />;
      case 'strong': 
        return <StrongTable />;
      case 'historyDeal': 
        return <TradeTable />;
      case 'flow': 
        return <AssetsLogTable />;
      default:
        return <PositionTable />;
    } 
  }

  handleSwitchTab(label) {
    this.setState({
      label
    })
  }

  render() {
    const { intl, orders } = this.props;
    const { label } = this.state;
    return (
      <Container className="page-data-table">
        {label === 'current' && <span className="page-current" onClick={() => this.handleCancelAll()}>{intl.formatMessage(messages.all)}</span>}
          <Tab className="page-table-tab" activeKey="0" theme={this.props.theme}>
            {
              tableInfo(intl, orders.length || 0).map((item, index) => {
                return (
                  <TabPane title={item.value} key={index} classNamePane="classname2" onClick={ this.handleSwitchTab.bind(this,item.label)}>{this.renderDiffTable()}</TabPane>
                );
              })
            }
          </Tab>
      </Container>
    );
  }
}
const mapState = (state) => {
  return {
    orders: state.order.orders,
  };
};

const mapDispatch = (dispatch) => ({
  subscribeOrder: dispatch.order.subscribe,
});
export default connect(mapState, mapDispatch)(injectIntl(OrderTable));
