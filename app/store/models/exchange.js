// 币币钱包
const exchange  = {
  state: {
    exchange: [],
  },
  reducers: {
    loadExchange(state, payload) {
      return {
        ...state,
        exchange: payload,
      };
    },
  },
};

export default exchange;
