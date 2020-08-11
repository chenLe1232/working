// 订单：当前委托、撤单、持仓、成交记录、历史委托
import apis from '$services/apis/order';

const order = {
  state: {
    subscribing: false,
    orders: [],
    positions: [],
    records: [],
    history: [],
  },
  reducers: {
    subscribingChange(state, payload) {
      return {
        subscribing: payload,
      };
    },
    loadOrders(state, payload) {
      return {
        ...state,
        orders: payload,
      };
    },
    loadHoldPosition(state, payload) {
      return {
        ...state,
        positions: payload,
      };
    },
    loadDealRecords(state, payload) {
      return {
        ...state,
        records: payload,
      };
    },
    loadHistOrders(state, payload) {
      return {
        ...state,
        history: payload,
      };
    },
  },
  effects: (dispatch) => ({
    async subscribe(payload) {
      await apis.subscribe(payload);
    },
  }),
};

export default order;
