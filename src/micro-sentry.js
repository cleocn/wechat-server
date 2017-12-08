
import { send } from 'micro';
import Raven from 'raven';

Raven.config('http://eb80efd1efb34d488befe48271447829:ea8c0407ca184a15b8f68398ef43a77f@139.199.9.175:9000/2').install();

export default handleErrors => async (req, res) => {
  try {
    return await handleErrors(req, res);
  } catch (err) {
    Raven.captureException(err);
    send(res, 500, err);
  }
};
