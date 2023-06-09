process.env.NODE_ENV === "development"
  ? require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` })
  : require("dotenv").config();
const JWT = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

function reqBody(request) {
  return typeof request.body === "string"
    ? JSON.parse(request.body)
    : request.body;
}

function queryParams(request) {
  return request.query;
}

function makeJWT(info = {}, expiry = "30d") {
  if (!SECRET) throw new Error("Cannot create JWT as JWT_SECRET is unset.");
  return JWT.sign(info, SECRET, { expiresIn: expiry });
}

function decodeJWT(jwtToken) {
  try {
    return JWT.verify(jwtToken, SECRET);
  } catch {}
  return null;
}

module.exports = {
  reqBody,
  queryParams,
  makeJWT,
  decodeJWT,
};
