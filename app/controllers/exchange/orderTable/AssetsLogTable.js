import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, defineMessages } from 'react-intl';
import Table from '$publicComponents/Table';
import { timeFormat } from '$utils/handleTimeStamp';

const messages = defineMessages({
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
  assets: {
    id: 'futures.table.deal.assets',
    defaultMessage: 'Assets',
    description: '资产种类',
  },
  total: {
    id: 'futures.table.deal.total',
    defaultMessage: 'Total',
    description: '总额',
  },
  liquid: {
    id: 'futures.walletsLog.liquid',
    defaultMessage: 'Liquidation close',
    description: '强制平仓',
  },
  reduce: {
    id: 'futures.walletsLog.reduce',
    defaultMessage: 'Auto reduce position',
    description: '自动减仓',
  },
  futurestransferIn: {
    id: 'futures.walletsLog.futurestransferIn',
    defaultMessage: 'TransferIn',
    description: '账户划入',
  },
  delivery: {
    id: 'futures.walletsLog.delivery',
    defaultMessage: 'Delivery liquidation',
    description: '交割结算',
  },
  ordinary: {
    id: 'futures.walletsLog.ordinary',
    defaultMessage: 'Ordinary transactoin',
    description: '普通交易',
  },
  futurestransferOut: {
    id: 'futures.walletsLog.futurestransferOut',
    defaultMessage: 'TransferOut',
    description: '账户划出',
  },
  capital: {
    id: 'futures.walletsLog.capital',
    defaultMessage: 'Capital cost',
    description: '资金费用',
  },
  closing: {
    id: 'futures.walletsLog.closing',
    defaultMessage: 'Closing settlement',
    description: '平仓结算',
  },
  gift: {
    id: 'futures.walletsLog.gift',
    defaultMessage: 'Futures bonus',
    description: '合约赠金',
  },
  fee: {
    id: 'futures.walletsLog.fee',
    defaultMessage: 'Fee',
    description: '手续费',
  },
});

const typeObj = intl => ({
  4: intl.formatMessage(messages.liquid),
  5: intl.formatMessage(messages.reduce),
  6: intl.formatMessage(messages.delivery),
  7: intl.formatMessage(messages.ordinary),
  8: intl.formatMessage(messages.fee),
  9: intl.formatMessage(messages.futurestransferIn),
  10: intl.formatMessage(messages.futurestransferOut),
  11: intl.formatMessage(messages.capital),
  13: intl.formatMessage(messages.liquid),
  14: intl.formatMessage(messages.closing),
  17: intl.formatMessage(messages.gift),
});

class AssetsLogTable extends Component {
  render() {
    const { intl, walletLog } = this.props;

    const columns = [{
      key: 'At',
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.time),
      render: (fmtVal, rowData) => {
        return timeFormat(fmtVal);
      }
    }, {
      key: 'Coin',
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.assets),
      render: (fmtVal, rowData) => {
        return fmtVal;
      }
    }, {
      key: 'Via',
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.type),
      render: (fmtVal, rowData) => {
        return typeObj(intl)[rowData.Via] || '--';
      }
    }, {
      key: 'Qty',
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.total),
      render: (fmtVal, rowData) => {
        return fmtVal || 0;
      }
    }];

    return (
      <Table data={walletLog} columns={columns} />
    )
  }
}

const mapState = (state) => {
  return {
    walletLog: state.wallet.walletLog,
  };
};

const mapDispatch = (dispatch) => ({
});

export default connect(mapState, mapDispatch)(injectIntl(AssetsLogTable))
