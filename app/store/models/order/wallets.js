import apis from '$services/apis/order/getFutureWallets';
// import { subscribe } from '../../services/tradeSocket';

const wallets = {
  state: {
    wallets: [],
  },
  reducers: {
    walletsChange(state, payload) {
      return {
        ...state, 
        wallets: payload,
      };
    },
  },
  effects: (dispatch) => ({
    async wallets_subscribe(payload) {
      await apis.subscribe(payload);
      // dispatch.wallets.subscribingChange(true);
    }
  })
};

export default wallets;