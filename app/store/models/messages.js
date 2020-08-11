const messages = {
  state: {
    en: {},
  },
  reducers: {
    setMessages(state, payload) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default messages;
