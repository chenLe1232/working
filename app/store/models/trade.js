import apis from '$services/apis/trade';

const trade = {
  state: {
    subscribing: false,
    tradeList: [],
  },
  reducers: {
    subscribingChange(state, payload) {
      return {
        ...state,
        subscribing: payload,
      };
    },
    socketUpdateTrade(state, payload) {
      return {
        ...state,
        tradeList: payload,
      };
    },
  },
  effects: (dispatch) => ({
    async subscribe(payload) {
      await apis.subscribe(payload);
      dispatch.trade.subscribingChange(true);
    },
    async unsubscribe(payload) {
      await apis.unsubscribe(payload);
      dispatch.trade.socketUpdateTrade([]);
      dispatch.trade.subscribingChange(false);
    },
  }),
};

export default trade;
