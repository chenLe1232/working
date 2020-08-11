import apis from '$services/apis/order/submitOrder';

const sellPosition = {
  state: {
    flag: false,
    // closePotionFlag: false,
  },
  reducers: {
    setSellPositionFlag(state, payload) {
      return {
        ...state,
        flag: payload
      };
    },
  },
};

export default sellPosition;