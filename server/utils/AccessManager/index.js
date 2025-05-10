const fs = require("fs");
const path = require("path");
const ZodEmpty = require("zod-empty");
const ACCESS_SCHEMA = require("./schema");

class AccessManager {
  static instance;
  static defaultRoles = {
    admin: "admin",
    manager: "manager",
    default: "default",
  };

  /**
   * @typedef {Object}
   * @property {admin: Object} - The admin system role
   * @property {manager: Object} - The manager system role
   * @property {default: Object} - The default system role
   * @property {[string]: Object} - A custom role
   */
  roles = {};

  constructor() {
    if (AccessManager.instance) return AccessManager.instance;
    AccessManager.instance = this;
    this.defaultAC = ZodEmpty.init(ACCESS_SCHEMA);
  }

  /**
   * Get the folder location of the roles definitions
   * @returns {string} The path to the roles definitions folder
   */
  get rolesFolder() {
    const rolesDefinitionFolder =
      process.env.NODE_ENV === "development"
        ? path.resolve(__dirname, `../../storage/roles`)
        : path.resolve(
            process.env.STORAGE_DIR ?? path.resolve(__dirname, `../../storage`),
            `roles`
          );

    if (!fs.existsSync(rolesDefinitionFolder))
      fs.mkdirSync(rolesDefinitionFolder, { recursive: true });
    return rolesDefinitionFolder;
  }

  log(text, ...args) {
    console.log(`\x1b[32m[AccessManager]\x1b[0m ${text}`, ...args);
  }

  static loadRoles() {
    const acm = new AccessManager();
    acm.loadRoles();
  }

  /**
   * Get the available roles as an array of strings that are the names of the roles available
   * @returns {string[]} The available roles
   */
  static availableRolesAsArray() {
    const acm = new AccessManager();
    return Object.keys(acm.roles);
  }

  loadRoles() {
    const { safeJsonParse } = require("../http");
    this.roles = {
      admin: safeJsonParse(
        fs.readFileSync(path.join(__dirname, "defaults", "admin.json"), {
          encoding: "utf8",
        }),
        {}
      ),
      // manager: safeJsonParse(fs.readFileSync(path.join(__dirname, "defaults", "manager.json"), { encoding: "utf8" }), {}),
      // default: safeJsonParse(fs.readFileSync(path.join(__dirname, "defaults", "default.json"), { encoding: "utf8" }), {}),
    };

    // Custom roles
    for (const definitionFile of fs.readdirSync(this.rolesFolder)) {
      const role = safeJsonParse(
        fs.readFileSync(path.join(this.rolesFolder, definitionFile), "utf8"),
        null
      );
      if (!role) {
        this.log(
          `Skipping custom role ${definitionFile} because it is not a valid JSON file`
        );
        continue;
      }

      if (role.name in AccessManager.defaultRoles) {
        this.log(
          `Skipping custom role ${role.name} because it is attempting to override a default role`
        );
        continue;
      }

      this.roles[role.name] = role;
    }

    this.log(
      `Loaded ${Object.keys(this.roles).length} roles into ACM`,
      Object.keys(this.roles)
    );
  }

  /**
   * Validates the access control rule path that is being evaluated
   *
   * @notice This function will crash the server if the rule path is invalid
   * This is intentional since these permissions are being evaluated at runtime
   * and during development you should know if you have defined an invalid permission
   * path so that you can fix it before committing your changes.
   *
   * @param {string} rulePath - The access control rule path
   * @returns {boolean} - True if the rule path is valid, false otherwise
   */
  isValidRule(rulePath = "") {
    // If we are not in development mode, we will not validate the rule path
    // since permissions cannot be modified at runtime in production
    if (process.env.NODE_ENV !== "development") return true;

    const permPath = rulePath.split(".");
    if (permPath.length === 0)
      return this.log(`Provided rule path dot notation is empty: ${rulePath}`);

    let rolePermission = this.defaultAC.permissions;
    for (const subPerm of permPath) {
      if (rolePermission.hasOwnProperty(subPerm))
        rolePermission = rolePermission[subPerm];
      else break;
    }

    if (
      rolePermission === undefined ||
      !["boolean", "string", "number"].includes(typeof rolePermission)
    )
      throw new Error(`Invalid access control rule path: ${rulePath}`);

    return true;
  }

