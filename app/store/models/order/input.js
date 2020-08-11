const setInputValue = {
  state: {
      limitPrice:'',
      limitNums: '',
      marketNums:'',
      limitOrderPrice: '',
      limitOrderNums:'',
      marketOrderNums:'',
      whichSelectOne: '0',
      whichSelectTwo: '0',
      selectMkPrzOne: '',
      selectMkPrzTwo:'',
  },
  reducers:{
    setLimitPrice(state, payload){
      return {
        ...state,
        limitPrice: payload,
      }
    },
    setLimitNums(state, payload){
      return {
        ...state,
        limitNums: payload,
      }
    },
    setMaketNums(state, payload){
      return {
        ...state,
        marketNums: payload,
      }
    },
    setLimitOrderPrice(state, payload){
      return {
        ...state,
        limitOrderPrice: payload,
      }
    },
    setLimitOrderNums(state, payload){
      return {
        ...state,
        limitOrderNums: payload,
      }
    },
    setWhichSelectOne(state, payload){
      return {
        ...state,
        whichSelectOne: payload
      }
    },
    setWhichSelectTwo(state, payload){
      return {
        ...state,
        whichSelectTwo: payload,
      }
    },
    setSelectMkPrzOne(state, payload){
      return {
        ...state,
        selectMkPrzOne: payload,
      }
    },
    setSelectMkPrzTwo(state, payload){
      return {
        ...state,
        selectMkPrzTwo: payload
      }
    },
    setMarketOrderNums(state, payload){
      return {
        ...state,
        marketOrderNums: payload,
      }
    },
    clearInputValue(state, payload){
      return {
        ...state,
        limitNums: '',
        marketNums:'',
        limitOrderNums:'',
        marketOrderNums:'',
        whichSelectOne: '0',
        whichSelectTwo: '0',
        selectMkPrzOne: '',
        selectMkPrzTwo:'',
      }
    }
  }
}

export default setInputValue;