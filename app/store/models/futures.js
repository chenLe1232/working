// 合约钱包
const futures = {
  state: {
    futures: [],
  },
  reducers: {
    loadFutures(state, payload) {
      return {
        ...state,
        futures: payload,
      };
    },
  }
}

export default futures;