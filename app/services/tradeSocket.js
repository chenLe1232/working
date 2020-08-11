import wss from '$config/socket';
import { 
  getFutureWallets, 
  getExchangeWallets, 
  getCcsWallets, 
  getWalletsLog,
  getTrades,
  getOrders,
  getHistOrders,
  getPositions,
} from './tradeAction';

let ws, store, userID;
import Toast from '$components/kb-design/Toast';

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
  ws = new WebSocket(wss.tradeWss);
  ws.onopen = () => {
    console.log('ws open -- trade');
    while (queue.length){
      send(queue.shift());
    }
  };
  ws.onclose = () => {
    console.log('ws close -- trade')
  };
  ws.onerror = (error) => {
    console.log(`websocket error happened. Error:${JSON.stringify(error)}`)
  };
  ws.onmessage = (message) => {
    const { code, rid, data, subj } = JSON.parse(message.data);
    if (code === 0){
      switch (rid) {
      case 'USER_LOGIN':
        const UID = data.UserId;
        userID = UID;
        subscribe(getFutureWallets(UID));
        subscribe(getExchangeWallets(UID));
        subscribe(getCcsWallets(UID));
        subscribe(getTrades(UID));
        subscribe(getOrders(UID));
        subscribe(getPositions(UID));
        subscribe(getHistOrders(UID));
        subscribe(getWalletsLog(UID));
        store.dispatch.limitRisk.limitRisk_subscribe(UID);
        store.dispatch.login.loadUserInfo(UID);
        break;
      case 'getCcsWallets':
        return store.dispatch.wallet.loadWallets(data);
      case 'getExchangeWallets': 
        return store.dispatch.exchange.loadExchange(data);
      case 'getFutureWallets':
        return store.dispatch.futures.loadFutures(data);
      case 'GetOrders':
        return store.dispatch.order.loadOrders(data);
      case 'OrderDel':
        Toast({ content: '委托已撤销', type: 'success' })
        break;
      case 'GetTrades':
        return store.dispatch.order.loadDealRecords(data);
      case 'GetPositions':
        console.log('i have been done')
        return store.dispatch.order.loadHoldPosition(data);
      case 'GetHistOrders':
        return store.dispatch.order.loadHistOrders(data);
      case 'GetWalletsLog':
        return store.dispatch.wallet.loadWalletLog(data);
        case 'GetWallets':
          // console.log(data);
          store.dispatch.wallets.walletsChange(data)
          break;
      case 'GetRiskLimits':
        let re_lrk = {};
        for(let i = 0; i < data.length; i++){
          let item = data[i];
          re_lrk[item.Sym] = item;
        }
        store.dispatch.limitRisk.getlimitInfo(re_lrk)
        // console.log(data);
        break;
      case 'GetOrdersToOrder':
        // console.log(data,'orders_subscribe');
        store.dispatch.getOrders.getOrdersChange(data)
        break;
      case 'OrderNew':
        Toast({content: '当前订单已成功提交', type: 'success'});
        console.log(userID)
        // subscribe(getPositions(userID));
        break;
      case 'PosOp':
        // console.log(data, ' from PosOp');
        break;
      default:
        break;
      };
    };
    if (!!subj){
      switch (subj){
        // 有变化才会推送的消息
      case 'onOrder':
        // console.log(data,'onOrder');
        if (userID){
          // subscribe(getPositions(userID));
          subscribe(getHistOrders(userID));
          subscribe(getOrders(userID));
        }
        break;
      case 'onPosition':
        // store.dispatch.getPositions.getPositionsArr(data);
        // console.log('onPosition', data);
        break;
      case 'onWallet':
        // console.log('onWallet', data)
        break;
      case 'onWltLog':
        // console.log('onWltLog', data);
        break;
      case 'onTrade':
        // console.log('onTrade', data);
        break;
      default:
        break;
      }
    }
  }
}

export const subscribe = (params) => send({
  expires: Date.now() + 1000,
  ...params
});

export const unsubscribe = (params) => send({
  expires: Date.now() + 1000,
  ...params
});

export const tradeSocketInit = (localstore) => {
  store = localstore;
  startSocket();
};