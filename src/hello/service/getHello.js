const { getDynamoClient } = require("../../utils/aws.js");
const {
  hello: { tableName }
} = require("../../config/index");

const getHello = async ({id}) => {
  const {
    Items: [hello],
  } = await getDynamoClient()
    .query({
      TableName: tableName,
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': id,
      },
    })
    .promise();

  return hello;
};

module.exports = getHello;