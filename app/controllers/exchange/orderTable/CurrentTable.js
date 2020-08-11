import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, defineMessages } from 'react-intl';
import Table from '$publicComponents/Table';
import { timeFormat } from '$utils/handleTimeStamp';

const messages = defineMessages({
  futures: {
    id: 'futures.table.position.thead1',
    defaultMessage: 'Futures',
    description: '合约',
  },
  time: {
    id: 'futures.table.deal.time',
    defaultMessage: 'Time',
    description: '时间',
  },
  type: {
    id: 'futures.table.deal.type',
    defaultMessage: 'Type',
    description: '类型',
  },
  direction: {
    id: 'futures.table.deal.direction',
    defaultMessage: 'Direction',
    description: '方向',
  },
  dealPrice: {
    id: 'futures.table.deal.price',
    defaultMessage: 'Price',
    description: '委托价',
  },
  dealAmount: {
    id: 'futures.table.deal.amount',
    defaultMessage: 'Commission',
    description: '委托量',
  },
  volume: {
    id: 'futures.table.deal.volume',
    defaultMessage: 'Volume',
    description: '成交量',
  },
  average: {
    id: 'futures.table.deal.average',
    defaultMessage: 'Average',
    description: '成交均价',
  },
  trigger: {
    id: 'futures.table.deal.trigger',
    defaultMessage: 'Triggers',
    description: '触发条件',
  },
  option: {
    id: 'futures.table.deal.options',
    defaultMessage: 'Option',
    description: '操作',
  },
  cancel: {
    id: 'futures.table.deal.cancel',
    defaultMessage: 'Cancel',
    description: '撤单',
  },
  orderStopBy0: {
    id: 'futures.table.order.stopBy0',
    defaultMessage: 'Price Mark',
    description: '标记价格',
  },
  orderStopBy1: {
    id: 'futures.table.order.stopBy1',
    defaultMessage: 'Price Latest',
    description: '最新成交',
  },
  orderStopBy2: {
    id: 'futures.table.order.stopBy2',
    defaultMessage: 'Price Index',
    description: '指数价格',
  },
  orderOType0: {
    id: 'futures.table.order.oType0',
    defaultMessage: 'Invalid',
    description: '未指定',
  },
  orderOType1: {
    id: 'futures.table.order.oType1',
    defaultMessage: 'Limit',
    description: '限价委单',
  },
  orderOType2: {
    id: 'futures.table.order.oType2',
    defaultMessage: 'Market',
    description: '市价委单',
  },
  orderOType3: {
    id: 'futures.table.order.oType3',
    defaultMessage: 'StopLimit',
    description: '限价止损/盈利',
  },
  orderOType4: {
    id: 'futures.table.order.oType4',
    defaultMessage: 'StopMarket',
    description: '市价止损/盈利',
  },
  orderOType5: {
    id: 'futures.table.order.oType5',
    defaultMessage: 'TraceLimit',
    description: '追踪限价',
  },
  orderOType6: {
    id: 'futures.table.order.oType6',
    defaultMessage: 'TraceMarket',
    description: '追踪市价',
  },
  directionMore: {
    id: 'futures.table.direction.more',
    defaultMessage: 'More',
    description: '开多',
  },
  directionEmpty: {
    id: 'futures.table.direction.empty',
    defaultMessage: 'Empty',
    description: '开空',
  },
});

class CurrentTable extends Component {
  shouldComponentUpdate(nextProps) {
    if(this.props.orders === nextProps.orders) {
      return false;
    }
    return true;
  }
  handleCancelOrder = (AId, OrdId, Sym) => {
    const { subscribe } = this.props;
    const args = {
      AId: AId,
      OrderId: OrdId,
      symbol: Sym,
    };
    subscribe(args);
  }

  updateOType(status) {
    const { intl } = this.props;
    switch (status) {
    case 0:
      return intl.formatMessage(messages.orderOType0);
    case 1:
      return intl.formatMessage(messages.orderOType1);
    case 2:
      return intl.formatMessage(messages.orderOType2);
    case 3:
      return intl.formatMessage(messages.orderOType3);
    case 4:
      return intl.formatMessage(messages.orderOType4);
    case 5:
      return intl.formatMessage(messages.orderOType5);
    case 6:
      return intl.formatMessage(messages.orderOType6);
    }
  }

  updateStopBy(status) {
    const { intl } = this.props;
    switch (status) {
    case 0:
      return intl.formatMessage(messages.orderStopBy0);
    case 1:
      return intl.formatMessage(messages.orderStopBy1);
    case 2:
      return intl.formatMessage(messages.orderStopBy2);
    }
  }

  updateDir(status) {
    const { intl } = this.props;
    switch (status) {
    case 1:
      return intl.formatMessage(messages.directionMore);
    case -1:
      return intl.formatMessage(messages.directionEmpty);
    }
  }

  updateAveragePrice(item) {
    if(item.StopPrz > 0) {
      if((item.OrdFlag & 8) === 0) {
        return `≤${item.StopPrz}`
      } else {
        return `≥${item.StopPrz}`
      }
    };
  }

  render() {
    const { intl, orders } = this.props;
    const columns = [{
      key: 'At',
      width: 15,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.time),
      render: (fmtVal, rowData) => {
        return timeFormat(fmtVal);
      }
    }, {
      key: 'Sym',
      width: 10,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.futures),
      render: (fmtVal, rowData) => {
        return fmtVal;
      }
    }, {
      key: 'OType',
      width: 10,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.type),
      render: (fmtVal, rowData) => {
        return this.updateOType(rowData.OType);
      }
    }, {
      key: 'Dir',
      width: 10,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.direction),
      render: (fmtVal, rowData) => {
        return <span style={{color: rowData.Dir > 0 ? '#2DBD85' : '#E0284A'}}>{this.updateDir(rowData.Dir)}</span>;
      }
    }, {
      key: 'Prz',
      width: 10,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.dealPrice),
      render: (fmtVal, rowData) => {
        return Number(fmtVal || 0).toFixed(2);
      }
    }, {
      key: 'Qty',
      width: 10,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.dealAmount),
      render: (fmtVal, rowData) => {
        return Number(fmtVal || 0).toFixed(3);
      }
    }, {
      key: 'QtyF',
      width: 10,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.volume),
      render: (fmtVal, rowData) => {
        return Number(fmtVal || 0).toFixed(3);
      }
    }, {
      key: 'Trigger',
      width: 15,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.trigger),
      render: (fmtVal, rowData) => {
        return rowData.StopBy === 1 && rowData.OType === 3 || rowData.OType === 4 ? this.updateStopBy(rowData.StopBy) + '' + this.updateAveragePrice(rowData) : '--'
      },
    }, {
      key: 'Option',
      width: 10,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.option),
      render: (fmtVal, rowData) => {
        return <span style={{ color: '#F0B90A', cursor: 'pointer' }} onClick={this.handleCancelOrder.bind(this, rowData.AId, rowData.OrdId, rowData.Sym)}>{intl.formatMessage(messages.cancel)}</span>
      }
    }];
    return (
      <Table data={orders} columns={columns} />
    )
  }
}

const mapState = (state) => {
  return {
    orders: state.order.orders,
  };
};

const mapDispatch = (dispatch) => ({
  subscribe: dispatch.order.subscribe,
});

export default connect(mapState, mapDispatch)(injectIntl(CurrentTable))
