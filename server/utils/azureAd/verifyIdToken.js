const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

/**
 * Verifies an Azure AD v2 ID token (SPA / MSAL).
 * @param {string} idToken
 * @returns {Promise<object>} Decoded JWT payload
 */
function verifyAzureIdToken(idToken) {
  const tenant = process.env.AZURE_AD_TENANT_ID;
  const clientId = process.env.AZURE_AD_CLIENT_ID;
  if (!tenant || !clientId) {
    return Promise.reject(
      new Error("Azure AD is not configured on the server.")
    );
  }
  if (!idToken || typeof idToken !== "string") {
    return Promise.reject(new Error("idToken is required."));
  }

  const jwksUri = `https://login.microsoftonline.com/${tenant}/discovery/v2.0/keys`;
  const client = jwksClient({
    jwksUri,
    cache: true,
    cacheMaxAge: 86_400_000,
  });

  const issuerPrimary = `https://login.microsoftonline.com/${tenant}/v2.0`;

  return new Promise((resolve, reject) => {
    function getKey(header, callback) {
      if (!header || !header.kid) {
        callback(new Error("Token header missing kid."));
        return;
      }
      client.getSigningKey(header.kid, (err, key) => {
        if (err) return callback(err);
        try {
          const signingKey = key.getPublicKey();
          callback(null, signingKey);
        } catch (e) {
          callback(e);
        }
      });
    }

    jwt.verify(
      idToken,
      getKey,
      {
        audience: clientId,
        issuer: issuerPrimary,
        algorithms: ["RS256"],
      },
      (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded);
      }
    );
  });
}

module.exports = { verifyAzureIdToken };
