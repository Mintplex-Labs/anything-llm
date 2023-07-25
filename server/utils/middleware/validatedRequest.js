const { SystemSettings } = require("../../models/systemSettings");
const { User } = require("../../models/user");
const { decodeJWT } = require("../http");

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
    response.status(403).json({
      error: "You need to set an AUTH_TOKEN environment variable.",
    });
    return;
  }

  const auth = request.header("Authorization");
  const token = auth ? auth.split(" ")[1] : null;

  if (!token) {
    response.status(403).json({
      error: "No auth token found.",
    });
    return;
  }

  const { p } = decodeJWT(token);
  if (p !== process.env.AUTH_TOKEN) {
    response.status(403).json({
      error: "Invalid auth token found.",
    });
    return;
  }

  next();
}

async function validateMultiUserRequest(request, response, next) {
  const auth = request.header("Authorization");
  const token = auth ? auth.split(" ")[1] : null;

  if (!token) {
    response.status(403).json({
      error: "No auth token found.",
    });
    return;
  }

  const valid = decodeJWT(token);
  if (!valid || !valid.id) {
    response.status(403).json({
      error: "Invalid auth token.",
    });
    return;
  }

  const user = await User.get(`id = ${valid.id}`);
  if (!user) {
    response.status(403).json({
      error: "Invalid auth for user.",
    });
    return;
  }

  response.locals.user = user;
  next();
}

module.exports = {
  validatedRequest,
};
