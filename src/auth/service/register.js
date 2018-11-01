const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
global.fetch = global.fetch || require("node-fetch");

const {
  auth: { poolData }
} = require("../../config/index");

const register = async ({ email, password }) => {
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  const attributeList = [
    new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: "email",
      Value: email
    })
  ];

  const user = await new Promise((resolve, reject) => {
    userPool.signUp(
      email,
      password,
      attributeList,
      null,
      (err, result) => (err ? reject(err) : resolve(result.user))
    );
  });

  return user;
};

module.exports = register;
