import dotenv from 'dotenv';
dotenv.config();

const { WX_APPS } = process.env;

const apps = [];

// set apps by process.env
WX_APPS.split(',').map(item => item.split(':')).map(([appid, secret]) => {
  apps.push({ appid, secret });
});

// set apps manual
// apps.push({ appid: 'appid', secret: 'secret' })

export default {
  apps,
  port: 3000,

  // override this auth method by your self
  auth(req) {
    const { AUTH_ENABLE } = process.env;
    if (!AUTH_ENABLE) return true;

    if (!req.headers.authorization) return false;

    const { USERNAME, PASSWORD } = process.env;

    const encoded = req.headers.authorization.split(' ')[1];
    const decoded = new Buffer(encoded, 'base64').toString('utf8');
    const [username, password] = decoded.split(':');

    if (username === USERNAME && password === PASSWORD) return true;

    return false;
  },
};
