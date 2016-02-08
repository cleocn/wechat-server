Wechat ATM
======
微信公众平台 AccessToken 中控微服务，基于(micro)[https://github.com/zeithq/micro]
用于集中管理调用微信公众平台接口的 `access_token`，可以同时为多个公众平台提供服务

## 使用方法
克隆此项目到本地

设置微信公众平台的Appid和Secret

##### 通过环境变量设置
`WX_APPS=${appid1}:${secret1},${appid2}:${secret2}`

##### 或者修改 `config.js`
```js
apps.push({
  appid: 'appid1',
  secret: 'secret1',
}, {
  appid: 'appid2',
  secret: 'secret2',
});
```

##### 启动服务 `npm start`
访问 `localhost:3030/?appid=${appid}` 即可获得`access_token`

##### 强制更新 `access_token`
访问 `localhost:3030/refresh?appid=${appid}` 即可获得更新的`access_token`
请仅在调用接口返回 `errcode` 为 `40001 或 40014 或 42001` 时调用一次，请勿频繁调用

## 自定义鉴权方法
修改`config.js` 的 `auth` 方法即可自定义鉴权方式

## License
The MIT license.
