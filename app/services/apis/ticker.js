import { param } from 'jquery';
import { network, marketSocket } from '$services';
import config from '$config/hostConfig';

const getAssetD = (param) => {
  marketSocket.subscribe({
    req: 'GetAssetD',
    rid: 'GetAssetD',
    args: {"vp": 3},
  })
}

const subscribeAllTicks = (param) => {
  marketSocket.subscribe({
    req: 'SubTicks',
    rid: 'SubTicks',
    args: param,
  })
}

const subscribe = (param) => {
  marketSocket.subscribe({
    rid: 'ticker',
    args: param,
  });
};

const unsubscribe = (param) => {
  marketSocket.unsubscribe({
    rid: 'ticker',
    args: param,
  });
};

export default {
  getAssetD,
  subscribeAllTicks,
  subscribe,
  unsubscribe,
};
