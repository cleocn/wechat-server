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
    if (AUTH_ENABLE === '0') return true;

    const { USERNAME, PASSWORD } = process.env;

    // by query params
    const query = req.query;
    if (query && query.username && query.password) {
      const { username, password } = query;
      if (username === USERNAME && password === PASSWORD) return true;
    } else {
      // by authorization header
      if (!req.headers.authorization) return false;

      const encoded = req.headers.authorization.split(' ')[1];
      const decoded = new Buffer(encoded, 'base64').toString('utf8');
      const [username, password] = decoded.split(':');

      if (username === USERNAME && password === PASSWORD) return true;
    }

    return false;
  },
};
