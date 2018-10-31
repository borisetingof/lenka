const { APP_ENV = 'local' } = process.env;

const config = require(`./${APP_ENV}.json`);

module.exports = config;
