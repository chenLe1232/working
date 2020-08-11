import apis from '$services/apis/order/posOp';

const posOp = {
  state: {},
  effects: (dispatch) => ({
    async posOpSubscribe(payload) {
      // console.log(apis)
      await apis.subscribe(payload);
    }
  })
};

export default posOp;