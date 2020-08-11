import apis from '$services/apis/order/getOrders';
// import { subscribe } from '../../services/tradeSocket';
// 等姜野芳把order bug就觉就用它的orders
const getOrders = {
  state: {
    ordersToTest:[]
  },
  reducers: {
    getOrdersChange(state, payload) {
      return {
        ...state,
        orders: payload
      };
    },
  },
  effects: (dispatch) => ({
    async orders_subscribe(payload) {
      // console.log(apis)
      await apis.subscribe(payload);
    }
  }),
};

export default getOrders;