const schema = require("./schema/register.json");
const Lambda = require("../../utils/lambda");
const register = require("../service/register");

const handler = async ({ body: { email, password } }) => {
  const user = await register({ email, password });

  return lambda.success(user);
};

const lambda = new Lambda();
lambda.addHttpHandler(handler, schema);

module.exports = lambda;
