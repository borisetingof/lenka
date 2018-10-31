const { getDynamoClient } = require("../../utils/aws.js");
const {
  hello: { tableName }
} = require("../../config/index");

const putHello = async hello =>
  getDynamoClient()
    .put({
      TableName: tableName,
      Item: hello
    })
    .promise();

module.exports = putHello;
