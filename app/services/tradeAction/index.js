// 合约钱包
const getFutureWallets = (UID) => ({
  req: 'GetWallets',
  rid: 'getFutureWallets',
  args: {
    AId: `${UID}01`,
  },
});

// 币币钱包
const getExchangeWallets = (UID) => ({
  req: 'GetWallets',
  rid: 'getExchangeWallets',
  args: {
    AId: `${UID}02`,
  },
});

// 资金中心钱包
const getCcsWallets = (UID) => ({
  req: 'GetCcsWallets',
  rid: 'getCcsWallets',
});

// 成交记录
const getTrades = (UID) => ({
  req: 'GetTrades',
  rid: 'GetTrades',
  args: {
    AId: `${UID}01`,
  },
});

// 当前委托
const getOrders = (UID) => ({
  req: 'GetOrders',
  rid: 'GetOrders',
  args: {
    AId: `${UID}01`, 
  },
});

// 历史委托
const getHistOrders = (UID) => ({
  req: 'GetHistOrders',
  rid: 'GetHistOrders',
  args: {
    AId: `${UID}01`,
  },
});

// 当前持仓
const getPositions = (UID) => ({
  req: 'GetPositions',
  rid: 'GetPositions',
  args: {
    AId: `${UID}01`,
  },
});

// 钱包日志
const getWalletsLog = (UID) => ({
  req: 'GetWalletsLog',
  rid: 'GetWalletsLog',
  args: {
    AId: `${UID}01`,
  },
})

export {
  getFutureWallets,
  getExchangeWallets,
  getCcsWallets,
  getTrades,
  getOrders,
  getHistOrders,
  getPositions,
  getWalletsLog,
};
