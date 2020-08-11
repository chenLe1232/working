import { param } from 'jquery';
import { network, marketSocket as socket } from '$services';
import config from '$config/hostConfig';

const subscribe = (param) => {
  socket.subscribe({
    rid: 'depth',
    args: [`orderl2_${param}`],
  });
};

const unsubscribe = (param) => {
  socket.unsubscribe({
    rid: 'depth',
    args: [`orderl2_${param}`],
  });
};

export default {
  subscribe,
  unsubscribe,
};
