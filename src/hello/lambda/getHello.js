const schema = require("./schema/getHello.json");
const Lambda = require("../../utils/lambda");
const getHello = require("../service/getHello");

const handler = async ({ pathParameters: { id } }) => {
  const hello = await getHello({ id });

  return lambda.success(hello);
};

const lambda = new Lambda();
lambda.addHttpHandler(handler, schema);

module.exports = lambda;
