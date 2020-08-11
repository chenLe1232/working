import apis from '$services/apis/order/posLever';

const posLever = {
  state: {},
  effects: (dispatch) => ({
    async posLeverSubscribe(payload) {
      await apis.subscribe(payload);
    }
  })
};

export default posLever;