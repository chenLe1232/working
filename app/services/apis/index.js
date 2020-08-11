import { marketSocket } from '$services';

const getCompositeIndex = (param) => {
  marketSocket.subscribe({
    req: 'GetCompositeIndex',
    rid: 'GetCompositeIndex',
    args: {},
  })
}

const subscribe = (param) => {
  marketSocket.subscribe({
    rid: 'index',
    args: param,
  });
};

const unsubscribe = (param) => {
  marketSocket.unsubscribe({
    rid: 'index',
    args: param,
  });
};

export default {
  getCompositeIndex,
  subscribe,
  unsubscribe,
};