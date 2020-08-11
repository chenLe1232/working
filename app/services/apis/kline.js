import { network, marketSocket as socket } from '$services';
import { dateMap } from '$config/candleConfig';
import config from '$config/hostConfig';

/**
 * 获取历史K线数据。
 * @param resolution 颗粒度1min,3min,5min,15min,30min,1hour,2hour,4hour,6hour,12hour,day,week
 * @param pairCode 币对
 * @returns {Promise<any> => array }
 */
const getCandlesData = (resolution, pairCode) => {
  return network.get(`${config.api}/exchange/public/${pairCode}/candles`, {
    interval: dateMap[resolution] || dateMap[localStorage.interval],
    // since: rangeStartDate * 1000,
  }).then((data) => {
    if (data.length) {
      const bars = data.map((tickArr) => {
        return {
          time: tickArr[0],
          low: tickArr[1],
          high: tickArr[2],
          open: tickArr[3],
          close: tickArr[4],
          volume: tickArr[5],
        };
      });

      const status = bars.reduce((agg, item) => {
        if (item.low < agg.min) {
          agg.min = item.low;
          agg.minTime = item.time;
        }

        if (item.high > agg.max) {
          agg.max = item.high;
          agg.maxTime = item.time;
        }

        return agg;
      }, {
        min: Number.MAX_VALUE,
        minTime: null,
        max: Number.MIN_VALUE,
        maxTime: null,
      });

      localStorage.oldtime = data[0][0];
      // localStorage.lastBar = data[len - 1][0];
      localStorage.maxPrice = status.max;
      localStorage.maxTime = status.maxTime / 1000;
      localStorage.minPrice = status.min;
      localStorage.minTime = status.minTime / 1000;
      return bars;
    }
    return [];
  });
};

const getLatestKLine = (params) => {
  const { symbol, interval } = params;
  socket.subscribe({
    req: 'GetLatestKLine',
    rid: 'GetLatestKLine',
    args: {
      Sym: symbol,
      Typ: interval,
      Count: 2000,
    },
  });
};

/**
 * webSocket的K线订阅数据。默认订阅15分钟(15min)。
 * biz代表业务线
 * base和quote代表一个币对，比如 BTC/USDT ,base=BTC quote=USDT
 * since为时间，默认为当前数据
 * zip：代表数据是否压缩
 * @param product  base和quote代表一个币对，比如 BTC/USDT ,base=BTC quote=USDT
 * @param granularity granularity为K线类型，包含：1min,3min,5min,15min,30min,1hour,2hour,4hour,6hour,12hour,day,week
 * @param since 开始时间，默认为当前时间
 * @returns {Function}
 */
const subscribe = (params) => {
  const { symbol, interval } = params;
  socket.subscribe({
    rid: 'kline',
    args: [`kline_${interval}_${symbol}`],
  });
};

/**
 * webSocket的K线取消订阅数据。默认取消订阅15分钟(15min)
 * @param product
 * @param granularity
 * @param since
 * @returns {Function}
 */
const unsubscribe = (params) => {
  const { symbol, interval } = params;
  socket.unsubscribe({
    rid: 'kline',
    args: [`kline_${interval}_${symbol}`],
    // biz: 'exchange',
    // type: 'candles',
    // pairCode,
    // index: quoteSymbol || '',
    // interval: interval || '15min',
    // since: since || Date.now(),
    // zip: false,
  });
};

export default {
  getCandlesData,
  getLatestKLine,
  subscribe,
  unsubscribe,
};
