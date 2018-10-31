const Dynamo = require("aws-sdk/clients/dynamodb");

const { AWS_SAM_LOCAL } = process.env;

const getDynamo = () => {
  const config = AWS_SAM_LOCAL
    ? { endpoint: "http://docker.for.mac.host.internal:8000" }
    : {};

  return new Dynamo(config);
};

const getDynamoClient = () => {
  const dynamoInstance = getDynamo();
  
  return new Dynamo.DocumentClient({ service: dynamoInstance });
};

module.exports = {
  getDynamoClient,
  getDynamo
};
