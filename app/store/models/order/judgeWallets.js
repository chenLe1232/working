
const judgeWallets = {
  state: {
    avaWallet:{
      mgnBuy: 0,
      mgnSell: 0,
    }
  },
  reducers: {
    getJudgeWallets(state, payload) {
      return {
        ...state,
        avaWallet: {
          mgnSell: payload.mgnSell,
          mgnBuy: payload.mgnBuy,
        }
      };
    },
  },
};

export default judgeWallets;