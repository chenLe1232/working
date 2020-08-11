import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, defineMessages } from 'react-intl';
import Table from '$publicComponents/Table';
import { filterStrong } from '$store/parses/strong';
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
  fee: {
    id: 'futures.table.deal.fee',
    defaultMessage: 'Fees',
    description: '手续费',
  },
  realized: {
    id: 'futures.table.position.thead9',
    defaultMessage: 'Realized',
    description: '已实现盈亏',
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
  price: {
    id: 'futures.table.price',
    defaultMessage: 'Price',
    description: '成交价'
  },
});

class StrongTable extends Component {

  render() {
    const { intl, records, products } = this.props;
    const columns = [{
      key: 'At',
      width: 12,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.time),
      render: (fmtVal, rowData) => {
        return timeFormat(fmtVal);
      }
    }, {
      key: 'Sym',
      width: 12,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.futures),
      render: (fmtVal, rowData) => {
        return fmtVal;
      }
    }, {
      key: 'Dir',
      width: 12,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.direction),
      render: (fmtVal, rowData) => {
        return <span style={{color: rowData.Sz > 0 ? '#2DBD85' : '#E0284A'}}>{rowData.Sz > 0 ? intl.formatMessage(messages.directionMore) : intl.formatMessage(messages.directionEmpty)}</span>;
      }
    }, {
      key: 'Prz',
      width: 12,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.price),
      render: (fmtVal, rowData) => {
        return Number(fmtVal).toFixed(2);
      }
    }, {
      key: 'Sz',
      width: 12,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.volume),
      render: (fmtVal, rowData) => {
        return Math.abs(fmtVal);
      }
    }, {
      key: 'Fee',
      width: 15,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.fee),
      render: (fmtVal, rowData) => {
        return `${Number(rowData.Fee).toFixed(4)}${rowData.FeeCoin}`
      }
    }, {
      key: 'PnlCls',
      width: 15,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.realized),
      render: (fmtVal, rowData) => {
        const settleCoin = products.filter(p => p.Sym === rowData.Sym).map(v => v.SettleCoin);
        return `${Number(rowData.PnlCls || 0).toFixed(2)}${settleCoin}`
      }
    }];
    return (
      <Table data={filterStrong(records)} columns={columns} />
    )
  }
}

const mapState = (state) => {
  return {
    records: state.order.records,
    products: state.ticker.products,
  };
};

const mapDispatch = (dispatch) => ({
});

export default connect(mapState, mapDispatch)(injectIntl(StrongTable))
