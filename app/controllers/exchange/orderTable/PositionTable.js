import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, defineMessages } from 'react-intl';
import Table from '$publicComponents/Table';
import { EditIcon, AddIcon } from '$components/icons';
import TableInput from './TableInput';
import { filterPosition } from '$store/parses/position';

const messages = defineMessages({
  futures: {
    id: 'futures.table.position.thead1',
    defaultMessage: 'Futures',
    description: '合约',
  },
  positionAmount: {
    id: 'futures.table.position.thead2',
    defaultMessage: 'Amount',
    description: '持仓量',
  },
  open: {
    id: 'futures.table.position.thead3',
    defaultMessage: 'Open',
    description: '开仓价格',
  },
  mark: {
    id: 'futures.table.position.thead4',
    defaultMessage: 'Mark',
    description: '标记价格',
  },
  strongPrice: {
    id: 'futures.table.position.thead5',
    defaultMessage: 'Strong',
    description: '强平价格',
  },
  rate: {
    id: 'futures.table.position.thead6',
    defaultMessage: 'Rate',
    description: '保证金比率',
  },
  margin: {
    id: 'futures.table.position.thead7',
    defaultMessage: 'Margin',
    description: '保证金',
  },
  unrealize: {
    id: 'futures.table.position.thead8',
    defaultMessage: 'Return',
    description: '未实现盈亏(回报率)',
  },
  realized: {
    id: 'futures.table.position.thead9',
    defaultMessage: 'Realized',
    description: '已实现盈亏',
  },
  close: {
    id: 'futures.table.position.thead10',
    defaultMessage: 'Close',
    description: '平仓',
  },
  limit: {
    id: 'futures.table.position.close.limit',
    defaultMessage: 'Limit',
    description: '限价',
  },
  market: {
    id: 'futures.table.position.close.market',
    defaultMessage: 'Market',
    description: '市价',
  },
  more: {
    id: 'futures.table.position.more',
    defaultMessage: 'More',
    description: '多',
  },
  less: {
    id: 'futures.table.position.less',
    defaultMessage: 'Empty',
    description: '空',
  },
});

class PositionTable extends Component {
  handleClick() {
    console.log(111)
  }

  subscribeIndexPrz(Sym) {
    const { indexList, subscribeIndex }  = this.props;
    subscribeIndex({indexList, symbol: Sym.slice(0, Sym.indexOf('.'))})
  }

  render() {
    const { intl, positions, products,tickers, futures, orders, limitRisk, assetd } = this.props;
    const columns = [{
      key: 'Coin',
      width: 15,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.futures),
      render: (fmtVal, rowData) => {
        return <>
          {rowData.Sym}
          <span style={{ color: rowData.Sz > 0 ? '#2DBD85' : '#E0284A' }}>{rowData.Sz > 0 ? intl.formatMessage(messages.more) : intl.formatMessage(messages.less)}{rowData.Lever}X</span>
          <span onClick={() => this.handleClick()} style={{cursor: 'pointer'}}><EditIcon /></span>
        </>
      }
    }, {
      key: 'Sz',
      width: 6,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.positionAmount),
      render: (fmtVal, rowData) => {
        const settleCoin = products.filter(p => p.Sym === rowData.Sym).map(v => v.SettleCoin);
        return `${fmtVal || 0}${settleCoin}`;
      }
    }, {
      key: 'PrzIni',
      width: 8,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.open),
      render: (fmtVal, rowData) => {
        return Number(fmtVal || 0).toFixed(2);
      }
    }, {
      key: 'PrzM',
      width: 8,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.mark),
      render: (fmtVal, rowData) => {
        this.subscribeIndexPrz(rowData.Sym);
        const PrzM = this.props.currentIndex.Prz || 0;
        return Number(PrzM).toFixed(2);
      }
    }, {
      key: 'aPrzLiq',
      width: 8,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.strongPrice),
      render: (fmtVal, rowData) => {
        return Number(fmtVal || 0).toFixed(2);
      }
    }, {
      key: 'aMgnRateforLiq',
      width: 8,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.rate),
      render: (fmtVal, rowData) => {
        return <span style={{ color: rowData.Sz > 0 ? '#2DBD85' : '#E0284A' }}>{`${Number(fmtVal || 0).toFixed(3)}%`}</span>;
      }
    }, {
      key: 'aMM',
      width: 10,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.margin),
      render: (fmtVal, rowData) => {
        const settleCoin = products.filter(p => p.Sym === rowData.Sym).map(v => v.SettleCoin);
        return <>
          {Number(rowData.aMM || 0)}{settleCoin}
          <span onClick={() => this.handleClick()} style={{cursor: 'pointer' }}><AddIcon /></span>
        </>
      }
    }, {
      key: 'aUPNLforLast',
      width: 14,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.unrealize),
      render: (fmtVal, rowData) => {
        const settleCoin = products.filter(p => p.Sym === rowData.Sym).map(v => v.SettleCoin);
        return <span style={{ color: rowData.Sz > 0 ? '#2DBD85' : '#E0284A' }}>{Number(rowData.aUPNLforLast || 0).toFixed(2)}{settleCoin}  {Number(rowData.aProfitPer * 100).toFixed(2) || '0.00'}%</span>
      },   
    }, {
      key: 'RPNL',
      width: 8,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.realized),
      render: (fmtVal, rowData) => {
        const settleCoin = products.filter(p => p.Sym === rowData.Sym).map(v => v.SettleCoin);
        return `${Number(fmtVal ||0).toFixed(2)}${settleCoin}`;
      }
    }, {
      key: 'Close',
      width: 18,
      sortable: true,
      sortfetch: true,
      title: intl.formatMessage(messages.close),
      render: (fmtVal, rowData) => {
        return <TableInput />
      }
    }];

    return (
      <Table data={filterPosition(positions, futures, orders, tickers, limitRisk, assetd)} columns={columns} />
    )
  }
}

const mapState = (state) => {
  return {
    positions: state.order.positions,
    products: state.ticker.products,
    limitRisk: state.limitRisk.limitRisk,
    assetd: state.ticker.products,
    currentSymbol: state.ticker.currentSymbol,
    tickers: state.ticker.tickers,
    orders: state.order.orders,
    futures: state.futures.futures,
    indexList: state.ticker.indexList,
    currentIndex: state.ticker.currentIndex,
  };
};

const mapDispatch = (dispatch) => ({
  subscribeIndex: dispatch.ticker.subscribeIndex,
});

export default connect(mapState, mapDispatch)(injectIntl(PositionTable))
