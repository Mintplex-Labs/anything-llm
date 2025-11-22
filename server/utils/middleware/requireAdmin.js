const { SystemSettings } = require("../../models/systemSettings");
const { EncryptionManager } = require("../EncryptionManager");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const EncryptionMgr = new EncryptionManager();

/**
 * Middleware to require JWT authentication with admin role
 * IMPORTANT: This middleware ONLY uses internal JWT decoding - it NEVER calls external auth introspection
 * - Multi-user mode: requires role === "admin" in JWT token (from /request-token endpoint)
 * - Single-user mode: requires valid AUTH_TOKEN (anyone with token is admin)
 * - External auth is explicitly bypassed - admin endpoints use only internal JWT validation
 *
 * This middleware decodes JWTs created by /request-token which use JWT_SECRET and contain:
 * Multi-user: { id, username, role }
 * Single-user: { p: encrypted(password) }
 */
async function requireAdmin(request, response, next) {
  // IMPORTANT: This middleware does NOT check or use ExternalAuthConfig
  // It only validates internal JWTs created by /request-token endpoint

  const multiUserMode = await SystemSettings.isMultiUserMode();
  response.locals.multiUserMode = multiUserMode;

  // Get Authorization header
  const authHeader = request.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return response.status(401).json({
      error: "Invalid or expired token",
    });
  }

  // Extract token
  const token = authHeader.split(" ")[1];

  if (!token) {
    return response.status(401).json({
      error: "Invalid or expired token",
    });
  }

  // IMPORTANT: Use internal JWT decoding only - NEVER call external auth introspection
  // Verify JWT using internal JWT_SECRET only (from /request-token endpoint)
  let decoded;
  try {
    // Verify JWT signature using internal JWT_SECRET
    if (!process.env.JWT_SECRET) {
      return response.status(500).json({
        error: "JWT_SECRET not configured",
      });
    }
    decoded = JWT.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    // JWT verification failed - token is invalid, expired, or signed with different secret
    return response.status(401).json({
      error: "Invalid or expired token",
    });
  }

  if (multiUserMode) {
    // Multi-user mode: JWT should contain { id, username, role }
    // These are created by /request-token endpoint in multi-user mode
    if (!decoded || !decoded.id || !decoded.username) {
      return response.status(401).json({
        error: "Invalid or expired token",
      });
    }

    // Check if role exists and is admin
    if (!decoded.role || decoded.role !== "admin") {
      return response.status(403).json({
        error: "Forbidden",
      });
    }

    // Attach decoded payload to request for use in controllers
    request.user = decoded;
  } else {
    // Single-user mode: validate using AUTH_TOKEN (same as validatedRequest does)
    // In development or if no AUTH_TOKEN/JWT_SECRET, allow passthrough
    if (
      process.env.NODE_ENV === "development" ||
      !process.env.AUTH_TOKEN ||
      !process.env.JWT_SECRET
    ) {
      request.user = { id: null, username: null, role: "admin" }; // Default for single-user
      return next();
    }

    if (!decoded || !decoded.p) {
      return response.status(401).json({
        error: "Invalid or expired token",
      });
    }

    // Validate the p property (encrypted password)
    if (!/\w{32}:\w{32}/.test(decoded.p)) {
      return response.status(401).json({
        error: "Invalid or expired token",
      });
    }

    // Verify the encrypted password matches AUTH_TOKEN
    if (
      !bcrypt.compareSync(
        EncryptionMgr.decrypt(decoded.p),
        bcrypt.hashSync(process.env.AUTH_TOKEN, 10)
      )
    ) {
      return response.status(401).json({
        error: "Invalid or expired token",
      });
    }

    // In single-user mode, anyone with valid token is admin
    request.user = { id: null, username: null, role: "admin" };
  }

  next();
}

module.exports = { requireAdmin };
