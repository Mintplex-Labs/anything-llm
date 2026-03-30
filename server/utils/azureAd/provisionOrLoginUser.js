const bcrypt = require("bcryptjs");
const prisma = require("../prisma");
const { User } = require("../../models/user");
const { WorkspaceUser } = require("../../models/workspaceUsers");
const { ROLES } = require("../middleware/multiUserProtected");
const { makeJWT } = require("../http");
const { generateComplexPassword } = require("../generateComplexPassword");
const { getDefaultWorkspaceIdForProvisioning } = require("./defaultWorkspace");

const AUTH_PROVIDER_AZURE = "azure";

/**
 * Derive a valid AnythingLLM username from Azure claims.
 * @param {object} claims
 * @returns {string}
 */
function deriveUsernameFromClaims(claims) {
  const oid = String(claims.oid || claims.sub || "user");
  const email = claims.email || claims.preferred_username || claims.upn || "";
  let candidate = "";
  if (email && email.includes("@")) {
    candidate = String(email).split("@")[0].toLowerCase();
    candidate = candidate.replace(/[^a-z0-9._-]/g, "");
  }
  if (!candidate || candidate.length < 2) {
    candidate = `a${oid.replace(/[^a-z0-9]/gi, "").slice(0, 24) || "zure"}`;
  }
  if (!/^[a-z]/.test(candidate)) {
    candidate = `a${candidate}`;
  }
  if (candidate.length > 32) candidate = candidate.slice(0, 32);
  try {
    return User.validations.username(candidate);
  } catch {
    return User.validations.username(
      `a${oid.replace(/[^a-z0-9]/gi, "").slice(0, 30) || "user"}`
    );
  }
}

/**
 * After verifying Azure ID token claims, find or create local user and return session JWT payload.
 * @param {object} claims
 * @returns {Promise<{ user: object, token: string }>}
 */
async function provisionOrLoginAzureUser(claims) {
  const oid = String(claims.oid || "");
  if (!oid) throw new Error("Token missing oid.");

  const existing = await prisma.users.findFirst({
    where: {
      auth_provider: AUTH_PROVIDER_AZURE,
      external_id: oid,
    },
  });

  if (existing) {
    if (existing.suspended) {
      throw new Error("Account suspended.");
    }
    const token = makeJWT(
      { id: existing.id, username: existing.username },
      process.env.JWT_EXPIRY
    );
    return { user: User.filterFields(existing), token };
  }

  const username = deriveUsernameFromClaims(claims);
  const email =
    (claims.email || claims.preferred_username || claims.upn || null) &&
    String(claims.email || claims.preferred_username || claims.upn);

  const clash = await prisma.users.findFirst({
    where: { username },
  });
  let finalUsername = username;
  if (clash) {
    const suffix = oid.slice(0, 6);
    finalUsername = User.validations.username(
      `${username.slice(0, 20)}_${suffix}`.slice(0, 32)
    );
  }

  const randomPassword = generateComplexPassword();
  const hashed = bcrypt.hashSync(randomPassword, 10);

  const workspaceId = await getDefaultWorkspaceIdForProvisioning();
  if (!workspaceId) {
    throw new Error(
      "No workspace exists yet. Complete onboarding or create a workspace before Azure sign-in."
    );
  }

  const created = await prisma.users.create({
    data: {
      username: finalUsername,
      password: hashed,
      auth_provider: AUTH_PROVIDER_AZURE,
      external_id: oid,
      email: email || null,
      role: ROLES.default,
    },
  });

  await WorkspaceUser.create(created.id, workspaceId);

  const token = makeJWT(
    { id: created.id, username: created.username },
    process.env.JWT_EXPIRY
  );
  return { user: User.filterFields(created), token };
}

module.exports = {
  provisionOrLoginAzureUser,
  AUTH_PROVIDER_AZURE,
};
