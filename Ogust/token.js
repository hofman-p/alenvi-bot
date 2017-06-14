const Ogust = require('../config').Ogust;
const rp = require('request-promise');
const crypto = require('crypto');
const moment = require('moment');

/** ******** AUTHENTIFICATION **********/

/*
** Get token from Ogust base
** Method: POST
*/
exports.getToken = () => {
  const dateTime = moment();
  const payload = {
    key: Ogust.PUBLIC_KEY,
    request: 'GET_TOKEN',
    time: `${moment().utc(dateTime).format('YYYYMMDDHHmmss')}.${Math.floor(Math.random() * ((999999 - 100000) + 1)) + 100000}`,
  };
  const joinPayload = `${payload.key}+${payload.request}+${payload.time}`;
  const hash = crypto.createHmac('sha1', Ogust.PRIVATE_KEY).update(joinPayload).digest('hex');
  payload.api_signature = hash.toUpperCase();
  return rp.post({
    uri: `${Ogust.API_LINK}getToken`,
    body: payload,
    json: true,
    resolveWithFullResponse: true,
    time: true,
  });
};
