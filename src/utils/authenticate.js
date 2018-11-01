const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');

const {
  auth: {
    poolData: { UserPoolId },
    poolRegion
  }
} = require("../config/index");

const downloadJwks = () =>
  new Promise((resolve, reject) => {
    request(
      {
        url: `https://cognito-idp.${poolRegion}.amazonaws.com/${UserPoolId}/.well-known/jwks.json`,
        json: true
      },
      (err, { statusCode }, body) => {
        !err && statusCode === 200
          ? resolve(body)
          : reject(err || new Error("Unable to download JWKs"));
      }
    );
  });

const verify = ({
  token,
  keys,
  decodedJwt: {
    header: { kid }
  }
}) =>
  new Promise((resolve, reject) => {
    const pems = keys.reduce(
      (memo, { kid, n, e, kty }) => ({
        ...memo,
        ...{
          [kid]: jwkToPem({ kty, n, e })
        }
      }),
      {}
    );

    const pem = pems[kid];
    if (!pem) {
      reject(new Error("Invalid token"));
    }

    jwt.verify(
      token,
      pem,
      (err, payload) => (!err ? resolve(payload) : reject(err))
    );
  });

const authenticate = async ({ token }) => {
  const { keys } = await downloadJwks();
  
  const decodedJwt = jwt.decode(token, { complete: true });
  if (!decodedJwt) {
    throw new Error("Invalid token");
  }

  return await verify({ token, keys, decodedJwt });
};

module.exports = authenticate;
