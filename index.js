import { send } from 'micro';
import { parse } from 'url';
import AccessToken from './lib/access-token';
import { STATUS_CODES } from 'http';
import config from './config';

const { apps, auth } = config;

if (!apps.length) {
  throw new Error('No Appid Found');
}

const mountedApps = {};
apps.map(({ appid, secret }) => {
  mountedApps[appid] = new AccessToken(appid, secret);
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

  const data = await mountedApps[appid].fetch(force);
  send(res, 200, data);
}
