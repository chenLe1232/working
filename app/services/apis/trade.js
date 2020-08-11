import { param } from 'jquery';
import { network, marketSocket as socket } from '$services';
import config from '$config/hostConfig';

const subscribe = (param) => {
  socket.subscribe({
    rid: 'trade',
    args: [`trade_${param}`],
  });
};

const unsubscribe = (param) => {
  socket.unsubscribe({
    rid: 'trade',
    args: [`trade_${param}`],
  });
};

export default {
  subscribe,
  unsubscribe,
};
