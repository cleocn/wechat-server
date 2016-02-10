import { send } from 'micro';
import { parse } from 'url';
import { STATUS_CODES } from 'http';
import config from './config';
import agent from './lib/agent';
import tokenManagerFactory from './lib/token-manager-factory';

const { apps, auth } = config;
const tokenManagers = tokenManagerFactory(apps);

export default async (req, res) => {
  Object.assign(req, parse(req.url, true));

  if (!auth(req)) {
    return send(res, 401, STATUS_CODES[401]);
  }

  let tokenManager;
  if (apps.length === 1) {
    tokenManager = tokenManagers[apps[0].appid];
  } else {
    const appid = req.query && req.query.appid;
    if (appid && tokenManagers[appid]) {
      tokenManager = tokenManagers[appid];
    } else {
      return send(res, 404, `APPID ${STATUS_CODES[404]}`);
    }
  }

  // proxy wechat api
  if (/cgi-bin/.test(req.pathname)) {
    let result;
    try {
      result = await agent(req, tokenManager);
    } catch (error) {
      return send(res, 400, error);
    }

    return send(res, 200, result);
  }

  // show access_token
  let force = false;
  if (req.pathname === '/refresh') force = true;

  const error = tokenManager.error;
  if (error) {
    return send(res, 400, error);
  }

  if (force) {
    tokenManager.instance.refresh((token) => {
      send(res, 200, token);
    });
    return 1;
  }

  const data = tokenManager.accessToken;
  send(res, 200, data);
};
