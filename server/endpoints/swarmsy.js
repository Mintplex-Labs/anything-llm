const { userFromSession } = require("../utils/http");
const {
  findUserSwarmsyHiveWorkspace,
  getSwarmsyOnboardingStatus,
} = require("../utils/swarmsy/onboardingStatus");
const {
  createSwarmsyHiveWorkspace,
} = require("../utils/swarmsy/applyWorkspacePreset");
const {
  ingestSwarmsyRequiredDocs,
} = require("../utils/swarmsy/ingestRequiredDocs");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");

const swarmsyHiveCreationLocks = new Map();

function swarmsyHiveWorkspaceSummary(workspace = null) {
  if (!workspace) return null;
  return {
    exists: true,
    id: workspace.id,
    slug: workspace.slug,
    name: workspace.name,
  };
}

function swarmsyCreateHiveFailure(message) {
  return {
    success: false,
    created: false,
    workspace: null,
    message,
  };
}

function swarmsyCreateHiveSuccess(workspace, created = false) {
  return {
    success: true,
    created,
    workspace: swarmsyHiveWorkspaceSummary(workspace),
    nextAction: {
      type: "check_onboarding_status",
      label: "Continue setup",
      message: created
        ? "SWARMSY HIVE was created. Next, check doctrine readiness before starting intake."
        : "Your SWARMSY HIVE already exists. Check onboarding status before starting intake.",
    },
  };
}

function swarmsyMissingHiveForDocsIngestion() {
  return {
    success: false,
    workspace: {
      exists: false,
    },
    message: "No SWARMSY HIVE workspace exists for this user yet.",
    nextAction: {
      type: "create_hive",
      label: "Create SWARMSY HIVE",
    },
  };
}

function swarmsyDocsIngestionNextAction() {
  return {
    type: "check_onboarding_status",
    label: "Check HIVE readiness",
    message:
      "Doctrine docs were processed. Check onboarding status before starting intake.",
  };
}

async function withSwarmsyHiveCreationLock(lockKey, action) {
  while (swarmsyHiveCreationLocks.has(lockKey)) {
    await swarmsyHiveCreationLocks.get(lockKey);
  }

  let releaseLock = null;
  const currentLock = new Promise((resolve) => {
    releaseLock = resolve;
  });
  swarmsyHiveCreationLocks.set(lockKey, currentLock);

  try {
    return await action();
  } finally {
    swarmsyHiveCreationLocks.delete(lockKey);
    if (typeof releaseLock === "function") releaseLock();
  }
}

async function swarmsyOnboardingStatus(request, response) {
  try {
    const user = await userFromSession(request, response);
    const status = await getSwarmsyOnboardingStatus({ user });
    return response.status(200).json(status);
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      success: false,
      message: "Failed to resolve SWARMSY onboarding status.",
    });
  }
}

async function swarmsyOnboardingCreateHive(request, response) {
  try {
    const user = await userFromSession(request, response);
    const creatorId =
      user?.id && Number.isInteger(Number(user.id)) && Number(user.id) > 0
        ? Number(user.id)
        : null;
    const workspaceOwner = creatorId ? user : null;
    const lockKey = creatorId ? String(creatorId) : "global";

    return await withSwarmsyHiveCreationLock(lockKey, async () => {
      const existingWorkspace =
        await findUserSwarmsyHiveWorkspace(workspaceOwner);
      if (existingWorkspace) {
        return response
          .status(200)
          .json(swarmsyCreateHiveSuccess(existingWorkspace, false));
      }

      const { workspace, message } =
        await createSwarmsyHiveWorkspace(creatorId);
      if (!workspace) {
        return response
          .status(400)
          .json(
            swarmsyCreateHiveFailure(
              message || "Failed to create SWARMSY HIVE workspace."
            )
          );
      }

      const refreshedWorkspace =
        await findUserSwarmsyHiveWorkspace(workspaceOwner);
      return response
        .status(200)
        .json(swarmsyCreateHiveSuccess(refreshedWorkspace || workspace, true));
    });
  } catch (error) {
    console.error(error);
    return response
      .status(500)
      .json(
        swarmsyCreateHiveFailure("Failed to create SWARMSY HIVE workspace.")
      );
  }
}

async function swarmsyOnboardingIngestRequiredDocs(request, response) {
  try {
    const user = await userFromSession(request, response);
    const workspace = await findUserSwarmsyHiveWorkspace(user);
    if (!workspace) {
      return response.status(404).json(swarmsyMissingHiveForDocsIngestion());
    }

    const result = await ingestSwarmsyRequiredDocs({
      workspace,
      userId: user?.id ? Number(user.id) : response.locals?.user?.id ?? null,
    });

    if (result.errorCode === "COLLECTOR_OFFLINE") {
      return response.status(503).json(result);
    }

    return response.status(200).json({
      ...result,
      nextAction: swarmsyDocsIngestionNextAction(),
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      success: false,
      message: "Failed to ingest SWARMSY required docs.",
    });
  }
}

function __resetSwarmsyHiveCreationLocksForTests() {
  swarmsyHiveCreationLocks.clear();
}

function swarmsyEndpoints(app) {
  if (!app) return;

  app.get(
    "/swarmsy/onboarding/status",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    swarmsyOnboardingStatus
  );

  app.post(
    "/swarmsy/onboarding/create-hive",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    swarmsyOnboardingCreateHive
  );

  app.post(
    "/swarmsy/onboarding/ingest-required-docs",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    swarmsyOnboardingIngestRequiredDocs
  );
}

module.exports = {
  __resetSwarmsyHiveCreationLocksForTests,
  swarmsyEndpoints,
  swarmsyOnboardingCreateHive,
  swarmsyOnboardingIngestRequiredDocs,
  swarmsyOnboardingStatus,
};
