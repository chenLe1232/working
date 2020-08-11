const confs = {
  'dev-test': {
    wss: 'wss://test.kangbo.io:7900',
    api: '',
    static: '',
    sameOriginStatic: '',
    ossStatic: 'https://skyex.oss-cn-hongkong.aliyuncs.com/otc',
  },
};

export default confs[process.env.URL_TYPE];
export { confs };
