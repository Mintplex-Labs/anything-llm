const { SystemSettings } = require("../../models/systemSettings");
const { userFromSession } = require("../http");
const ROLES = {
  all: "<all>",
  admin: "admin",
  manager: "manager",
  default: "default",
};
const DEFAULT_ROLES = [ROLES.admin, ROLES.admin];

// Explicitly check that multi user mode is enabled as well as that the
// requesting user has the appropriate role to modify or call the URL.
function strictMultiUserRoleValid(allowedRoles = DEFAULT_ROLES) {
  return async (request, response, next) => {
    // If the access-control is allowable for all - skip validations and continue;
    if (allowedRoles.includes(ROLES.all)) {
      next();
      return;
    }

    const multiUserMode =
      response.locals?.multiUserMode ??
      (await SystemSettings.isMultiUserMode());
    if (!multiUserMode) return response.sendStatus(401).end();

    const user =
      response.locals?.user ?? (await userFromSession(request, response));
    if (allowedRoles.includes(user?.role)) {
      next();
      return;
    }
    return response.sendStatus(401).end();
  };
}

// Apply role permission checks IF the current system is in multi-user mode.
// This is relevant for routes that are shared between MUM and single-user mode.
// Checks if the requesting user has the appropriate role to modify or call the URL.
function flexUserRoleValid(allowedRoles = DEFAULT_ROLES) {
  return async (request, response, next) => {
    // If the access-control is allowable for all - skip validations and continue;
    // It does not matter if multi-user or not.
    if (allowedRoles.includes(ROLES.all)) {
      next();
      return;
    }

    // Bypass if not in multi-user mode
    const multiUserMode =
      response.locals?.multiUserMode ??
      (await SystemSettings.isMultiUserMode());
    if (!multiUserMode) {
      next();
      return;
    }

    const user =
      response.locals?.user ?? (await userFromSession(request, response));
    if (allowedRoles.includes(user?.role)) {
      next();
      return;
    }
    return response.sendStatus(401).end();
  };
}

module.exports = {
  ROLES,
  strictMultiUserRoleValid,
  flexUserRoleValid,
};
