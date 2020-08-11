import Cookies from 'js-cookie';

const appInit = {
  state: {},
  effects: (dispatch) => ({
    async start(payload, rootState) {
      // const accessToken = Cookies.get('token');
      await dispatch.locale.changeLocale();
      dispatch.booting.setBooting(false);
    },
  }),
};

export default appInit;
