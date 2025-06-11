import { ACCESS_SCHEMA } from "../../server/utils/AccessManager/schema.js";
import { ValidateObjectsAgainstSchemas } from "../../server/node_modules/object-deep-compare/dist/index.js";
import fs from "fs";
import path from "path";

const __dirname = path.resolve();
const ROLES_DIR = path.join(__dirname, "../../server/utils/AccessManager/defaults");

// Deep-check every value in the permissions object to ensure it is true
function allPermissionsTrue(permissions = {}) {
  for (const key in permissions) {
    const value = permissions[key];

    // If the value is an object, recursively check its contents
    if (typeof value === 'object' && value !== null) {
      if (!allPermissionsTrue(value)) return false;
    }
    // If the value is not a boolean true, return false
    else if (value !== true) {
      return false;
    }
  }
  return true;
}

function permissionIsTrue(rolePermissions = {}, rulePath = "") {
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
  ) return false;

  return rolePermission === true;
}

const defaultRoleDefinitions = [];
for (const file of fs.readdirSync(ROLES_DIR)) {
  const roleDefinition = JSON.parse(fs.readFileSync(path.join(ROLES_DIR, file), "utf8"));
  defaultRoleDefinitions.push(roleDefinition);
}

const LegacyRoleMap = {
  // Every permission in here means every role type should have this permission
  'all': [
    "workspaceThread.create",
    "workspaceChats.playTTS",
    "workspace.chat",
    "users.pfp.read",
    "users.pfp.update",
    "users.pfp.delete",
    "welcomeMessages.read",
    "slashCommands.read",
    "slashCommands.create",
    "slashCommands.update",
    "slashCommands.delete",
    "systemPromptVariables.read",
    "workspaceThread.read",
    "workspaceThread.delete",
    "workspaceChats.read",
    "workspaceThread.update",
    "workspaceChats.delete",
    "workspaceChats.update",
    "workspace.read",
    "workspaceSuggestedMessages.read",
    "promptHistory.read"
  ],
  // any endpoint that previously had [Roles.manager] should be in this array + have all items in Roles.all
  'manager': [
    "users.read",
    "users.create",
    "users.update",
    "users.delete",
    "invite.read",
    "invite.create",
    "invite.delete",
    "workspace.read",
    "workspaceUsers.read",
    "workspace.create",
    "workspaceUsers.update",
    "workspace.delete",
    "systemSettings.read",
    "systemSettings.update",
    "browserExtensionKey.read",
    "browserExtensionKey.create",
    "browserExtensionKey.delete",
    "documents.createFolder",
    "documents.moveFiles",
    "documentSync.update",
    "collector.useExtension",
    "system.countVectors",
    "documents.remove",
    "documents.read",
    "system.branding.update",
    "system.branding.delete",
    "welcomeMessages.update",
    "workspaceChats.read",
    "workspaceChats.delete",
    "workspaceChats.export",
    "workspace.update",
    "documents.upload",
    "workspace.embed",
    "workspace.resetVectorDb",
    "workspaceSuggestedMessages.update",
    "workspace.documentPinStatus",
    "workspace.readAny"
  ],
  // Every available permission should be true in the admin role
  // 'admin': [],
}

for (const role of defaultRoleDefinitions) {
  console.log(`-> Validating schema for role: ${role.name}`);
  try {
    // First validate against schema
    ValidateObjectsAgainstSchemas(role, {}, {
      firstObjectSchema: ACCESS_SCHEMA,
      throwOnValidationFailure: true,
    });

    // Then check for extra properties
    function checkForExtraProps(obj, schema, currentPath = '') {
      for (const key in obj) {
        const newPath = currentPath ? `${currentPath}.${key}` : key;
        if (!schema.hasOwnProperty(key)) throw new Error(`Extra property found: ${newPath}`);
        if (typeof obj[key] === 'object') checkForExtraProps(obj[key], schema[key], newPath);
      }
    }

    checkForExtraProps(role, ACCESS_SCHEMA);
    console.log(`✅ Standard role '${role.name}' conforms to the standard role schema!`);

  } catch (error) {
    console.log(`❌ Standard role '${role.name}' does not conform to the standard role schema!`);
    throw error;
  }
}

for (const role of defaultRoleDefinitions) {
  console.log(`-> Validating legacy permissions for role: ${role.name}`);
  if (role.name === 'admin' && !allPermissionsTrue(role.permissions)) throw new Error(`❌ Admin role has permissions that are not all true!`);

  if (role.name === 'manager') {
    const allRequiredPermissions = new Set([...LegacyRoleMap.all, ...LegacyRoleMap.manager]);
    for (const perm of allRequiredPermissions) {
      if (!permissionIsTrue(role.permissions, perm)) throw new Error(`❌ Manager role is missing permission: ${perm}`);
    }
  }

  if (role.name === 'default') {
    const allRequiredPermissions = new Set([...LegacyRoleMap.all]);
    for (const perm of allRequiredPermissions) {
      if (!permissionIsTrue(role.permissions, perm)) throw new Error(`❌ Default role is missing permission: ${perm}`);
    }
  }
}