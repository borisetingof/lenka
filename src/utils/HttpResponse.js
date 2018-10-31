class LambdaResponse {
  constructor(statusCode, body) {
    this.statusCode = statusCode;
    this.body = body;
  }

  static get responses() {
    return {
      200: {
        result: 'success',
      },
      400: {
        errorType: 'Bad Request',
        message: 'Bad Request Exception',
      },
      403: {
        errorType: 'Access Denied',
        message: 'Access Denied Exception',
      },
      404: {
        errorType: 'Not Found',
        message: 'Not Found Exception',
      },
      500: {
        errorType: 'Internal Server Error',
        message: 'Internal Server Error Exception',
      },
    };
  }

  static get headers() {
    return {
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
    };
  }

  response(context) {
    const resp = LambdaResponse.responses[this.statusCode];
    if (!resp) {
      return null;
    }

    let body;
    if (resp.errorType) {
      body = {
        errorType: this.errorType,
        message: this.body || this.response.message,
        requestId: context.awsRequestId || '',
        result: 'error',
      };
    } else {
      body = { ...resp, ...this.body };
    }

    return {
      statusCode: this.statusCode,
      headers: LambdaResponse.headers,
      body: JSON.stringify(body),
    };
  }
}

module.exports = LambdaResponse;
