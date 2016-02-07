import { send } from 'micro';
import { parse } from 'url';
import AccessToken from './lib/access-token';

import dotenv from 'dotenv';
dotenv.config();

const { WX_APPS } = process.env;

const apps = {};
WX_APPS.split(',').map(item => item.split(':')).map(([appid, secret]) => {
  apps[appid] = new AccessToken(appid, secret);
});

export default async function (req, res) {
  Object.assign(req, parse(req.url, true));

  if (!Auth.isValid(req)) {
    return send(res, 401, 'Unauthorized');
  }

  const appid = req.query && req.query.appid;

  if (!appid || !apps[appid]) {
    return send(res, 404, 'Appid not found');
  }

  let force = false;
  if (req.pathname === '/refresh') force = true;

  const data = await apps[appid].fetch(force);
  send(res, 200, data);
}

// your custom auth method
const Auth = {
  username: process.env.WX_USERNAME,
  password: process.env.WX_PASSWORD,
  isValid(req) {
    if (!req.headers.authorization) return false;

    const encoded = req.headers.authorization.split(' ')[1];
    const decoded = new Buffer(encoded, 'base64').toString('utf8');
    const [username, password] = decoded.split(':');

    if (username === Auth.username && password === Auth.password) {
      return true;
    }

    return false;
  }
}
