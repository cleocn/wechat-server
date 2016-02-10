import { json } from 'micro';
import rp from 'request-promise';

export default async function (req, tokenManager) {
  const query = req.query;
  query.access_token = tokenManager.accessToken;

  let body;
  if (req.method === 'POST') {
    body = await json(req);
  }

  const opts = {
    uri: req.pathname,
    baseUrl: 'https://api.weixin.qq.com/',
    qs: query,
    method: req.method,
    body,
    json: true,
  };

  let result = await rp(opts);

  if ([40001, 40014, 42001].includes(result.errcode)) {
    await tokenManager.refresh();

    // now access_token is refreshed
    result = await rp(opts);
  }

  return result;
}
