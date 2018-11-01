const HttpResponse = require('./HttpResponse');
const logger = require('./logger');
const validate = require('./validate');

class Lambda {
  constructor() {
    this.logger = logger;
  }

  addHttpHandler(handler, schema = false) {
    this[handler.name] = this.runHttp.bind(this, handler, schema);
  }

  addHandler(handler, schema = false) {
    this[handler.name] = this.run.bind(this, handler, schema);
  }

  async run(handler, schema, event) {
    this.logger.info(`Received request: ${JSON.stringify(event)}`);

    if (schema) {
      try {
        validate(event, schema);
      } catch (e) {
        this.logger.error(`Validation error: ${JSON.stringify(e)}`);
        return true;
      }
    }

    try {
      if (schema && schema.properties.headers.properties.token) {
        console.log('test'); // authenticate({ token });
      }
    } catch (e) {}

    try {
      const result = await handler.bind(this)(event);
      return result;
    } catch (e) {
      this.logger.error(`Error: ${JSON.stringify(e)}`);
      return true;
    }
  }

  async runHttp(handler, schema, event, context) {
    this.logger.logHttpEvent(event);

    if (schema) {
      try {
        validate(event, schema);
      } catch (e) {
        this.logger.info(`Validation error: ${JSON.stringify(e)}`);
        return this.badRequest('Request is not valid').response(context);
      }
    }

    if (event.headers && event.headers['X-Api-Source']) {
      event.source = event.headers['X-Api-Source']; // eslint-disable-line
    }

    let result;
    try {
      result = await handler.bind(this)(event);
    } catch (e) {
      this.logger.error(e);
      result = this.serverError();
    }

    const response = result.response(context);

    this.logger.info(`Result: ${response.statusCode} ${JSON.stringify(response.body)}`);
    return response;
  }

  async fatalError(event, error) {
    this.logger.error(`Fatal error: ${JSON.stringify(error)}`);
    return worker.fatal(event);
  }

  async retriableError(event, error) {
    this.logger.error(`Retriable error: ${JSON.stringify(error)}`);
    return worker.retry(event);
  }

  badRequest(message) {
    return new HttpResponse(400, message);
  }

  accessDenied(message) {
    return new HttpResponse(403, message);
  }

  notFound(message) {
    return new HttpResponse(404, message);
  }

  serverError(message) {
    return new HttpResponse(500, message);
  }

  success(result) {
    return new HttpResponse(200, result);
  }
}

module.exports = Lambda;
