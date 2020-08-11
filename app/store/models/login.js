import apis from '$services/apis/login';

const login = {
  state: {
    subscribing: false,
    userInfo: '',
  },
  reducers: {
    subscribingChange(state, payload) {
      return {
        ...state,
        subscribing: payload,
      };
    },
    loadUserInfo(state, payload) {
      return {
        ...state,
        userInfo: payload,
      };
    },
  },
  effects: (dispatch) => ({
    async subscribe(payload) {
      await apis.subscribe(payload);
      // 这里还不能确定用户已经登入 成功
      // dispatch.login.subscribingChange(true);
    },
  }),
};

export default login;
