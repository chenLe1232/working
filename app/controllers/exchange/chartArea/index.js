import React, { Component } from 'react';
import { injectIntl, defineMessages } from 'react-intl';
import store from '$store';
import classNames from 'classnames';
import { connect } from 'react-redux';
import Container from '$components/kb-design/Container';
import { Tabs, TabPane } from '$components/kb-design/KTabs';
import ChartTitle from './ChartTitle';
import ChartTopBar from './ChartTopBar';
import Products from './Products';
import KLine from '../kline';
import DepthChart from '../depthChart';

const messages = defineMessages({
  future: {
    id: 'product.title.future',
    defaultMessage: 'Future',
    description: '合约'
  },
  price: {
    id: 'product.title.price',
    defaultMessage: 'Price',
    description: '最新价'
  },
  change: {
    id: 'product.title.change',
    defaultMessage: 'Change',
    description: '涨跌幅'
  },
  favourite: {
    id: 'product.tab.favourite',
    defaultMessage: 'Favourite',
    description: '自选'
  },
  usdt: {
    id: 'product.tab.usdt',
    defaultMessage: 'USDT',
    description: 'USDT'
  },
  coin: {
    id: 'product.tab.coin',
    defaultMessage: 'Coin',
    description: '币本位'
  },
})
class ChartArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showProducts: true,
      fullscreen: false,
      chartType: 'tradingView',
    }
    this.chartWrap = React.createRef();
  }

  handleProduct(product) {
    const symbol = product[0].props.children;
    this.props.handleCurrentSymbol(symbol)
  }

  handleShowProducts() {
    const showProducts = !this.state.showProducts;
    this.setState({
      showProducts
    })
  }

  handleTab(index) {
    let tab;
    switch (index) {
      case '0':
        tab = 'favourite';
        break;
      case '1':
        tab = 'USDT';
        break;
      case '2':
        tab = 'coin';
        break;
      default:
        tab = 'USDT';
        break;
    }
    this.props.handleSelectTab(tab);
  }

  render() {
    const {
      intl,
      tickers,
      usdtTick,
      coinTick,
      exchangeTheme,
    } = this.props;
    const {
      showProducts,
      chartType
    } = this.state;
    const title = [
      {
        key: 0,
        width: 3,
        sortable: true,
        sortfetch: true,
        title: intl.formatMessage(messages.future),
      },
      {
        key: 1,
        width: 3,
        sortable: true,
        sortfetch: true,
        title: intl.formatMessage(messages.price),
      },
      {
        key: 2,
        width: 3,
        sortable: true,
        sortfetch: true,
        title: intl.formatMessage(messages.change),
      },
    ]
    return (
      <Container flex stretch direction="column" className="chart-area">
        <ChartTitle handleShowProducts={() => this.handleShowProducts()} />
        <div className="chart-container" ref={this.chartWrap} style={{ background: exchangeTheme === 'light' ? '#fff' : '' }} >
          <ChartTopBar
            chartType={chartType}
            // switchGranularity={switchGranularity}
            // product={product}
            // load={load}
            // subscribe={subscribe}
            node={this.chartWrap}
            handleFull={(fullscreen) => {
              this.setState({
                fullscreen
              })
            }}
            handleChartType={(chartType) => {
              this.setState({
                chartType
              })
            }}
          />
          {chartType === 'tradingView' && <KLine />}
          {chartType === 'depth' && <DepthChart />}
        </div>
        <Container className={classNames("left-product", showProducts ? "product-display" : "product-hidden")}>
          <Tabs onSelect={(index) => this.handleTab(index)} defaultIndex='1'>
            <TabPane tab={intl.formatMessage(messages.favourite)}>
              <Products title={title} products={tickers} handleProduct={(product) => this.handleProduct(product)} />
            </TabPane>
            <TabPane tab={intl.formatMessage(messages.usdt)}>
              <Products title={title} products={usdtTick} handleProduct={(product) => this.handleProduct(product)} />
            </TabPane>
            <TabPane tab={intl.formatMessage(messages.coin)}>
              <Products title={title} products={coinTick} handleProduct={(product) => this.handleProduct(product)} />
            </TabPane>
          </Tabs>
        </Container>
      </Container>
    );
  }
}

const mapState = (state) => ({
  products: state.ticker.products,
  tickers: state.ticker.tickers,
  selectTab: state.ticker.selectTab,
  usdtTick: store.select.ticker.usdtTick(state.ticker),
  coinTick: store.select.ticker.coinTick(state.ticker),
})

const mapDispatch = (dispatch) => ({
  handleCurrentSymbol: dispatch.ticker.handleCurrentSymbol,
  handleSelectTab: dispatch.ticker.handleSelectTab,
})

export default connect(mapState, mapDispatch)(injectIntl(ChartArea));
