function validatedRequest(request, response, next) {
  // When in development passthrough auth token for ease of development.
  if (process.env.NODE_ENV === 'development' || !process.env.AUTH_TOKEN) {
    next();
    return;
  }

  if (!process.env.AUTH_TOKEN) {
    response.status(403).json({
      error: "You need to set an AUTH_TOKEN environment variable."
    });
    return;
  }

  const auth = request.header('Authorization');
  const token = auth ? auth.split(' ')[1] : null;

  if (!token) {
    response.status(403).json({
      error: "No auth token found."
    });
    return;
  }

  if (token !== process.env.AUTH_TOKEN) {
    response.status(403).json({
      error: "Invalid auth token found."
    });
    return;
  }

  next();
}

module.exports = {
  validatedRequest,
};