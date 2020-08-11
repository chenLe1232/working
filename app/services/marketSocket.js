// import config from '$config/hostConfig';
import wss from '$config/socket';
import _ from 'lodash';
import { orderl2 } from '$store/parses/depth';
import { parseTicker } from '$store/parses/ticker';

let ws;
let store;
// let heartbeat;
let onExchangeRealtimeCallback;
let getHistoryCandleCallback;

const queue = [];

const send = (data) => {
  switch (ws.readyState) {
    case WebSocket.CONNECTING:
      queue.push(data);
      break;
    case WebSocket.OPEN:
      ws.send(JSON.stringify(data));
      break;
    case WebSocket.CLOSING:
    case WebSocket.CLOSED:
      break;
    default:
      break;
  }
};

const startSocket = () => {
  ws = new WebSocket(wss.marketWss);

  ws.onopen = () => {
    console.log('websocket connected.');
    // store.dispatch({
    //   type: Socket.CLOSED,
    //   payload: 0,
    // });
    // store.dispatch({
    //   type: Socket.OPENED,
    // });

    // heartbeat = setInterval(() => ws.send(JSON.stringify({
    //   event: 'ping',
    // })), 20000);

    while (queue.length) {
      send(queue.shift());
    }
  };

  ws.onclose = (code) => {
    console.log(`websocket closed. Code: ${JSON.stringify(code)}`);
    // clearInterval(heartbeat);
    // store.dispatch({
    //   type: Socket.CLOSED,
    //   payload: code,
    // });
    // console.log('websocket closed. Reconnect after 3s ...');
    setTimeout(startSocket, 3000);
  };

  ws.onerror = (error) => {
    console.log(`websocket error happened. Error: ${JSON.stringify(error)}`);
    // clearInterval(heartbeat);
    // store.dispatch({
    //   type: Socket.ERROR,
    //   payload: error,
    // });
  };

  ws.onmessage = (message) => {
    const {
      rid,
      subj,
      data,
      code,
    } = JSON.parse(message.data);
    // console.log(message.data)
    //tick行情数组
    if (Array.isArray(JSON.parse(message.data))) {
      // console.log(JSON.parse(message.data))
      store.dispatch.ticker.socketUpdateCurrentTick(parseTicker(message.data).filter(item => item.Sym === store.getState().ticker.currentSymbol)[0])
      store.dispatch.ticker.getAllTicker(parseTicker(message.data));
      return;
    }

    // if (event && event === 'pong') {
    // 	return null;
    // }

    // if (channel) {
    // if (!data.result) {
    //   store.dispatch({
    //     type: Socket.SUBSCRIBE_ERROR,
    //     payload: data,
    //   });
    // }
    // 	return null;
    // }

    //
    // const focusedProduct = store.getState().getIn(['ui', 'exchange', 'focus']);
    // const currentPath = store.getState().getIn(['ui', 'path', 'main']);
    // const focusPortfolio = store.getState().getIn(['ui', 'portfolio', 'products', 'focus']);
    // const recievedProduct = `${base}_${quote}`;
    switch (subj) {
      case 'orderl2':
        const depth = orderl2({ state: store.getState().depth }, data);
        if (!depth) return;
        const orderl2_obj = {};
        orderl2_obj[data.Sym] = depth;
        return store.dispatch.depth.socketUpdateDepth(orderl2_obj, depth);
      case 'trade':
        const storeTradeList = store.getState().trade.tradeList;
        const tradeList = storeTradeList.slice && storeTradeList.slice(0, 19);
        tradeList.unshift(data);
        return store.dispatch.trade.socketUpdateTrade(tradeList);
      case 'kline': //更新k线
        const {
          Sec,
          PrzLow,
          PrzHigh,
          PrzOpen,
          PrzClose,
          Volume
        } = data;
        onExchangeRealtimeCallback && onExchangeRealtimeCallback({
          time: Sec * 1000,
          low: PrzLow,
          high: PrzHigh,
          open: PrzOpen,
          close: PrzClose,
          volume: Volume,
        })
        return null;
      // return store.dispatch.kline.socketUpdateCandles(data);
      case 'tick':
        return store.dispatch.ticker.socketUpdateCurrentTick(data);
      case 'Sub_tick_BTC.USDT':
        let test_sym_BTC_USDT = {
          'BTC.USDT':data
        }
        store.dispatch.tickSym.getTickSym(test_sym_BTC_USDT);
      case 'index':
        return store.dispatch.ticker.socketUpdateCurrentIndex(data);
      // case 'exchange.candles':
      //   dispatch({ type: 'kline/socketUpdateCandles', payload: data });
      //   data.forEach((i) => onExchangeRealtimeCallback && onExchangeRealtimeCallback({
      //     time: Number(i[0]),
      //     low: Number(i[1]),
      //     high: Number(i[2]),
      //     open: Number(i[3]),
      //     close: Number(i[4]),
      //     volume: Number(i[5]),
      //   }));
      //   return null;
    };

    switch (rid) {
      case 'GetLatestKLine':  //历史k线
        const candles = [];
        const {
          Count,
          Sec,
          PrzLow,
          PrzHigh,
          PrzOpen,
          PrzClose,
          Volume
        } = data;
        for (let i = 0; i < Count; i++) {
          candles.unshift({
            time: Sec[i] * 1000,
            low: PrzLow[i],
            high: PrzHigh[i],
            open: PrzOpen[i],
            close: PrzClose[i],
            volume: Volume[i],
          })
        }
        getHistoryCandleCallback(candles);
        return null;
      case 'GetAssetD':
        store.dispatch.ticker.subscribeAllTicks(data);
        store.dispatch.ticker.getAllProduct(data);
        return null;
      case 'GetAssetDOrder':
        // console.log(data);
        let re_assetD = {};
        for(let i = 0; i < data.length; i++){
          let item = data[i];
          re_assetD[item.Sym] = item;
        }
        // console.log(re_assetD)
        store.dispatch.getAssetD.getAssetChange(re_assetD);
          break;
      case 'GetCompositeIndex':
        const symbol = store.select.ticker.mergeTick(store.getState().ticker).ToC;
        store.dispatch.ticker.getAllIndex(data);
        store.dispatch.ticker.subscribeIndex({indexList: data, symbol})
        return null;
      default:
        return null;
    }
  };
};

export const init = (localstore) => {
  store = localstore;
  startSocket();
};

export const signin = (token) => send({
  event: 'login',
  params: { token },
});

export const signout = () => send({
  event: 'logout',
});

export const subscribe = (params) => send({
  req: 'Sub',
  expires: Date.now() + 1000,
  ...params,
});

export const unsubscribe = (params) => send({
  req: 'UnSub',
  expires: Date.now() + 1000,
  ...params,
});

export const setHistoryCandleCallback = (resolution, symbol, callback) => {
  getHistoryCandleCallback = callback;
  store.dispatch.kline.getLatestKLine({ symbol, interval: resolution || '1m' });
}

export const setExchangeRealtimeCallback = (callback) => {
  onExchangeRealtimeCallback = callback;
};
