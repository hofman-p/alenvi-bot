const Ogust = require('../config').Ogust;
const rp = require('request-promise');
const moment = require('moment');

/*
** Get a date interval using range array and interval type
** PARAMS:
** - timeOption:
** --- slotToSub (time in number to subtract),
** --- slotToAdd (time in number to add)
** --- intervalType: "day", "week", "year", "hour"...
*/
const getIntervalInRange = (timeOption) => {
  const dateNow = moment();
  timeOption.slotToSub = Math.abs(timeOption.slotToSub);
  timeOption.slotToAdd = Math.abs(timeOption.slotToAdd);
  const finalInterval = {
    intervalBwd: dateNow.subtract(timeOption.slotToSub, timeOption.intervalType).format('YYYYMMDDHHmm'),
    // We have to (re)add slotToSub, because subtract() reallocates dateNow
    intervalFwd: dateNow.add(timeOption.slotToAdd + timeOption.slotToSub, timeOption.intervalType).format('YYYYMMDDHHmm') };
  return finalInterval;
};

// =========================================================
// SERVICES
// =========================================================

/*
** Get all services
** PARAMS:
** - token: token after login
** - timeOption:
** --- slotToSub (time in number to subtract),
** --- slotToAdd (time in number to add)
** --- intervalType: "day", "week", "year", "hour"...
** - pageOption:
** --- nbPerPage: X (number of results returned per pages)
** --- pageNum: Y (number of pages)
** METHOD: POST
*/
exports.getServicesInRange = (token, timeOption, pageOption) => {
  const interval = getIntervalInRange(timeOption);
  const options = {
    url: `${Ogust.API_LINK}searchService`,
    json: true,
    body: {
      token,
      status: '@!=|N',
      type: 'I',
      start_date: `${'@between|'}${interval.intervalBwd}|${interval.intervalFwd}`,
      nbperpage: pageOption.nbPerPage,
      pagenum: pageOption.pageNum,
    },
    resolveWithFullResponse: true,
    time: true,
  };
  return rp.post(options);
};

exports.getServicesByDate = (token, date, pageOption) => {
  const option = {
    url: `${Ogust.API_LINK}searchService`,
    json: true,
    body: {
      token,
      status: '@!=|N',
      type: 'I',
      start_date: `${'@between|'}${date}0000|${date}2359`,
      nbperpage: pageOption.nbPerPage,
      pagenum: pageOption.pageNum,
    },
    resolveWithFullResponse: true,
    time: true,
  };
  return rp.post(option);
};

/*
** Get services by employee id in range
** PARAMS:
** - token: token after login
** - id: employee id
** - timeOption:
** --- slotToSub (time in number to subtract),
** --- slotToAdd (time in number to add)
** --- intervalType: "day", "week", "year", "hour"...
** - pageOption:
** --- nbPerPage: X (number of results returned per pages)
** --- pageNum: Y (number of pages)
** METHOD: POST
*/
exports.getServicesByEmployeeIdInRange = (token, id, timeOption, pageOption) => {
  const interval = getIntervalInRange(timeOption);
  const option = {
    url: `${Ogust.API_LINK}searchService`,
    json: true,
    body: {
      token,
      id_employee: id,
      status: 'R', // Récurrent
      type: 'I',
      start_date: `${'@between|'}${interval.intervalBwd}|${interval.intervalFwd}`,
      nbperpage: pageOption.nbPerPage,
      pagenum: pageOption.pageNum,
    },
    resolveWithFullResponse: true,
    time: true,
  };
  return rp.post(option);
};

/*
** Get services by employee id and date
** PARAMS:
** - token: token after login
** - id: employee id
** - date: start_date in "YYYYMMDD" format
** - pageOption:
** --- nbPerPage: X (number of results returned per pages)
** --- pageNum: Y (number of pages)
** METHOD: POST
*/
exports.getServicesByEmployeeIdAndDate = (token, id, date, pageOption) => {
  const option = {
    url: `${Ogust.API_LINK}searchService`,
    json: true,
    body: {
      token,
      id_employee: id,
      status: '@!=|N',
      type: 'I', // Intervention
      start_date: `${'@between|'}${date}0000|${date}2359`,
      nbperpage: pageOption.nbPerPage,
      pagenum: pageOption.pageNum,
    },
    resolveWithFullResponse: true,
    time: true,
  };
  return rp.post(option);
};

/*
** Get services by customer id
** PARAMS:
** - token: token after login
** - id: customer id
** - timeOption:
** --- slotToSub (time in number to subtract),
** --- slotToAdd (time in number to add)
** --- intervalType: "day", "week", "year", "hour"...
** - pageOption:
** --- nbPerPage: X (number of results returned per pages)
** --- pageNum: Y (number of pages)
** METHOD: POST
*/
exports.getServicesByCustomerIdInRange = (token, id, timeOption, pageOption) => {
  const interval = getIntervalInRange(timeOption);
  const options = {
    url: `${Ogust.API_LINK}searchService`,
    json: true,
    body: {
      token,
      id_customer: id,
      status: '@!=|N',
      type: 'I', // Intervention
      start_date: `${'@between|'}${interval.intervalBwd}|${interval.intervalFwd}`,
      nbperpage: pageOption.nbPerPage,
      pagenum: pageOption.pageNum,
    },
    resolveWithFullResponse: true,
    time: true,
  };
  return rp.post(options);
};
