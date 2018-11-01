const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
global.fetch = global.fetch || require("node-fetch");

const {
  auth: { poolData }
} = require("../../config/index");

const login = async ({ email, password }) => {
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  const authenticationData = {
    Username: email,
    Password: password
  };
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    authenticationData
  );
  const userData = {
    Username: email,
    Pool: userPool
  };
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  const token = await new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: result =>
        resolve({
          accessToken: result.getAccessToken().getJwtToken(),
          idToken: result.idToken.jwtToken
        }),
      onFailure: err => reject(err)
    });
  });

  return token;
};

module.exports = login;
