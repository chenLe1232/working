import { dispatch } from '@rematch/core';
import config from '$config/hostConfig';

let ws;
let heartbeat;
let onExchangeRealtimeCallback;

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
  ws = new WebSocket(config.wss);

  ws.onopen = () => {
    console.log('websocket connected.');
    // store.dispatch({
    //   type: Socket.CLOSED,
    //   payload: 0,
    // });
    // store.dispatch({
    //   type: Socket.OPENED,
    // });

    heartbeat = setInterval(() => ws.send(JSON.stringify({
      event: 'ping',
    })), 20000);

    while (queue.length) {
      send(queue.shift());
    }
  };

  ws.onclose = (code) => {
    // console.log(`websocket closed. Code: ${JSON.stringify(code)}`);
    clearInterval(heartbeat);
    // store.dispatch({
    //   type: Socket.CLOSED,
    //   payload: code,
    // });
    // console.log('websocket closed. Reconnect after 3s ...');
    setTimeout(startSocket, 3000);
  };

  ws.onerror = (error) => {
    // console.log(`websocket error happened. Error: ${JSON.stringify(error)}`);
    clearInterval(heartbeat);
    // store.dispatch({
    //   type: Socket.ERROR,
    //   payload: error,
    // });
  };

  ws.onmessage = (message) => {
    const {
      event,
      channel,
      biz,
      type,
      data,
      base,
      quote,
    } = JSON.parse(message.data);


    if (event && event === 'pong') {
      return null;
    }

    if (channel) {
      // if (!data.result) {
      //   store.dispatch({
      //     type: Socket.SUBSCRIBE_ERROR,
      //     payload: data,
      //   });
      // }
      return null;
    }

    //
    // const focusedProduct = store.getState().getIn(['ui', 'exchange', 'focus']);
    // const currentPath = store.getState().getIn(['ui', 'path', 'main']);
    // const focusPortfolio = store.getState().getIn(['ui', 'portfolio', 'products', 'focus']);
    // const recievedProduct = `${base}_${quote}`;
    switch (`${biz}.${type}`) {
      // case Indexes.Tickers.SOCKET_UPDATE:
      //   return store.dispatch(Indexes.Tickers.socketUpdate(data));
      //
      // case Indexes.Candles.SOCKET_UPDATE:
      //   data[0].push(base);
      //   return stateMerger(
      //     Indexes.Candles.SOCKET_UPDATE,
      //     data,
      //     1000,
      //     (allData) => {
      //       store.dispatch(Indexes.Candles.socketUpdate(allData));
      //     },
      //   );

      // case User.Balance.SOCKET_UPDATE:
      //   exchangeBalanceData.push(data);
      //   console.log(exchangeBalanceData, 'ss');
      //   if (exchangeBalanceTimehandler > Date.now()) return null;
      //   exchangeBalanceTimehandler = Date.now() + 1000;
      //   store.dispatch(User.Balance.socketUpdate(data));
      //   return null;

      // case User.Balance.SOCKET_UPDATE:
      //   store.dispatch(User.Balance.socketUpdate(data));
      //   return null;
      //
      // case Exchange.Products.SOCKET_UPDATE:
      //   return store.dispatch(Exchange.Products.socketUpdate(data));
      //
      // case Exchange.Products.SOCKET_UPDATE_META:
      //   return store.dispatch(Exchange.Products.load());
      //
      // case Exchange.Orders.SOCKET_UPDATE:
      //   return store.dispatch(Exchange.Orders.socketUpdate(data));
      //
      // case Exchange.Fills.SOCKET_UPDATE:
      //   if (focusedProduct !== recievedProduct) break;
      //   return store.dispatch(Exchange.Fills.socketUpdate(data));
      //
      // case Exchange.Depth.SOCKET_UPDATE:
      //   if (focusedProduct !== recievedProduct) break;
      //   return store.dispatch(Exchange.Depth.socketUpdate(data));

      case 'exchange.candles':
        dispatch({ type: 'kline/socketUpdateCandles', payload: data });
        data.forEach((i) => onExchangeRealtimeCallback && onExchangeRealtimeCallback({
          time: Number(i[0]),
          low: Number(i[1]),
          high: Number(i[2]),
          open: Number(i[3]),
          close: Number(i[4]),
          volume: Number(i[5]),
        }));
        return null;
      default:
        return null;
    }
  };
};

export const init = () => {
  startSocket();
};

export const signin = token => send({
  event: 'login',
  params: { token },
});

export const signout = () => send({
  event: 'logout',
});

export const subscribe = params => send({
  event: 'sub',
  params,
});

export const unsubscribe = params => send({
  event: 'unsub',
  params,
});

export const setExchangeRealtimeCallback = (callback) => {
  onExchangeRealtimeCallback = callback;
};
