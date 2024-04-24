class AIbitatError extends Error {}

class APIError extends AIbitatError {
  constructor(message) {
    super(message);
  }
}

/**
 * The error when the AI provider returns an error that should be treated as something
 * that should be retried.
 */
class RetryError extends APIError {}

module.exports = {
  APIError,
  RetryError,
};
