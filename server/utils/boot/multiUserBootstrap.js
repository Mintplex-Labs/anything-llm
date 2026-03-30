const prisma = require("../prisma");
const { User } = require("../../models/user");
const { Workspace } = require("../../models/workspace");
const { SystemSettings } = require("../../models/systemSettings");
const { ROLES } = require("../middleware/multiUserProtected");
const { azureAdEnvironmentConfigured } = require("../azureAdEnv");
const { generateComplexPassword } = require("../generateComplexPassword");
const { applyMultiUserModeSideEffects } = require("../multiUserEnableHelpers");

const LOG_PREFIX_AZURE = "[AnythingLLM Azure bootstrap]";
const LOG_PREFIX_GENERIC = "[AnythingLLM Bootstrap]";

/**
 * Reads multi_user_mode from DB only (no Azure OR).
 * @returns {Promise<boolean>}
 */
async function isMultiUserModeInDatabase() {
  try {
    const setting = await SystemSettings.get({ label: "multi_user_mode" });
    return setting?.value === "true";
  } catch (e) {
    console.error(e.message);
    return false;
  }
}

/**
 * Ensure at least one workspace exists so first Azure login can be provisioned.
 * @param {string} logPrefix
 * @returns {Promise<void>}
 */
async function ensureWorkspaceExists(logPrefix) {
  const existing = await prisma.workspaces.findFirst({
    orderBy: { id: "asc" },
  });
  if (existing) return;

  const { workspace, message } = await Workspace.new("My Workspace", null);
  if (!workspace) {
    throw new Error(message || "Failed to create default workspace.");
  }
  console.log(
    `${logPrefix} Created default workspace "${workspace.name}" (id=${workspace.id}).`
  );
}

/**
 * When Azure AD env is set and DB multi_user_mode is false: enable multi-user,
 * create or reset admin password, log once to stdout.
 * @returns {Promise<void>}
 */
async function runAzureAdMultiUserBootstrap() {
  if (!azureAdEnvironmentConfigured()) return;
  if (await isMultiUserModeInDatabase()) return;

  try {
    const totalUsers = await User.count({});
    const plainPassword = generateComplexPassword();
    let adminUser;
    let usernameForLog;

    if (totalUsers === 0) {
      const username = process.env.AZURE_BOOTSTRAP_ADMIN_USERNAME || "admin";
      const { user, error } = await User.create({
        username,
        password: plainPassword,
        role: ROLES.admin,
      });
      if (error || !user) {
        console.error(
          `${LOG_PREFIX_AZURE} Failed to create admin user:`,
          error || "unknown"
        );
        return;
      }
      adminUser = await User._get({ id: user.id });
      usernameForLog = user.username;
    } else {
      const admins = await prisma.users.findMany({
        where: { role: ROLES.admin },
        orderBy: { id: "asc" },
        take: 1,
      });
      if (admins.length === 0) {
        const u = process.env.AZURE_BOOTSTRAP_ADMIN_USERNAME || "admin";
        const { user, error } = await User.create({
          username: u,
          password: plainPassword,
          role: ROLES.admin,
        });
        if (error || !user) {
          console.error(
            `${LOG_PREFIX_AZURE} Failed to create admin user:`,
            error || "unknown"
          );
          return;
        }
        adminUser = await User._get({ id: user.id });
        usernameForLog = user.username;
      } else {
        const target = admins[0];
        const { success, error } = await User.update(target.id, {
          password: plainPassword,
        });
        if (!success) {
          console.error(
            `${LOG_PREFIX_AZURE} Failed to reset admin password:`,
            error || "unknown"
          );
          return;
        }
        adminUser = await User._get({ id: target.id });
        usernameForLog = target.username;
      }
    }

    if (!adminUser) return;

    await applyMultiUserModeSideEffects(adminUser.id);
    await ensureWorkspaceExists(LOG_PREFIX_AZURE);

    console.log(LOG_PREFIX_AZURE);
    console.log(`${LOG_PREFIX_AZURE} Multi-user mode enabled.`);
    console.log(`${LOG_PREFIX_AZURE} Admin username: ${usernameForLog}`);
    console.log(`${LOG_PREFIX_AZURE} Admin password: ${plainPassword}`);
    console.log(
      `${LOG_PREFIX_AZURE} Change this password after first login. Anyone with access to container logs can see this.`
    );
  } catch (e) {
    console.error(`${LOG_PREFIX_AZURE} Error:`, e.message, e);
  }
}

/**
 * Generic bootstrap: ANYTHINGLLM_AUTO_BOOTSTRAP_ADMIN + empty DB only.
 * Skipped if Azure bootstrap ran/would apply (mutual exclusion with Azure path).
 * @returns {Promise<void>}
 */
async function runGenericAutoBootstrapAdmin() {
  const flag = process.env.ANYTHINGLLM_AUTO_BOOTSTRAP_ADMIN;
  if (!flag || !["1", "true", "yes"].includes(String(flag).toLowerCase())) {
    return;
  }
  if (azureAdEnvironmentConfigured()) {
    console.log(
      `${LOG_PREFIX_GENERIC} Skipped: Azure AD env is configured (use Azure bootstrap path).`
    );
    return;
  }
  if (await isMultiUserModeInDatabase()) {
    console.log(
      `${LOG_PREFIX_GENERIC} Skipped: multi-user mode already enabled in database.`
    );
    return;
  }
  const totalUsers = await User.count({});
  if (totalUsers > 0) {
    console.log(
      `${LOG_PREFIX_GENERIC} Skipped: users already exist (empty DB required).`
    );
    return;
  }

  try {
    const username =
      process.env.ANYTHINGLLM_BOOTSTRAP_ADMIN_USERNAME || "admin";
    const plainPassword = generateComplexPassword();
    const { user, error } = await User.create({
      username,
      password: plainPassword,
      role: ROLES.admin,
    });
    if (error || !user) {
      console.error(
        `${LOG_PREFIX_GENERIC} Failed to create admin:`,
        error || "unknown"
      );
      return;
    }
    const full = await User._get({ id: user.id });
    if (!full) return;
    await applyMultiUserModeSideEffects(full.id);
    await ensureWorkspaceExists(LOG_PREFIX_GENERIC);

    console.log(LOG_PREFIX_GENERIC);
    console.log(`${LOG_PREFIX_GENERIC} Multi-user mode enabled.`);
    console.log(`${LOG_PREFIX_GENERIC} Admin username: ${user.username}`);
    console.log(`${LOG_PREFIX_GENERIC} Admin password: ${plainPassword}`);
    console.log(
      `${LOG_PREFIX_GENERIC} Change this password after first login. Anyone with access to container logs can see this.`
    );
  } catch (e) {
    console.error(`${LOG_PREFIX_GENERIC} Error:`, e.message, e);
  }
}

/**
 * Run all boot-time multi-user bootstrap hooks (order: Azure path, then generic).
 * @returns {Promise<void>}
 */
async function runMultiUserBootstraps() {
  await runAzureAdMultiUserBootstrap();
  await runGenericAutoBootstrapAdmin();
}

module.exports = {
  runMultiUserBootstraps,
  isMultiUserModeInDatabase,
};
