import rp from 'request-promise';

export default class AccessToken {
  constructor(appid, secret) {
    if (!appid || !secret) {
      throw new Error('Missing appid or secret');
    }

    this.appid = appid;
    this.secret = secret;
    this.accessTokenUrl = `https://api.weixin.qq.com/cgi-bin/token?` +
      `grant_type=client_credential&appid=${this.appid}&secret=${this.secret}`;
  }

  get accessToken() {
    return {
      access_token: this._accessToken,
    }
  }

  set accessToken(data) {
    // 将实际过期时间提前10秒，以防止临界点
    this._expireTime = data ? (new Date().getTime()) + (data.expires_in - 10) * 1000 : null;
    this._accessToken = data ? data.access_token : null;
  }

  isValid() {
    return !!this._accessToken && (new Date().getTime()) < this._expireTime;
  }

  fetchAccessToken() {
    return rp({uri: this.accessTokenUrl, json: true});
  }

  async fetch(force) {
    if (!force && this.isValid()) {
      return this.accessToken;
    }

    let data = {};
    try {
      data = await this.fetchAccessToken();
    } catch (e) {
      // custom error
      data.errcode = -2;
      data.message = e.message;
    }

    if (data && data.errcode && data.errcode !== 0) {
      this.accessToken = null;
      return data;
    }

    this.accessToken = data;

    return this.accessToken;
  }
}
