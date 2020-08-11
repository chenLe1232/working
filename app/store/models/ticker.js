import apis from '$services/apis/ticker';
import indexApi from '$services/apis/index';
import _ from 'lodash';

const ticker = {
  state: {
    subscribing: false,
    products: [],
    tickers: [],
    indexList: [],
    currentSymbol: 'BTC.USDT',
    currentTicker: {},
    currentIndex: {},
    selectTab: 'USDT',
  },
  reducers: {
    subscribingChange(state, payload) {
      return {
        ...state,
        subscribing: payload,
      };
    },
    getAllTicker(state, payload) {
      return {
        ...state,
        tickers: payload
      }
    },
    getAllProduct(state, payload) {
      const products = payload.filter(item => Number(item.TrdCls) === 3);
      return {
        ...state,
        products,
      }
    },
    getAllIndex(state, payload) {
      return {
        ...state,
        indexList: payload,
      }
    },
    handleCurrentSymbol(state, payload) {
      return {
        ...state,
        currentSymbol: payload,
      }
    },
    socketUpdateCurrentTick(state, payload) {
      return {
        ...state,
        currentTicker: payload,
      }
    },
    socketUpdateCurrentIndex(state, payload) {
      return {
        ...state,
        currentIndex: payload,
      }
    },
    handleSelectTab(state, payload) {
      return {
        ...state,
        selectTab: payload,
      }
    }
  },
  effects: (dispatch) => ({
    async getAssetD(param) {
      await apis.getAssetD(param);
      dispatch.ticker.subscribingChange(true);
    },
    getCompositeIndex(param) {
      indexApi.getCompositeIndex(param);
    },
    subscribeIndex(param) {
      const {
        indexList,
        symbol,
      } = param;
      const indexSymbol = indexList.find(item => {
        if (item && item.split) {
          return item.split('_').pop() === symbol;
        }
      })
      indexApi.subscribe([`index_${indexSymbol}`]);
    },
    unsubscribeIndex(param) {
      const {
        indexList,
        symbol,
      } = param;
      const indexSymbol = indexList.find(item => {
        if (item && item.split) {
          return item.split('_').pop() === symbol;
        }
      })
      indexApi.unsubscribe([`index_${indexSymbol}`]);
    },
    async subscribeAllTicks(param) {
      const symbols = param.filter(item => Number(item.TrdCls) === 3).map(item => item.Sym);
      await apis.subscribeAllTicks(symbols);
    },
    async unsubscribe(param) {
      await apis.unsubscribe(param);
      dispatch.ticker.subscribingChange(false);
    },
  }),
  selectors: {
    mergeTick() {
      return state => {
        const product = state.products && state.products.find(item => item.Sym === state.currentSymbol);
        return _.assign({}, product, state.currentTicker);
      }
    },
    indexTick() {
      return state => {
        return _.assign({}, state.currentIndex, state.currentTicker);
      }
    },
    usdtTick() {
      return state => {
        const tickers = [];
        state.products.forEach(product => {
          if (product.SettleCoin === 'USDT') {
            state.tickers.length && tickers.push(state.tickers.find(ticker => ticker.Sym === product.Sym));
          }
        })
        return tickers;
      }
    },
    coinTick() {
      return state => {
        const tickers = [];
        state.products.forEach(product => {
          // & 位运算
          if (product.Flag & 1 === 1) {
            state.tickers.length && tickers.push(state.tickers.find(ticker => ticker.Sym === product.Sym));
          }
        })
        return tickers;
      }
    }
  }
};

export default ticker;
