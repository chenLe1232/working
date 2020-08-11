import Cookies from 'js-cookie';
import * as apis from '$services/apis/locale';
import consts from '$consts';

/**
 * 获取默认的locale
 * */
const getPreference = () => {
  const cookieLanguage = Cookies.get('locale');
  const browserLanguage = navigator.languages ? navigator.languages.filter((lang) => consts.LOCALE.SUPPORTED_LANGUAGES.includes(lang)) : navigator.language;
  return consts.LOCALE.LANGUAGE_STANDARD_MAP[cookieLanguage || browserLanguage[0] || consts.LOCALE.DEFAULT_LANGUAGE];
};

const locale = {
  state: consts.LOCALE.LANGUAGE_KEYS.EN,
  reducers: {
    setLocale(state, payload) {
      return payload;
    },
  },
  effects: (dispatch) => ({
    async onChangeLocale(payload, rootState) {
      const newLocale = payload;
      switch (newLocale) {
      case consts.LOCALE.LANGUAGE_KEYS.ZH_CN:
        Cookies.set('locale', consts.LOCALE.LANGUAGE_KEYS.ZH_CN);
        break;
      case consts.LOCALE.LANGUAGE_KEYS.ZH_HK:
        Cookies.set('locale', consts.LOCALE.LANGUAGE_KEYS.ZH_HK);
        break;
      case consts.LOCALE.LANGUAGE_KEYS.KO:
        Cookies.set('locale', consts.LOCALE.LANGUAGE_KEYS.KO);
        break;
      default:
        Cookies.set('locale', consts.LOCALE.LANGUAGE_KEYS.EN_US);
      }

      if (newLocale === consts.LOCALE.LANGUAGE_KEYS.EN || rootState.messages[newLocale]) {
        dispatch.locale.setLocale(newLocale);
      } else {
        const messages = await apis.getLocaleMessages(newLocale);
        dispatch.messages.setMessages({
          [newLocale]: messages,
        });
        dispatch.locale.setLocale(newLocale);
      }
    },
    async changeLocale() {
      const defaultLocale = getPreference();
      await dispatch.locale.onChangeLocale(defaultLocale);
    },
  }),
};

export default locale;