  parsePermissionFromRole(rolePermissions = {}, rulePath = "") {
    !this.isValidRule(rulePath);

    const permPath = rulePath.split(".");
    if (permPath.length === 0) return false;

    let rolePermission = rolePermissions;
    for (const subPerm of permPath) {
      if (rolePermission.hasOwnProperty(subPerm))
        rolePermission = rolePermission[subPerm];
      else break;
    }

    // Ending the evaluation if the permission should be a boolean, string, or number
    if (
      rolePermission === undefined ||
      !["boolean", "string", "number"].includes(typeof rolePermission)
    )
      return false;

    return rolePermission;
  }

  /**
   * @description Strict access control middleware.
   * @param {string[]} permissionSet - The permissions to check
   * @returns {function} - The middleware function
   */
  static strictAC(permissionSet = []) {
    return async (request, response, next) => {
      const { SystemSettings } = require("../../models/systemSettings");
      const { userFromSession } = require("../http");
      const acm = new AccessManager();

      const multiUserMode =
        response.locals?.multiUserMode ??
        (await SystemSettings.isMultiUserMode());
      if (!multiUserMode) return response.sendStatus(401).end();

      const user =
        response.locals?.user ?? (await userFromSession(request, response));
      if (!user) return response.sendStatus(401).end();

      const userRole = user?.role;
      if (!userRole) return response.sendStatus(401).end();

      const rolePermissions = acm.roles[userRole]?.permissions;
      if (!rolePermissions) return response.sendStatus(401).end();

      const permEvals = {};
      for (const rule of permissionSet) {
        const canDo = acm.parsePermissionFromRole(rolePermissions, rule);
        permEvals[rule] = canDo;
      }

      if (Object.values(permEvals).every((evalResult) => evalResult === true))
        next();
      else {
        console.log(
          `User ${user.username} ${userRole} does not have permission to do the all following: ${permissionSet.join(", ")}`,
          permEvals
        );
        return response.sendStatus(401).end();
      }
    };
  }

  /**
   * @description Flexible access control middleware.
   * This middleware will only check permissions if multi-user mode is enabled.
   * This helper is useful for dual-support of single-user and multi-user endpoints.
   * @param {string[]} permissionSet - The permissions to check
   * @returns {function} - The middleware function
   */
  static flexibleAC(permissionSet = []) {
    return async (request, response, next) => {
      const { SystemSettings } = require("../../models/systemSettings");
      const { userFromSession } = require("../http");
      const acm = new AccessManager();

      // If multi-user mode is not enabled, we will not check permissions
      const multiUserMode =
        response.locals?.multiUserMode ??
        (await SystemSettings.isMultiUserMode());
      if (!multiUserMode) return next();

      // Otherwise, we will check the permissions for the user as if they are in
      // strict mode
      const user =
        response.locals?.user ?? (await userFromSession(request, response));
      if (!user) return response.sendStatus(401).end();

      const userRole = user?.role;
      if (!userRole) return response.sendStatus(401).end();

      const rolePermissions = acm.roles[userRole]?.permissions;
      if (!rolePermissions) return response.sendStatus(401).end();

      const permEvals = {};
      for (const rule of permissionSet) {
        const canDo = acm.parsePermissionFromRole(rolePermissions, rule);
        permEvals[rule] = canDo;
      }

      if (Object.values(permEvals).every((evalResult) => evalResult === true))
        next();
      else {
        console.log(
          `User ${user.username} ${userRole} does not have permission to do the all following: ${permissionSet.join(", ")}`,
          permEvals
        );
        return response.sendStatus(401).end();
      }
    };
  }
}

module.exports = AccessManager;
