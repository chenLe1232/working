const consts = {
  BRAND: '康波',
  DOMAIN: 'Kangbo.com',
  LOCALE: {
    DEFAULT_LANGUAGE: 'zh-CN',
    SUPPORTED_LANGUAGES: ['zh', 'zh-CN', 'zh-HK', 'ko', 'en'],
    LANGUAGE_STANDARD_MAP: {
      zh: 'zh-CN',
      'zh-CN': 'zh-CN',
      'zh-HK': 'zh-HK',
      'en-US': 'en',
      ko: 'ko',
    },
    LANGUAGE_KEYS: {
      ZH_CN: 'zh-CN',
      ZH_HK: 'zh-HK',
      KO: 'ko',
      EN_US: 'en-US',
      EN: 'en',
    },
    LANGUAGE_TEXT: {
      'zh-CN': '简体中文',
      'zh-HK': '繁体中文',
      ko: '한국어',
      en: 'English',
    },
  },
  ORDER: {
    PRICE: 0,
    NUMBERS: 1,
    SELECT: 2,
  },
  POSOP:{
    NEW: 0,
    DEL:1,
    MIR:2,
  }
};

export default consts;
