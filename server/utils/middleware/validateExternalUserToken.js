const { ExternalAuthConfig } = require("../auth/config");
const { syncExternalUser } = require("../auth/syncExternalUser");
const { SystemSettings } = require("../../models/systemSettings");
const { EventLogs } = require("../../models/eventLogs");
const introspectionCache = require("../auth/introspectionCache");

/**
 * RFC 7662: OAuth 2.0 Token Introspection
 * RFC 6750: OAuth 2.0 Bearer Token Usage
 *
 * Validates JWT tokens issued by Keystone Core API via introspection endpoint.
 *
 * Requirements from Message (3):
 * - For user-facing endpoints (non /v1/admin/*), require bearer token
 * - Use Keystone introspection endpoint (/v1/auth/introspect) following RFC 7662
 * - Retrieve: active, sub, role, scope, aud, iss, exp, iat
 * - Reject with 401 if token not active or fails validation
 * - Map external user identity (externalId/externalProvider)
 * - Only default role (non-admin) behavior on user endpoints
 * - Audit logging for user auth events
 * - Cache introspection responses (30s TTL)
 */
async function validateExternalUserToken(req, res, next) {
  // Feature flag: fall back to internal auth if disabled
  if (!ExternalAuthConfig.enabled) {
    return next();
  }

  // Ensure multi-user mode is enabled
  const multiUserMode = await SystemSettings.isMultiUserMode();
  if (!multiUserMode) {
    return res.status(401).json({
      error: "Multi-user mode must be enabled for external authentication",
    });
  }
  res.locals.multiUserMode = multiUserMode;

  // Extract client IP for audit logging (Requirement #9)
  const clientIP = req.ip || req.connection.remoteAddress || "unknown";

  // Requirement #1: Extract Bearer token from Authorization header
  const auth = req.header("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : null;

  if (!token) {
    await logAuthEvent("token_introspection_failed", {
      reason: "missing_token",
      ipAddress: clientIP,
    });
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  // Light structural check
  const decodedPayload = safeDecodePayload(token);
  if (
    !decodedPayload ||
    (typeof decodedPayload.sub !== "string" &&
      typeof decodedPayload.id !== "string") ||
    typeof decodedPayload.exp !== "number"
  ) {
    await logAuthEvent("token_introspection_failed", {
      reason: "invalid_token_structure",
      ipAddress: clientIP,
    });
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  // Quick local exp check
  const now = Math.floor(Date.now() / 1000);
  const exp = decodedPayload.exp;
  const skew = 60; // 60s skew for clock differences
  if (exp + skew < now) {
    await logAuthEvent("token_introspection_failed", {
      reason: "expired_token",
      ipAddress: clientIP,
      userId: decodedPayload.sub || decodedPayload.id,
    });
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  // Requirement #10: Token Introspection with caching (30s TTL)
  let introspection = introspectionCache.get(token);

  if (!introspection) {
    try {
      // Requirement #2: Call Keystone introspection endpoint
      introspection = await callKeystoneIntrospect(token);

      // Only cache active tokens
      if (introspection && introspection.active) {
        introspectionCache.set(
          token,
          introspection,
          ExternalAuthConfig.cacheTTL * 1000
        );
      }
    } catch (error) {
      const cachedResult = introspectionCache.get(token);
      if (cachedResult && cachedResult.active) {
        introspection = cachedResult;
      } else {
        console.error("Token introspection failed:", error.message);
        await logAuthEvent("token_introspection_failed", {
          reason: "introspection_error",
          error: error.message,
          ipAddress: clientIP,
        });
        return res.status(401).json({ error: "Invalid or expired token" });
      }
    }
  }

  // Requirement #3 & #4: Check active field and validate claims
  if (!introspection || !introspection.active) {
    await logAuthEvent("token_introspection_failed", {
      reason: "inactive_token",
      ipAddress: clientIP,
      userId: introspection?.sub,
    });
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  // Requirement #3: Validate required fields from introspection response
  // Must have: active, sub, role, scope, aud, iss, exp, iat
  if (
    !introspection.sub ||
    !introspection.role ||
    !introspection.scope ||
    !introspection.aud ||
    !introspection.iss ||
    typeof introspection.exp !== "number" ||
    typeof introspection.iat !== "number"
  ) {
    await logAuthEvent("token_introspection_failed", {
      reason: "missing_required_claims",
      ipAddress: clientIP,
      userId: introspection?.sub,
    });
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  // Defense in depth: Re-check iss/aud from introspection response
  if (
    introspection.iss !== ExternalAuthConfig.issuer ||
    introspection.aud !== ExternalAuthConfig.audience
  ) {
    await logAuthEvent("token_introspection_failed", {
      reason: "issuer_audience_mismatch",
      ipAddress: clientIP,
      userId: introspection.sub,
    });
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  // Requirement #6: Reject admin tokens - only allow default role users
  // JWTs cannot be used to access /v1/admin/* endpoints
  const userRole = introspection.role?.name || introspection.role;
  const normalizedRole =
    typeof userRole === "string"
      ? userRole.toLowerCase()
      : String(userRole).toLowerCase();

  if (normalizedRole === "admin" || normalizedRole === "manager") {
    await logAuthEvent("token_introspection_failed", {
      reason: "admin_token_rejected",
      ipAddress: clientIP,
      userId: introspection.sub,
      role: userRole,
    });
    return res.status(403).json({
      error:
        "Admin tokens cannot be used for user endpoints. Use API keys for admin operations.",
    });
  }

  // Requirement #5: Map external user identity to local database
  const externalUser = {
    id: introspection.sub, // Requirement #3: sub
    role: introspection.role, // Requirement #3: role
    provider: introspection.provider,
    email: introspection.email ?? null,
    scope: introspection.scope, // Requirement #3: scope
    sid: introspection.sid || introspection.sessionId,
  };

  // Sync user to local database (externalId/externalProvider)
  const localUser = await syncExternalUser(externalUser);

  // Attach to request
  res.locals.user = localUser;
  res.locals.externalUser = externalUser;
  res.locals.scope = externalUser.scope.split(" ").filter(Boolean);

  // Requirement #9: Audit logging for user auth events
  await logAuthEvent("token_introspection_success", {
    userId: localUser.id,
    externalUserId: externalUser.id,
    ipAddress: clientIP,
    role: normalizedRole,
  });

  return next();
}

/**
 * Requirement #2: Call Keystone Core API introspection endpoint (RFC 7662)
 * Supports form-urlencoded as per RFC 7662 standard
 */
async function callKeystoneIntrospect(token) {
  const formData = new URLSearchParams({
    token: token,
    token_type_hint: "access_token",
  });

  const response = await fetch(ExternalAuthConfig.introspectionUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${ExternalAuthConfig.serviceKey}`,
      "X-Client-Service": "anythingllm",
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized: Invalid service API key");
    }
    throw new Error(`Introspection failed: ${response.status}`);
  }

  return await response.json();
}

function safeDecodePayload(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
    const decoded = Buffer.from(normalized + padding, "base64").toString(
      "utf-8"
    );
    return JSON.parse(decoded);
  } catch (error) {
    return null;
  }
}

/**
 * Requirement #9: Audit logging for user auth events
 * No PHI in logs - only user ID, IP, timestamp, event type
 */
async function logAuthEvent(eventType, metadata = {}) {
  try {
    await EventLogs.logEvent(
      eventType,
      {
        ...metadata,
        timestamp: new Date().toISOString(),
        authProvider: "keystone-core-api",
      },
      metadata.userId || null
    );
  } catch (error) {
    console.error("Failed to log auth event:", error);
  }
}

module.exports = { validateExternalUserToken };
