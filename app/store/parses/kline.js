import _ from 'lodash';

const parseToCandlesData = (data) => {
  return data.map((item) => {
    return {
      time: item[0],
      low: item[1],
      high: item[2],
      open: item[3],
      close: item[4],
      volume: item[5],
    };
  }).reduce((acc, product) => {
    acc[product.time] = product;
    return acc;
  }, {});
};


export default {
  parseToCandlesData,
};
