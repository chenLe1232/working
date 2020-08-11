// 有用
const argsState = (state) => {
  let resultObj = {};
  // const judgeFlag = (i) => {
  //   return ( i === 'orderinfo'||  i === 'local' || i === 'kline')
  // }
  for(let i in state){
    if  ( i === 'orderinfo'||  i === 'local' || i === 'kline'){
      // if ( i === 'depth'){
      //   let selectPrice = state[i].selectPrice
      //   console.log(selectPrice)
      //   resultObj = { selectPrice, ...resultObj}
      // }
      continue;
    }
    resultObj = {...resultObj, ...state[i]};
  };
  return resultObj;
};

export default argsState;
