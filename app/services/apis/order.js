import { tradeSocket as socket } from '$services';

const subscribe = (param) => {
  const { AId, OrderId, symbol } = param;
  socket.subscribe({
    req: 'OrderDel',
    rid: 'OrderDel',
    args: {
      AId: AId,
      OrdId: OrderId,
      Sym: symbol,
    },
  });
};

export default {
  subscribe,
};
