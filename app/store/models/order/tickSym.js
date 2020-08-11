import apis from '$services/apis/order/tickSym';

const tick_sym = {
  state: {
    subscribing: false,
    tick_sym:{}
  },
  reducers: {
    // subscribingChange(state, payload) {
    //   return {
    //     ...state,
    //     subscribing: payload,
    //   };
    // },
    getTickSym(state, payload) {
      return {
        ...state,
        tick_sym: payload
      };
    },
  },
  effects: (dispatch) => ({
    async tickSym_subscribe(payload) {
      // console.log(apis)
      await apis.subscribe(payload);
      // dispatch.login.subscribingChange(true);
    }
  })
};

export default tick_sym;