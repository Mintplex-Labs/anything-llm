const { SystemSettings } = require("../../models/systemSettings");
const { User } = require("../../models/user");
const { EncryptionManager } = require("../EncryptionManager");
const { decodeJWT } = require("../http");
const EncryptionMgr = new EncryptionManager();

async function validatedRequest(request, response, next) {
  const multiUserMode = await SystemSettings.isMultiUserMode();
  response.locals.multiUserMode = multiUserMode;
  if (multiUserMode)
    return await validateMultiUserRequest(request, response, next);

  // When in development passthrough auth token for ease of development.
  // Or if the user simply did not set an Auth token or JWT Secret
  if (
    process.env.NODE_ENV === "development" ||
    !process.env.AUTH_TOKEN ||
    !process.env.JWT_SECRET
  ) {
    next();
    return;
  }

  if (!process.env.AUTH_TOKEN) {
    response.status(401).json({
      error: "You need to set an AUTH_TOKEN environment variable.",
    });
    return;
  }

  const auth = request.header("Authorization");
  const token = auth ? auth.split(" ")[1] : null;

  if (!token) {
    response.status(401).json({
      error: "No auth token found.",
    });
    return;
  }

  const bcrypt = require("bcrypt");
  const { p } = decodeJWT(token);

  if (p === null || !/\w{32}:\w{32}/.test(p)) {
    response.status(401).json({
      error: "Token expired or failed validation.",
    });
    return;
  }

  // Since the blame of this comment we have been encrypting the `p` property of JWTs with the persistent
  // encryptionManager PEM's. This prevents us from storing the `p` unencrypted in the JWT itself, which could
  // be unsafe. As a consequence, existing JWTs with invalid `p` values that do not match the regex
  // in ln:44 will be marked invalid so they can be logged out and forced to log back in and obtain an encrypted token.
  // This kind of methodology only applies to single-user password mode.
  
  let decryptedPassword;
  try {
    decryptedPassword = EncryptionMgr.decrypt(p);
  } catch (error) {
    console.error("Failed to decrypt token payload:", error.message);
    console.error("Token payload 'p' value:", p);
    response.status(401).json({
      error: "Token expired or failed validation.",
    });
    return;
  }

  // Validate that we have the required data for bcrypt comparison
  if (!decryptedPassword || !process.env.AUTH_TOKEN) {
    console.error("Invalid credentials for bcrypt comparison:");
    console.error("- decryptedPassword present:", !!decryptedPassword);
    console.error("- AUTH_TOKEN present:", !!process.env.AUTH_TOKEN);
    console.error("- Original 'p' value:", p);
    response.status(401).json({
      error: "Invalid auth credentials.",
    });
    return;
  }

  let isValidCredentials;
  try {
    isValidCredentials = bcrypt.compareSync(
      decryptedPassword,
      bcrypt.hashSync(process.env.AUTH_TOKEN, 10)
    );
  } catch (error) {
    console.error("bcrypt comparison failed:", error.message);
    response.status(401).json({
      error: "Invalid auth credentials.",
    });
    return;
  }

  if (!isValidCredentials) {
    response.status(401).json({
      error: "Invalid auth credentials.",
    });
    return;
  }

  next();
}

async function validateMultiUserRequest(request, response, next) {
  const auth = request.header("Authorization");
  const token = auth ? auth.split(" ")[1] : null;

  if (!token) {
    response.status(401).json({
      error: "No auth token found.",
    });
    return;
  }

  const valid = decodeJWT(token);
  if (!valid || !valid.id) {
    response.status(401).json({
      error: "Invalid auth token.",
    });
    return;
  }

  const user = await User.get({ id: valid.id });
  if (!user) {
    response.status(401).json({
      error: "Invalid auth for user.",
    });
    return;
  }

  if (user.suspended) {
    response.status(401).json({
      error: "User is suspended from system",
    });
    return;
  }

  response.locals.user = user;
  next();
}

module.exports = {
  validatedRequest,
};
