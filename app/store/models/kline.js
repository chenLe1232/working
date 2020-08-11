import apis from '$services/apis/kline';
import { parseToCandlesData } from '$store/parses/kline';

const kline = {
  state: {
    subscribing: false,
    interval: '1m',
    candles: {},
  },
  reducers: {
    subscribingChange(state, payload) {
      return {
        ...state,
        subscribing: payload,
      };
    },
    getHistoryCandles(state, payload) {
      return {
        ...state,
        candles: payload,
      }
    },
    handleInterval(state, payload) {
      return {
        ...state,
        interval: payload,
      }
    },
    socketUpdateCandles(state, payload) {
      // const candles = parseToCandlesData(payload);
      return {
        ...state,
        candles: payload,
      };
    },
  },
  effects: (dispatch) => ({
    async getLatestKLine(payload) {
      await apis.getLatestKLine(payload);
    },
    async subscribe(payload) {
      await apis.subscribe(payload);
      dispatch.kline.subscribingChange(true);
    },
    async unsubscribe(payload) {
      await apis.unsubscribe(payload);
      dispatch.kline.subscribingChange(false);
    },
  }),
};

export default kline;
