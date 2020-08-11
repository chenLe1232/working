const tabs = {
  state: {
    openPosition: 0,
    quanCang: 0,
    activeSelect: 0,
    userLever: 0,
    passiveChecked: false,
  },
  reducers: {
    setPassiveChecked(state, payload){
      return {
        ...state,
        passiveChecked: payload,
      }
    },
    setOpenPositions(state, payload){
      return {
        ...state,
        openPosition: payload,
      }
    },
    setQuancang(state, payload){
      return {
        ...state,
        quanCang: payload,
      }
    },
    setActiveSelect(state, payload){
      return {
        ...state,
        activeSelect: payload,
      }
    },
    setUserLever(state, payload){
      return {
        ...state,
        userLever: payload,
      }
    }
  },
  selectors:{
    test(state){
      console.log(typeof state )
      return (state, payload) => {
        // console.log(state,payload);
        return state;
      }
    },
  }
};
export default tabs;