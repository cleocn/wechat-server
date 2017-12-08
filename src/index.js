/* eslint-disable no-console */
import micro from 'micro';

import app from './app';
import config from './config';


micro(app).listen(config.port, () => {
  console.log(`server listening ${config.port}`);
});
