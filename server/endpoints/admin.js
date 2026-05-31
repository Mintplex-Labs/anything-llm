const fs = require("fs");
const path = require("path");
const { ApiKey } = require("../models/apiKeys");
const { BrowserExtensionApiKey } = require("../models/browserExtensionApiKey");
const { Document } = require("../models/documents");
const { EventLogs } = require("../models/eventLogs");
const { Invite } = require("../models/invite");
const { SystemSettings } = require("../models/systemSettings");
const { User } = require("../models/user");
const { DocumentVectors } = require("../models/vectors");
const { Workspace } = require("../models/workspace");
const { WorkspaceChats } = require("../models/workspaceChats");
const {
  WorkspaceSuggestedMessages,
} = require("../models/workspacesSuggestedMessages");
const {
  createSwarmsyHiveWorkspace,
  PRESET_NAME,
} = require("../utils/swarmsy/applyWorkspacePreset");
const {
  getSwarmsyRequiredDocsStatus,
} = require("../utils/swarmsy/requiredDocs");
const { CollectorApi } = require("../utils/collectorApi");
const { purgeSourceDocument, purgeVectorCache } = require("../utils/files");
const {
  getVectorDbClass,
  getEmbeddingEngineSelection,
} = require("../utils/helpers");
const {
  validRoleSelection,
  canModifyAdmin,
  validCanModify,
} = require("../utils/helpers/admin");
const { reqBody, userFromSession, safeJsonParse } = require("../utils/http");
const {
  strictMultiUserRoleValid,
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const ImportedPlugin = require("../utils/agents/imported");
const {
  simpleSSOLoginDisabledMiddleware,
} = require("../utils/middleware/simpleSSOEnabled");
const {
  workspaceDeletionProtection,
} = require("../utils/middleware/workspaceDeletionProtection");

const swarmsyHiveCreationLocks = new Map();

async function findSwarmsyHiveWorkspace(creatorId = null) {
  return Workspace.get(
    creatorId
      ? {
          name: PRESET_NAME,
          workspace_users: { some: { user_id: Number(creatorId) } },
        }
      : { name: PRESET_NAME }
  );
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

function getRequestedWorkspaceTarget(payload = {}) {
  const workspaceSlug =
    typeof payload.workspaceSlug === "string"
      ? payload.workspaceSlug.trim()
      : "";
  const hasWorkspaceSlug = workspaceSlug.length > 0;
  const hasWorkspaceId =
    payload.workspaceId !== undefined &&
    payload.workspaceId !== null &&
    String(payload.workspaceId).trim() !== "";

  if (hasWorkspaceId) {
    const workspaceId = Number(payload.workspaceId);
    if (!Number.isInteger(workspaceId) || workspaceId <= 0) {
      return { valid: false, workspaceId: null, workspaceSlug: null };
    }

    return {
      valid: true,
      workspaceId,
      workspaceSlug: null,
      targetDescription: `workspaceId=${workspaceId}`,
    };
  }

  if (hasWorkspaceSlug) {
    return {
      valid: true,
      workspaceId: null,
      workspaceSlug,
      targetDescription: `workspaceSlug=${workspaceSlug}`,
    };
  }

  return {
    valid: true,
    workspaceId: null,
    workspaceSlug: null,
    targetDescription: "creator SWARMSY HIVE workspace",
  };
}

async function resolveSwarmsyHiveWorkspaceTarget(target, creatorId = null) {
  if (target.workspaceId) return Workspace.get({ id: target.workspaceId });
  if (target.workspaceSlug)
    return Workspace.get({ slug: target.workspaceSlug });
  return findSwarmsyHiveWorkspace(creatorId);
}

function getRequiredLoadableDocs(status = {}) {
  const loadablePaths = [];
  const unavailablePaths = [];

  for (const group of status.groups || []) {
    if (!group.required) continue;
    for (const file of group.files || []) {
      if (file.loadable) {
        loadablePaths.push(file.path);
      } else {
        unavailablePaths.push({
          path: file.path,
          reason: "not_loadable",
          error: file.error || "Document is not loadable.",
        });
      }
    }
  }

  return { loadablePaths, unavailablePaths };
}

function adminEndpoints(app) {
  if (!app) return;

  app.get(
    "/admin/users",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin, ROLES.manager])],
    async (_request, response) => {
      try {
        const users = await User.where();
        response.status(200).json({ users });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/admin/users/new",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const currUser = await userFromSession(request, response);
        const newUserParams = reqBody(request);
        const roleValidation = validRoleSelection(currUser, newUserParams);

        if (!roleValidation.valid) {
          response
            .status(200)
            .json({ user: null, error: roleValidation.error });
          return;
        }

        const { user: newUser, error } = await User.create(newUserParams);
        if (!!newUser) {
          await EventLogs.logEvent(
            "user_created",
            {
              userName: newUser.username,
              createdBy: currUser.username,
            },
            currUser.id
          );
        }

        response.status(200).json({ user: newUser, error });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/admin/user/:id",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const currUser = await userFromSession(request, response);
        const { id } = request.params;
        const updates = reqBody(request);
        const user = await User.get({ id: Number(id) });

        const canModify = validCanModify(currUser, user);
        if (!canModify.valid) {
          response.status(200).json({ success: false, error: canModify.error });
          return;
        }

        const roleValidation = validRoleSelection(currUser, updates);
        if (!roleValidation.valid) {
          response
            .status(200)
            .json({ success: false, error: roleValidation.error });
          return;
        }

        const validAdminRoleModification = await canModifyAdmin(user, updates);
        if (!validAdminRoleModification.valid) {
          response
            .status(200)
            .json({ success: false, error: validAdminRoleModification.error });
          return;
        }

        const { success, error } = await User.update(id, updates);
        response.status(200).json({ success, error });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/admin/user/:id",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const currUser = await userFromSession(request, response);
        const { id } = request.params;
        const user = await User.get({ id: Number(id) });

        const canModify = validCanModify(currUser, user);
        if (!canModify.valid) {
          response.status(200).json({ success: false, error: canModify.error });
          return;
        }

        await BrowserExtensionApiKey.deleteAllForUser(Number(id));
        await User.delete({ id: Number(id) });
        await EventLogs.logEvent(
          "user_deleted",
          {
            userName: user.username,
            deletedBy: currUser.username,
          },
          currUser.id
        );
        response.status(200).json({ success: true, error: null });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get(
    "/admin/invites",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin, ROLES.manager])],
    async (_request, response) => {
      try {
        const invites = await Invite.whereWithUsers();
        response.status(200).json({ invites });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/admin/invite/new",
    [
      validatedRequest,
      strictMultiUserRoleValid([ROLES.admin, ROLES.manager]),
      simpleSSOLoginDisabledMiddleware,
    ],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const body = reqBody(request);
        const { invite, error } = await Invite.create({
          createdByUserId: user.id,
          workspaceIds: body?.workspaceIds || [],
        });

        await EventLogs.logEvent(
          "invite_created",
          {
            inviteCode: invite.code,
            createdBy: response.locals?.user?.username,
          },
          response.locals?.user?.id
        );
        response.status(200).json({ invite, error });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/admin/invite/:id",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const { id } = request.params;
        const { success, error } = await Invite.deactivate(id);
        await EventLogs.logEvent(
          "invite_deleted",
          { deletedBy: response.locals?.user?.username },
          response.locals?.user?.id
        );
        response.status(200).json({ success, error });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get(
    "/admin/workspaces",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin, ROLES.manager])],
    async (_request, response) => {
      try {
        const workspaces = await Workspace.whereWithUsers();
        response.status(200).json({ workspaces });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get(
    "/admin/workspaces/:workspaceId/users",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const { workspaceId } = request.params;
        const users = await Workspace.workspaceUsers(workspaceId);
        response.status(200).json({ users });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/admin/workspaces/new",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const { name } = reqBody(request);
        const { workspace, message: error } = await Workspace.new(
          name,
          user.id
        );
        response.status(200).json({ workspace, error });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/admin/workspaces/:workspaceId/update-users",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const { workspaceId } = request.params;
        const { userIds } = reqBody(request);
        const { success, error } = await Workspace.updateUsers(
          workspaceId,
          userIds
        );
        response.status(200).json({ success, error });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/admin/workspaces/:id",
    [
      validatedRequest,
      strictMultiUserRoleValid([ROLES.admin, ROLES.manager]),
      workspaceDeletionProtection,
    ],
    async (request, response) => {
      try {
        const { id } = request.params;
        const VectorDb = getVectorDbClass();
        const workspace = await Workspace.get({ id: Number(id) });
        if (!workspace) {
          response.sendStatus(404).end();
          return;
        }

        await WorkspaceChats.delete({ workspaceId: Number(workspace.id) });
        await DocumentVectors.deleteForWorkspace(Number(workspace.id));
        await Document.delete({ workspaceId: Number(workspace.id) });
        await Workspace.delete({ id: Number(workspace.id) });
        try {
          await VectorDb["delete-namespace"]({ namespace: workspace.slug });
        } catch (e) {
          console.error(e.message);
        }

        response.status(200).json({ success: true, error: null });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  // System preferences but only by array of labels
  app.get(
    "/admin/system-preferences-for",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const requestedSettings = {};
        const labels = request.query.labels?.split(",") || [];
        const needEmbedder = [
          "text_splitter_chunk_size",
          "max_embed_chunk_size",
        ];
        const noRecord = [
          "max_embed_chunk_size",
          "agent_sql_connections",
          "imported_agent_skills",
          "feature_flags",
          "meta_page_title",
          "meta_page_favicon",
        ];

        // Managers can only read a limited set of settings.
        // These match the ManagerRoute pages in the frontend.
        const managerAllowedFields = [
          "custom_app_name",
          "footer_data",
          "support_email",
          "meta_page_title",
          "meta_page_favicon",
        ];

        for (const label of labels) {
          // Skip any settings that are not explicitly defined as public
          if (!SystemSettings.publicFields.includes(label)) continue;

          // Managers can only read manager-allowed fields
          if (
            user?.role === ROLES.manager &&
            !managerAllowedFields.includes(label)
          )
            continue;

          // Only get the embedder if the setting actually needs it
          let embedder = needEmbedder.includes(label)
            ? getEmbeddingEngineSelection()
            : null;
          // Only get the record from db if the setting actually needs it
          let setting = noRecord.includes(label)
            ? null
            : await SystemSettings.get({ label });

          switch (label) {
            case "footer_data":
              requestedSettings[label] = setting?.value ?? JSON.stringify([]);
              break;
            case "support_email":
              requestedSettings[label] = setting?.value || null;
              break;
            case "text_splitter_chunk_size":
              requestedSettings[label] =
                setting?.value || embedder?.embeddingMaxChunkLength || null;
              break;
            case "text_splitter_chunk_overlap":
              requestedSettings[label] = setting?.value || null;
              break;
            case "max_embed_chunk_size":
              requestedSettings[label] =
                embedder?.embeddingMaxChunkLength || 1000;
              break;
            case "agent_search_provider":
              requestedSettings[label] = setting?.value || null;
              break;
            case "agent_sql_connections":
              requestedSettings[label] =
                await SystemSettings.agent_sql_connections();
              break;
            case "default_agent_skills":
              requestedSettings[label] = safeJsonParse(setting?.value, []);
              break;
            case "disabled_agent_skills":
              requestedSettings[label] = safeJsonParse(setting?.value, []);
              break;
            case "disabled_filesystem_skills":
              requestedSettings[label] = safeJsonParse(setting?.value, []);
              break;
            case "disabled_create_files_skills":
              requestedSettings[label] = safeJsonParse(setting?.value, []);
              break;
            case "disabled_gmail_skills":
              requestedSettings[label] = safeJsonParse(setting?.value, []);
              break;
            case "disabled_outlook_skills":
              requestedSettings[label] = safeJsonParse(setting?.value, []);
              break;
            case "imported_agent_skills":
              requestedSettings[label] = ImportedPlugin.listImportedPlugins();
              break;
            case "custom_app_name":
              requestedSettings[label] = setting?.value || null;
              break;
            case "feature_flags":
              requestedSettings[label] =
                (await SystemSettings.getFeatureFlags()) || {};
              break;
            case "meta_page_title":
              requestedSettings[label] =
                await SystemSettings.getValueOrFallback({ label }, null);
              break;
            case "meta_page_favicon":
              requestedSettings[label] =
                await SystemSettings.getValueOrFallback({ label }, null);
              break;
            case "memory_enabled":
              requestedSettings[label] = setting?.value || "false";
              break;
            case "memory_auto_extraction":
              requestedSettings[label] = setting?.value ?? "true";
              break;
            default:
              break;
          }
        }

        response.status(200).json({ settings: requestedSettings });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/admin/system-preferences",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        let updates = reqBody(request);

        // Managers can only update a limited set of settings.
        // These match the ManagerRoute pages in the frontend.
        // Admin users can update all supportedFields without restriction.
        if (user?.role === ROLES.manager) {
          const managerAllowedFields = [
            "custom_app_name",
            "footer_data",
            "support_email",
            "meta_page_title",
            "meta_page_favicon",
          ];
          const filteredUpdates = {};
          for (const key of Object.keys(updates)) {
            if (managerAllowedFields.includes(key)) {
              filteredUpdates[key] = updates[key];
            }
          }
          updates = filteredUpdates;
        }

        await SystemSettings.updateSettings(updates);
        response.status(200).json({ success: true, error: null });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/admin/swarmsy/workspace-preset/hive",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const creatorId = user?.id ?? null;
        const creatorLockKey = creatorId ? String(creatorId) : "global";
        // Route-local idempotency guard until a DB-level unique preset marker exists.
        return await withSwarmsyHiveCreationLock(creatorLockKey, async () => {
          const existingWorkspace = await findSwarmsyHiveWorkspace(creatorId);
          if (existingWorkspace) {
            const suggestedMessages =
              await WorkspaceSuggestedMessages.getMessages(
                existingWorkspace.slug
              );
            return response.status(200).json({
              success: true,
              workspace: existingWorkspace,
              message:
                "SWARMSY HIVE workspace already exists for this creator.",
              preset: PRESET_NAME,
              suggestedMessages,
            });
          }

          const { workspace, message } =
            await createSwarmsyHiveWorkspace(creatorId);
          if (!workspace) {
            return response.status(400).json({
              success: false,
              workspace: null,
              message: message || "Failed to create SWARMSY HIVE workspace.",
              preset: PRESET_NAME,
            });
          }

          const suggestedMessages =
            await WorkspaceSuggestedMessages.getMessages(workspace.slug);
          return response.status(200).json({
            success: true,
            workspace,
            message:
              suggestedMessages.length > 0
                ? null
                : "Workspace created, but no suggested messages were returned.",
            preset: PRESET_NAME,
            suggestedMessages,
          });
        });
      } catch (error) {
        console.error(error);
        return response.status(500).json({
          success: false,
          workspace: null,
          message: "Failed to create SWARMSY HIVE workspace preset.",
          preset: PRESET_NAME,
        });
      }
    }
  );

  app.get(
    "/admin/swarmsy/required-docs/status",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (_request, response) => {
      try {
        const status = getSwarmsyRequiredDocsStatus();
        return response.status(200).json(status);
      } catch (error) {
        console.error(error);
        return response.status(500).json({
          success: false,
          message: "Failed to resolve SWARMSY required docs status.",
        });
      }
    }
  );

  app.post(
    "/admin/swarmsy/workspace-preset/hive/ingest-required-docs",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const target = getRequestedWorkspaceTarget(reqBody(request));
        if (!target.valid) {
          return response.status(400).json({
            success: false,
            message:
              "Invalid workspace target. Provide a valid workspaceId or workspaceSlug.",
          });
        }

        const creatorId = user?.id ? Number(user.id) : null;
        const workspace = await resolveSwarmsyHiveWorkspaceTarget(
          target,
          creatorId
        );
        if (!workspace) {
          return response.status(404).json({
            success: false,
            message: `Target workspace not found for ${target.targetDescription}.`,
          });
        }

        if (workspace.name !== PRESET_NAME) {
          return response.status(400).json({
            success: false,
            message:
              "Target workspace is not the SWARMSY HIVE preset workspace.",
          });
        }

        const collector = new CollectorApi();
        const collectorOnline = await collector.online();
        if (!collectorOnline) {
          return response.status(503).json({
            success: false,
            errorCode: "COLLECTOR_OFFLINE",
            message: "Document processing API is not online.",
          });
        }

        const status = getSwarmsyRequiredDocsStatus();
        const { loadablePaths, unavailablePaths } =
          getRequiredLoadableDocs(status);
        const workspaceSummary = {
          id: workspace.id,
          name: workspace.name,
          slug: workspace.slug,
        };

        if (loadablePaths.length === 0) {
          return response.status(200).json({
            success: true,
            workspace: workspaceSummary,
            ingested: [],
            skipped: unavailablePaths,
            failed: [],
            partial: false,
            message:
              "No SWARMSY required docs are currently available to ingest.",
          });
        }

        const existingChunkSources = new Set();
        for (const existingDoc of workspace.documents || []) {
          const metadata = safeJsonParse(existingDoc.metadata, null);
          if (metadata?.chunkSource)
            existingChunkSources.add(metadata.chunkSource);
        }

        const ingested = [];
        const skipped = [...unavailablePaths];
        const failed = [];
        const docsRoot = path.resolve(status.docsRoot);

        for (const docPath of loadablePaths) {
          const chunkSource = `swarmsy-required://${docPath}`;
          if (existingChunkSources.has(chunkSource)) {
            skipped.push({
              path: docPath,
              reason: "already_attached",
              error: null,
            });
            continue;
          }

          const absoluteDocPath = path.resolve(docsRoot, docPath);
          let content = "";

          try {
            content = fs.readFileSync(absoluteDocPath, "utf8");
          } catch (error) {
            failed.push({
              path: docPath,
              stage: "read",
              error: `Failed to read doctrine file: ${error.message}`,
            });
            continue;
          }

          const {
            success,
            reason,
            documents = [],
          } = await collector.processRawText(content, {
            title: path.basename(docPath),
            docSource: "SWARMSY required doctrine docs",
            description: docPath,
            chunkSource,
          });

          if (!success || documents.length === 0 || !documents[0]?.location) {
            failed.push({
              path: docPath,
              stage: "collect",
              error:
                reason ||
                "Collector did not return an ingestible document location.",
            });
            continue;
          }

          const generatedDocLocation = documents[0].location;
          const {
            failedToEmbed = [],
            errors = [],
            embedded = [],
          } = await Document.addDocuments(
            workspace,
            [generatedDocLocation],
            response.locals?.user?.id
          );

          if (failedToEmbed.length > 0 || embedded.length === 0) {
            failed.push({
              path: docPath,
              stage: "embed",
              error:
                errors[0] ||
                "Document.addDocuments failed for this doctrine document.",
            });
          } else {
            ingested.push({
              path: docPath,
            });
            existingChunkSources.add(chunkSource);
          }

          try {
            await purgeSourceDocument(generatedDocLocation);
          } catch (error) {
            failed.push({
              path: docPath,
              stage: "cleanup",
              error: `Failed to purge source document: ${error.message}`,
            });
          }

          try {
            await purgeVectorCache(generatedDocLocation);
          } catch (error) {
            failed.push({
              path: docPath,
              stage: "cleanup",
              error: `Failed to purge vector cache: ${error.message}`,
            });
          }
        }

        const alreadyAttachedCount = skipped.filter(
          (item) => item.reason === "already_attached"
        ).length;
        const availableCount = loadablePaths.length;
        const partial = failed.length > 0;

        let message = "SWARMSY required docs ingested successfully.";
        if (ingested.length === 0 && availableCount === alreadyAttachedCount) {
          message =
            "All loadable SWARMSY required docs are already attached to this workspace.";
        } else if (ingested.length === 0 && failed.length === 0) {
          message =
            "No SWARMSY required docs are currently available to ingest.";
        } else if (partial) {
          message =
            "SWARMSY required docs ingestion completed with partial failures.";
        }

        return response.status(200).json({
          success: true,
          workspace: workspaceSummary,
          ingested,
          skipped,
          failed,
          partial,
          message,
        });
      } catch (error) {
        console.error(error);
        return response.status(500).json({
          success: false,
          message: "Failed to ingest SWARMSY required docs.",
        });
      }
    }
  );

  app.get(
    "/admin/api-keys",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin])],
    async (_request, response) => {
      try {
        const apiKeys = await ApiKey.whereWithUser({});
        return response.status(200).json({
          apiKeys,
          error: null,
        });
      } catch (error) {
        console.error(error);
        response.status(500).json({
          apiKey: null,
          error: "Could not find an API Keys.",
        });
      }
    }
  );

  app.post(
    "/admin/generate-api-key",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const { name = null } = reqBody(request);
        const { apiKey, error } = await ApiKey.create(user.id, name);
        await EventLogs.logEvent(
          "api_key_created",
          { createdBy: user?.username, name: apiKey?.name },
          user?.id
        );
        return response.status(200).json({
          apiKey,
          error,
        });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/admin/delete-api-key/:id",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { id } = request.params;
        if (!id || isNaN(Number(id))) return response.sendStatus(400).end();
        await ApiKey.delete({ id: Number(id) });

        await EventLogs.logEvent(
          "api_key_deleted",
          { deletedBy: response.locals?.user?.username },
          response?.locals?.user?.id
        );
        return response.status(200).end();
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );
}

module.exports = { adminEndpoints };
