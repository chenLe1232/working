import apis from '$services/apis/depth';

const depth = {
  state: {
    subscribing: false,
    orderl2_obj: {},
    asks: [],
    bids: [],
    selectPrice: '',
  },
  reducers: {
    subscribingChange(state, payload) {
      return {
        ...state,
        subscribing: payload,
      };
    },
    socketUpdateDepth(state, orderl2_obj, depth) {
      return {
        ...state,
        orderl2_obj,
        asks: depth.asks && depth.asks._Ary.slice(),
        bids: depth.bids && depth.bids._Ary.slice(),
      };
    },
    handleSelectPrice(state, payload) {
      return {
        ...state,
        selectPrice: payload,
      }
    }
  },
  effects: (dispatch) => ({
    async subscribe(payload) {
      await apis.subscribe(payload);
      dispatch.depth.subscribingChange(true);
    },
    async unsubscribe(payload) {
      await apis.unsubscribe(payload);
      dispatch.depth.subscribingChange(false);
    },
  }),
};

export default depth;
