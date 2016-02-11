import TokenManager from 'wechat-token';

export default function (apps) {
  if (!apps.length) {
    throw new Error('No Appid Found');
  }

  const tokenManagers = {};
  apps.map(({ appid, secret }) => {
    const tokenManager = tokenManagers[appid] = {};
    tokenManager.instance = new TokenManager(appid, secret);
    tokenManager.instance.on('token', (token) => {
      tokenManager.error = null;
      tokenManager.accessToken = token;
    });

    tokenManager.instance.on('error', (err) => {
      tokenManager.error = err;
    });

    tokenManager.refresh = () => new Promise((resolve) => {
      tokenManager.instance.refresh(resolve);
    });

    tokenManager.instance.start();
  });

  return tokenManagers;
}
