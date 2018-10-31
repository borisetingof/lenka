const error = (...args) => {
  console.error.apply(null, args); // eslint-disable-line
};

const info = (...args) => {
  console.info.apply(null, args); // eslint-disable-line
};

const debug = (...args) => {
  console.log.apply(null, args); // eslint-disable-line
};

const logHttpEvent = (event) => {
  const eventToLog = {
    path: event.path,
    httpMethod: event.httpMethod,
    origin: (event.headers || {}).Origin,
    queryStringParameters: event.queryStringParameters,
  };

  if (event.body && event.body.constructor === String) {
    const fieldsToHide = ['password'];
    const toReplace = fieldsToHide.map(field => `\\"${field}\\":\\".*?\\"`);
    const regexp = new RegExp(toReplace.join('|'), 'g');

    eventToLog.body = event.body.replace(regexp, matched => matched.replace(/:".*?"$/, ':"****"'));
  }

  info(`Received request: ${JSON.stringify(eventToLog)}`);
};

module.exports = {
  debug,
  error,
  info,
  logHttpEvent,
};
