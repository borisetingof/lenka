const schema = require("./schema/login.json");
const Lambda = require("../../utils/lambda");
const login = require("../service/login");

const handler = async ({ body: { email, password } }) => {
  try {
    const token = await login({ email, password });
    return lambda.success(token);
  }
  catch (err) {
    return lambda.accessDenied(err.message)
  }
};

const lambda = new Lambda();
lambda.addHttpHandler(handler, schema);

module.exports = lambda;
