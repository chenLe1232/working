import apis from '$services/apis/order/limitRisk';
// import { subscribe } from '../../services/tradeSocket';

const limitRisk = {
  state: {
    limitRisk:{},
    time: Date.now(),
  },
  reducers: {
    getlimitInfo(state, payload) {
      return {
        ...state,
        limitRisk: payload
      };
    },
  },
  effects: (dispatch) => ({
    async limitRisk_subscribe(payload) {
      // console.log('发送获取风险限额请求中');
      await apis.subscribe(payload);
    }
  })
};

export default limitRisk;