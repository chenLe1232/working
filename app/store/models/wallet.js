// 资产中心钱包、钱包记录
const wallet = {
  state: {
    wallet: [],
    walletLog: [],
  },
  reducers: {
    loadWallets(state, payload) {
      return {
        ...state,
        wallet: payload,
      };
    },
    loadWalletLog(state, payload) {
      return {
        ...state,
        walletLog: payload,
      };
    },
  },
};

export default wallet;
