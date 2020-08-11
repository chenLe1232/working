import apis from '$services/apis/order/getAssetD';
// import { subscribe } from '../../services/tradeSocket';

const getAssetD = {
  state: {
    assetd:{}
  },
  reducers: {
    getAssetChange(state, payload) {
      return {
        ...state,
        assetd: payload
      };
    },
  },
  effects: (dispatch) => ({
    async assetd_subscribe(payload) {
      // console.log(apis)
      await apis.subscribe(payload);
    }
  })
};

export default getAssetD;