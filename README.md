## 开发指导

启动开发
```bash
npm run dev:backend
npm run dev:test
npm run dev:online
```


## 产品文档
```bash
登录，合约开通，资产划转（王秋实）：http://59.110.243.59/display/kangbo/FUTURES
UI地址：https://lanhuapp.com/web/#/item/project/board?pid=f138e1b6-3945-4236-bd46-c6bc0bccca55
```

## 接口文档
```bash
对外官方api文档: https://github.com/gmex/api-doc/blob/master/WebSocket_API_for_GMEX_v1.md
内部官方api文档: https://github.com/hexiaoyuan/gmex.api/blob/master/gmex-unofficial-api-docs/WebSocket_API_for_GMEX_v1.md
合约前期供测试接口：
http://59.110.243.59/pages/viewpage.action?pageId=1017689
http://59.110.243.59/pages/viewpage.action?pageId=1017693
http://59.110.243.59/pages/viewpage.action?pageId=1017699
```



## 目录结构
```bash
kb-futures
|-- webpack.config.js               webpack配置
|-- tools
|--|-- mergeMessage.js              国际化内容提取
|-- app
|--|-- components                   业务组件
|--|-- config                       配置文件
|--|-- consts                       全局通用业务常量配置
|--|-- controllers                  业务view层
|--|-- decorators                   装饰器
|--|-- i18n                         国际化文件
|--|-- lib
|--|--|-- charting_library          Tradingview
|--|-- publicComponents             公共组件(非具体业务)
|--|-- services                     服务层
|--|--|-- apis                      只负责网络层的通信请求，包括socket的订阅/取消订阅
|--|-- static                       静态资源
|--|-- store                        store全局唯一
|--|--|-- models                    models(state，reducers，actions)
|--|--|-- parses                    数据转换层：请求的结果或socket推送数据，请使用ES6,lodash中的方法。
|--|-- styles                       样式
|--|-- utils
|--|--|-- format.js                 和业务无关的通用格式方法
|--|-- index.html                   主入口
|--|-- index.js                     主入口js文件
```


