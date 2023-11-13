const { SystemSettings } = require("../../models/systemSettings");
const { userFromSession } = require("../http");

const ROLES = ["admin", "manager"];

// Explicitly check that multi user mode is enabled as well as that the
// requesting user has the appropriate role to modify or call the URL.
async function strictMultiUserRoleValid(request, response, next) {
  const multiUserMode =
    response.locals?.multiUserMode ?? (await SystemSettings.isMultiUserMode());
  if (!multiUserMode) return response.sendStatus(401).end();

  const user =
    response.locals?.user ?? (await userFromSession(request, response));
  if (!ROLES.includes(user?.role)) return response.sendStatus(401).end();

  next();
}

// Apply role permission checks IF the current system is in multi-user mode.
// This is relevant for routes that are shared between MUM and single-user mode.
// Checks if the requesting user has the appropriate role to modify or call the URL.
async function flexUserRoleValid(request, response, next) {
  const multiUserMode =
    response.locals?.multiUserMode ?? (await SystemSettings.isMultiUserMode());
  if (!multiUserMode) {
    next();
    return;
  }

  const user =
    response.locals?.user ?? (await userFromSession(request, response));
  if (!ROLES.includes(user?.role)) return response.sendStatus(401).end();

  next();
}

module.exports = {
  strictMultiUserRoleValid,
  flexUserRoleValid,
};
