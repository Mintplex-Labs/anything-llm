const { User } = require("../../models/user");
const prisma = require("../../utils/prisma");

/**
 * Sync external user from Keystone Core API to AnythingLLM database
 * Maps external user identity (externalId/externalProvider) to local user records
 *
 * IMPORTANT: All external users are mapped to "default" role (non-admin)
 * Admin tokens are rejected in validateExternalUserToken middleware
 */
async function syncExternalUser(externalUser, existingUser = null) {
  const {
    id: externalId,
    email,
    role, // { id, name } object from Keystone Core API (e.g., {id: 2, name: "User"})
    provider,
  } = externalUser;

  // Generate username from email if not provided
  const username = email
    ? email
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9_\-.]/g, "")
    : `user_${externalId}`;

  // Look up existing user by externalId
  let user = existingUser;
  if (!user) {
    user = await prisma.users.findFirst({
      where: {
        externalId: String(externalId),
        externalProvider: "keystone-core-api",
      },
    });
  }

  if (user) {
    // Update existing user (always keep as "default" role)
    await User.update(user.id, {
      role: "default", // Always default role for external users
    });
    return user;
  }

  // Create new user using prisma directly (since User.create requires password)
  // External users don't have passwords - they authenticate via Keystone
  try {
    const bcrypt = require("bcrypt");
    // Create a placeholder password hash (external users won't use it)
    const placeholderPassword = bcrypt.hashSync("external-auth-only", 10);

    const newUser = await prisma.users.create({
      data: {
        username: username,
        password: placeholderPassword, // Placeholder - not used for external auth
        role: "default", // Always default role for external users
        dailyMessageLimit: null,
        bio: "",
        externalId: String(externalId),
        externalProvider: "keystone-core-api",
      },
    });

    return User.filterFields(newUser);
  } catch (error) {
    console.error("Failed to create external user:", error.message);
    throw new Error(`Failed to create user: ${error.message}`);
  }
}

/**
 * Map Keystone Core API roles to AnythingLLM roles
 *
 * IMPORTANT: External users are ALWAYS mapped to "default" role
 * Admin tokens are rejected in validateExternalUserToken middleware before this point
 *
 * This function handles role name normalization (e.g., "User" vs "user")
 */
function mapExternalRoleToAnythingLLMRole(externalRole) {
  // Normalize role name to lowercase for comparison
  const roleName = externalRole?.name || externalRole;
  const normalizedRole =
    typeof roleName === "string"
      ? roleName.toLowerCase()
      : String(roleName).toLowerCase();

  // Always return "default" - admin tokens are rejected before this point
  // This mapping is here for future extensibility if needed
  const roleMap = {
    admin: "default", // Admin tokens should be rejected, but if they get here, map to default
    user: "default",
    manager: "default",
  };

  return roleMap[normalizedRole] || "default";
}

module.exports = { syncExternalUser, mapExternalRoleToAnythingLLMRole };
