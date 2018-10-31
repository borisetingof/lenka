const schema = require("./schema/putHello.json");
const Lambda = require("../../utils/lambda");
const putHello = require("../service/putHello");

const handler = async ({ body: { id, name, surname } }) => {
  await putHello({
    id,
    name,
    surname
  });

  return lambda.success();
};

const lambda = new Lambda();
lambda.addHttpHandler(handler, schema);

module.exports = lambda;
