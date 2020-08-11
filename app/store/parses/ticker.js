import _ from 'lodash';

const parseTicker = (data) => {
  // 反序列化，按名称排序，返回tick类型数组
  // return _.sortBy(JSON.parse(data), item => item.data.Sym).map(item => item.subj === 'tick' && item.data);
  return _.chain(JSON.parse(data)).sortBy(item => item.data.Sym).map(item => item.subj === 'tick' && item.data).filter(v => v).value();
}

export {
  parseTicker
}