import apis from '$services/apis/trade';

const getFutureWallet = {
  state: {
    subscribing: false,
    wallets: {},
  },
  reducers: {
    subscribingChange(state, payload) {
      return {
        subscribing: payload,
      };
    },
    socketUpdateTrade(state, payload) {
      return {
        ...state,
        wallets: payload,
      };
    },
  },
  effects: (dispatch) => ({
    async subscribe(payload) {
      await apis.subscribe(payload);
      dispatch.getFutureWallet.subscribingChange(true);
    },
    async unsubscribe(payload) {
      await apis.unsubscribe(payload);
      dispatch.getFutureWallet.subscribingChange(false);
    },
  }),
};

export default getFutureWallet;