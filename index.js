import { send } from 'micro';
import { parse } from 'url';
import TokenManager from 'wechat-token';
import { STATUS_CODES } from 'http';
import config from './config';

const { apps, auth } = config;

if (!apps.length) {
  throw new Error('No Appid Found');
}

const mountedApps = {};
apps.map(({ appid, secret }) => {
  const app = mountedApps[appid] = {};
  app.tokenManager = new TokenManager(appid, secret);
  app.tokenManager.on('token', (token) => {
    app.accessToken = token;
  });
  app.tokenManager.on('error', (err) => {
    app.error = err;
  });
  app.tokenManager.start();
});

export default async function (req, res) {
  Object.assign(req, parse(req.url, true));

  if (!auth(req)) {
    return send(res, 401, STATUS_CODES[401]);
  }

  const appid = req.query && req.query.appid;

  if (!appid || !mountedApps[appid]) {
    return send(res, 404, `APPID ${STATUS_CODES[404]}`);
  }

  let force = false;
  if (req.pathname === '/refresh') force = true;

  const error = mountedApps[appid].error;
  if (error) {
    send(res, 400, error);
    return;
  }

  const data = mountedApps[appid].accessToken;
  send(res, 200, data);
}
