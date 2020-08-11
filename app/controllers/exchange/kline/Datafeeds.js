import { setHistoryCandleCallback, setExchangeRealtimeCallback } from '$services/marketSocket';
import { dateMap } from '$config/candleConfig';
import apis from '$services/apis/kline';


const Datafeeds = {};

Datafeeds.UDFCompatibleDatafeedExchange = function (symbolInfo) {
  this.configuration = undefined;
  this.symbolInfo = symbolInfo;
  this.enableLogging = false;
  this.initializationFinished = false;
  this.callbacks = {};

  this.initialize();
};

Datafeeds.UDFCompatibleDatafeedExchange.prototype.defaultConfiguration = function () {
  return {
    supports_search: false,
    supports_group_request: true,
    supported_resolutions: this.symbolInfo.supported_resolutions,
    supports_marks: true,
    supports_timescale_marks: false,
    supports_time: true,
  };
};

Datafeeds.UDFCompatibleDatafeedExchange.prototype.getServerTime = function (callback) {
  if (this.configuration.supports_time) {
    callback(new Date().getTime() / 1000);
  }
};

Datafeeds.UDFCompatibleDatafeedExchange.prototype.on = function (event, callback) {
  // eslint-disable-next-line no-prototype-builtins
  if (!this.callbacks.hasOwnProperty(event)) {
    this.callbacks[event] = [];
  }

  this.callbacks[event].push(callback);
  return this;
};

Datafeeds.UDFCompatibleDatafeedExchange.prototype.fireEvent = function (event, argument) {
  // eslint-disable-next-line no-prototype-builtins
  if (this.callbacks.hasOwnProperty(event)) {
    const callbacksChain = this.callbacks[event];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < callbacksChain.length; ++i) {
      callbacksChain[i](argument);
    }

    this.callbacks[event] = [];
  }
};

Datafeeds.UDFCompatibleDatafeedExchange.prototype.onInitialized = function () {
  this.initializationFinished = true;
  this.fireEvent('initialized');
};

Datafeeds.UDFCompatibleDatafeedExchange.prototype.logMessage = function (message) {
  if (this.enableLogging) {
    const now = new Date();
    console.log(`${now.toLocaleTimeString()}.${now.getMilliseconds()}>${message}`);
  }
};

Datafeeds.UDFCompatibleDatafeedExchange.prototype.initialize = function () {
  this.configuration = this.defaultConfiguration();
  this.onInitialized();
  this.fireEvent('configuration_ready');
};

Datafeeds.UDFCompatibleDatafeedExchange.prototype.onReady = function (callback) {
  if (this.configuration) {
    setTimeout(() => {
      callback(this.configuration);
    }, 0);
  } else {
    this.on('configuration_ready', () => {
      callback(this.configuration);
    });
  }
};

// eslint-disable-next-line max-len
Datafeeds.UDFCompatibleDatafeedExchange.prototype.resolveSymbol = function (symbolName, onSymbolResolvedCallback) {
  setTimeout(() => {
    onSymbolResolvedCallback(this.symbolInfo);
  }, 0);
};

// eslint-disable-next-line max-len
Datafeeds.UDFCompatibleDatafeedExchange.prototype.getBars = function somename(symbolInfo, resolution, rangeStartDate, rangeEndDate, onDataCallback, onErrorCallback, firstDataRequest) {
  // ßtimestamp sample: 1399939200
  firstDataRequest && setHistoryCandleCallback(dateMap[resolution], this.symbolInfo.pairCode, onDataCallback);
  // if (rangeStartDate > 0 && rangeStartDate.toString().length > 10) {
  //   throw new Error(['Got a JS time instead of Unix one.', rangeStartDate, rangeEndDate]);
  // }

  // if (firstDataRequest && this.symbolInfo && this.symbolInfo.pairCode) {
  //   apis.getCandlesData(resolution, this.symbolInfo.pairCode).then((bars) => {
  //     console.log(bars)
  //     onDataCallback(bars, {
  //       noData: !bars.length,
  //     });
  //   }).catch((e) => {
  //     onErrorCallback(`network error:${JSON.stringify(e)}`);
  //   });
  // } else {
  //   onDataCallback([], {
  //     noData: true,
  //   });
  //   // onErrorCallback(`${localStorage.oldtime}没有数据了`);
  // }
};
// 订阅K线数据。图表库将调用onRealtimeCallback方法以更新实时数据。
// eslint-disable-next-line max-len
Datafeeds.UDFCompatibleDatafeedExchange.prototype.subscribeBars = function (symbolInfo, resolution, onRealtimeCallback, listenerGUID, onResetCacheNeededCallback) {
  setExchangeRealtimeCallback(onRealtimeCallback);
};

// 取消订阅K线数据。在调用subscribeBars方法时,图表库将跳过与subscriberUID相同的对象。
Datafeeds.UDFCompatibleDatafeedExchange.prototype.unsubscribeBars = function () {
  // this.socket.destroy();
  setExchangeRealtimeCallback(null);
};

// 图书馆调用这个函数来获得可见的K线范围的标记。 图表预期每调用一次getMarks就会调用一次onDataCallback。
// eslint-disable-next-line max-len
Datafeeds.UDFCompatibleDatafeedExchange.prototype.getMarks = function (symbolInfo, rangeStart, rangeEnd, onDataCallback, resolution) {
  onDataCallback([{
    id: 1,
    time: localStorage.maxTime,
    color: {
      border: '#5B8E67',
      background: '#5B8E67',
    },
    text: localStorage.maxPrice,
    label: 'H',
    labelFontColor: '#fff',
    minSize: 24,
  },
  {
    id: 2,
    time: localStorage.minTime,
    color: 'red',
    text: localStorage.minPrice,
    label: 'L',
    labelFontColor: '#fff',
    minSize: 24,
  },
  ]);
};

// 图表库调用此函数获取可见K线范围的时间刻度标记。图表预期您每个调用getTimescaleMarks会调用一次onDataCallback。
// eslint-disable-next-line max-len
Datafeeds.UDFCompatibleDatafeedExchange.prototype.getTimescaleMarks = function (symbolInfo, rangeStart, rangeEnd, onDataCallback, resolution) {
  onDataCallback([]);
};

// eslint-disable-next-line max-len
// Datafeeds.UDFCompatibleDatafeedExchange.prototype.calculateHistoryDepth = function (resolution, resolutionBack, intervalBack){
//   onDataCallback([]);
// };

export default {
  UDFCompatibleDatafeedExchange: Datafeeds.UDFCompatibleDatafeedExchange,
};
