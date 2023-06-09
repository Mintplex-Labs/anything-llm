const { decodeJWT } = require("../http");

function validatedRequest(request, response, next) {
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

module.exports = {
  validatedRequest,
};
