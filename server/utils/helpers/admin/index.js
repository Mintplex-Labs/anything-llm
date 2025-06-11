const { User } = require("../../../models/user");
const AccessManager = require("../../../utils/AccessManager");

/**
 * TODO we need some way for ACM to be aware of the current user's role as well as
 * understanding the "heirarchy" of roles for default to custom roles.
 *
 * For now, we will just check if the current user is an admin or manager and if so,
 * we will allow them to update the role of the user being updated.
 */

// When a user is updating or creating a user in multi-user, we need to check if they
// are allowed to do this and that the new or existing user will be at or below their permission level.
// the user executing this function should be an admin or manager.
function validRoleSelection(currentUser = {}, newUserParams = {}) {
  if (!newUserParams.hasOwnProperty("role"))
    return { valid: true, error: null }; // not updating role, so skip.

  if (currentUser.role === AccessManager.defaultRoles.admin)
    return { valid: true, error: null };
  if (currentUser.role === AccessManager.defaultRoles.manager) {
    const validRoles = [
      AccessManager.defaultRoles.manager,
      AccessManager.defaultRoles.default,
    ];
    if (!validRoles.includes(newUserParams.role))
      return { valid: false, error: "Invalid role selection for user." };
    return { valid: true, error: null };
  }
  return { valid: false, error: "Invalid condition for caller." };
}

// Check to make sure with this update that includes a role change to an existing admin to a non-admin
// that we still have at least one admin left or else they will lock themselves out.
async function canModifyAdmin(userToModify, updates) {
  // if updates don't include role property
  // or the user being modified isn't an admin currently
  // or the updates role is equal to the users current role.
  // skip validation.
  if (!updates.hasOwnProperty("role")) return { valid: true, error: null };
  if (userToModify.role !== AccessManager.defaultRoles.admin)
    return { valid: true, error: null };
  if (updates.role === userToModify.role) return { valid: true, error: null };

  const adminCount = await User.count({
    role: AccessManager.defaultRoles.admin,
  });
  if (adminCount - 1 <= 0)
    return {
      valid: false,
      error: "No system admins will remain if you do this. Update failed.",
    };
  return { valid: true, error: null };
}

function validCanModify(currentUser, existingUser) {
  if (currentUser.role === AccessManager.defaultRoles.admin)
    return { valid: true, error: null };
  if (currentUser.role === AccessManager.defaultRoles.manager) {
    const validRoles = [
      AccessManager.defaultRoles.manager,
      AccessManager.defaultRoles.default,
    ];
    if (!validRoles.includes(existingUser.role))
      return { valid: false, error: "Cannot perform that action on user." };
    return { valid: true, error: null };
  }

  return { valid: false, error: "Invalid condition for caller." };
}

module.exports = {
  validCanModify,
  validRoleSelection,
  canModifyAdmin,
};
