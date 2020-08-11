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
  status: {
    id: 'futures.table.deal.status',
    defaultMessage: 'Status',
    description: '状态'
  },
  canceled: {
    id: 'futures.table.deal.canceled',
    defaultMessage: 'Canceled',
    description: '已撤销',
  },
  partDeal: {
    id: 'futures.table.deal.partDeal',
    defaultMessage: 'Parts',
    description: '部分成交', 
  },
  completed: {
    id: 'futures.table.deal.completed',
    defaultMessage: 'Completed',
    description: '已成交',
  },
});

class HistoryTable extends Component {
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

  updateStatus(Qty, QtyF) {
    const { intl } = this.props;
    if(Qty === QtyF) {
      return intl.formatMessage(messages.completed);
    } else if(QtyF === 0) {
      return intl.formatMessage(messages.canceled);
    } else if(QtyF < Qty) {
      return intl.formatMessage(messages.partDeal);
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
    const { intl, history } = this.props;
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
      width: 12,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.type),
      render: (fmtVal, rowData) => {
        return this.updateOType(rowData.OType);
      }
    }, {
      key: 'Dir',
      width: 8,
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
        return Number(fmtVal).toFixed(2) || 0;
      }
    }, {
      key: 'PrzF',
      width: 15,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.average),
      render: (fmtVal, rowData) => {
        return rowData.PrzF ? Number(rowData.PrzF).toFixed(2) : '--'
      }
    }, {
      key: 'Qty',
      width: 10,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.dealAmount),
      render: (fmtVal, rowData) => {
        return fmtVal || 0
      }
    }, {
      key: 'QtyF',
      width: 15,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.volume),
      render: (fmtVal, rowData) => {
        return fmtVal || 0
      }
    }, {
      key: 'Trigger',
      width: 15,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.trigger),
      render: (fmtVal, rowData) => {
        return <span>{rowData.StopBy === 1 && rowData.OType === 3 || rowData.OType === 4 ? this.updateStopBy(rowData.StopBy) + '' + this.updateAveragePrice(rowData) : '--'}</span>
      }
    },{
      key: 'Status',
      width: 10,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.status),
      render: (fmtVal, rowData) => {
        return this.updateStatus(rowData.Qty, rowData.QtyF || 0)
      }
    }];
    return (
      <Table data={history} columns={columns} />
    )
  }
}

const mapState = (state) => {
  return {
    history: state.order.history,
  };
};

const mapDispatch = (dispatch) => ({
  subscribe: dispatch.order.subscribe,
});

export default connect(mapState, mapDispatch)(injectIntl(HistoryTable))
