import apis from '$services/apis/order/submitOrder';
import sotre from '$store';

const submitOrder = {
  state: {},
  effects: {
    async orderNewLotSubscribe(payload) {
      await apis.subscribe(payload);
      sotre.dispatch.setInputValue.clearInputValue();
    },
    async orderNewEmpSubscribe(payload) {
      await apis.subscribe(payload);
    },
    async closePositionLotSubscribe(payload) {
      await apis.subscribe(payload);
    },
    async closePositionEmpSubscribe(payload) {
      await apis.subscribe(payload);
    },
  }
};

export default submitOrder;