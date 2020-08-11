import '$styles/partials/asset.less';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, defineMessages } from 'react-intl';
import Container from '$components/kb-design/Container';
import Link from '$components/kb-design/Link';
import { DepositIcon, WithdrawIcon } from '$components/icons';
import { filterWallets } from '$store/parses/wallet';

const messages = defineMessages({
  title: {
    id: 'futures.asset.detail',
    defaultMessage: 'Assets',
    description: '资产',
  },
  deposit: {
    id: 'futures.asset.deposite',
    defaultMessage: 'Deposit',
    description: '充值',
  },
  withdraw: {
    id: 'futures.asset.withdraw',
    defaultMessage: 'Withdraw',
    description: '提现',
  },
  btcAvaiable: {
    id: 'futures.asset.btcAvaiable',
    defaultMessage: 'BTC Avaiable',
    description: 'BTC 可用',
  },
  usdtAvaiable: {
    id: 'futures.asset.usdtAvaiable',
    defaultMessage: 'USDT Avaiable',
    description: 'USDT 可用',
  },
  unrealize: {
    id: 'futures.asset.unrealize',
    defaultMessage: 'Unrealized profit-loss',
    description: '未实现盈亏',
  },
});

class AssetDetail extends Component {
  shouldComponentUpdate(nextProps) {
    if(this.props.futures !== nextProps.futures || this.props.selectTab !== nextProps.selectTab) {
      return true;
    }
    return false;
  }
  render() {
    const { intl, positions , tickers, futures, orders, limitRisk, assetd } = this.props;

    let wallets = filterWallets(positions, futures, orders, tickers, limitRisk, assetd);
    const btcAvaiable = wallets.filter(f => f.Coin === 'BTC').map(v => v.aWdrawable);
    const usdtAvaiable = wallets.filter(f => f.Coin === 'USDT').map(v => v.aWdrawable);

    let unrealized = 0;
    unrealized = unrealized + wallets.map(f => f.aUPNL || 0);

    return (
      <>
        <Container className="title-container">
          <span>{intl.formatMessage(messages.title)}</span>
        </Container>
        <Container flex direction="column" alignItems="center" className="content-container" style={{ margin: '0px 8px' }}>
          <Container flex style={{ margin: '16px 0' }}>
            <Link href="#" className="content-btn">
              <DepositIcon />
              <span>{intl.formatMessage(messages.deposit)}</span>
            </Link>
            <Link href="#" className="content-btn">
              <WithdrawIcon />
              <span>{intl.formatMessage(messages.withdraw)}</span>
            </Link>
          </Container>
          <Container flex direction="column" style={{ width: '100%' }}>
            <Container flex justify="space-between" alignItems="center" className="detail-content">
              <span>{intl.formatMessage(messages.btcAvaiable)}</span>
              <span>{Number(btcAvaiable).toFixed(5)} BTC</span>
            </Container>
            <Container flex justify="space-between" alignItems="center" className="detail-content">
              <span>{intl.formatMessage(messages.usdtAvaiable)}</span>
              <span>{Number(usdtAvaiable).toFixed(5)} USDT</span>
            </Container>
            <Container flex justify="space-between" alignItems="center" className="detail-content">
              <span>{intl.formatMessage(messages.unrealize)}</span>
              <span>{Number(unrealized).toFixed(5)} USDT</span>
            </Container>
          </Container>
        </Container>
      </>
    );
  }
}
const mapState = (state) => {
  return {
    futures: state.futures.futures,
    products: state.ticker.products,
    positions: state.order.positions,
    limitRisk: state.limitRisk.limitRisk,
    assetd: state.ticker.products,
    currentSymbol: state.ticker.currentSymbol,
    tickers: state.ticker.tickers,
    wallet: state.wallet.wallet,
    orders: state.order.orders,
  };
};

const mapDispatch = (dispatch) => ({
});
export default connect(mapState, mapDispatch)(injectIntl(AssetDetail));
