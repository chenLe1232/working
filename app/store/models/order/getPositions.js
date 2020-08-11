import apis from '$services/apis/order/getPositions';
import { createSelector } from 'reselect';
// import { subscribe } from '../../services/tradeSocket';

const getPositions = {
  state: {
    positions:[]
  },
  reducers: {
    getPositionsArr(state, payload) {
      return {
        ...state,
        positions: payload
      };
    },
  },
  effects: (dispatch) => ({
    async positions_subscribe(payload) {
      // console.log(apis)
      await apis.subscribe(payload);
    }
  }),
  selectors:{
    test(){
      return state => {
        const { tabs } = state;
        // console.log(tabs)
        if(state){
          // console.log('state');
          return 'hello'
        }
      }
    },
  } 
};

export default getPositions;