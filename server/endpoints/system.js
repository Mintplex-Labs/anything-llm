process.env.NODE_ENV === "development"
  ? require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` })
  : require("dotenv").config();
const { viewLocalFiles, normalizePath, isWithin } = require("../utils/files");
const { purgeDocument, purgeFolder } = require("../utils/files/purgeDocument");
const { getVectorDbClass } = require("../utils/helpers");
const { updateENV, dumpENV } = require("../utils/helpers/updateENV");
const {
  reqBody,
  makeJWT,
  userFromSession,
  multiUserMode,
  queryParams,
} = require("../utils/http");
const { handleAssetUpload, handlePfpUpload } = require("../utils/files/multer");
const { v4 } = require("uuid");
const { SystemSettings } = require("../models/systemSettings");
const { User } = require("../models/user");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const fs = require("fs");
const path = require("path");
const {
  getDefaultFilename,
  determineLogoFilepath,
  fetchLogo,
  validFilename,
  renameLogoFile,
  removeCustomLogo,
  LOGO_FILENAME,
  isDefaultFilename,
} = require("../utils/files/logo");
const { Telemetry } = require("../models/telemetry");
const { WelcomeMessages } = require("../models/welcomeMessages");
const { ApiKey } = require("../models/apiKeys");
const { getCustomModels } = require("../utils/helpers/customModels");
const { WorkspaceChats } = require("../models/workspaceChats");
const {
  flexUserRoleValid,
  ROLES,
  isMultiUserSetup,
} = require("../utils/middleware/multiUserProtected");
const { fetchPfp, determinePfpFilepath } = require("../utils/files/pfp");
const { exportChatsAsType } = require("../utils/helpers/chat/convertTo");
const { EventLogs } = require("../models/eventLogs");
const { CollectorApi } = require("../utils/collectorApi");
const {
  recoverAccount,
  resetPassword,
  generateRecoveryCodes,
} = require("../utils/PasswordRecovery");
const { SlashCommandPresets } = require("../models/slashCommandsPresets");
const { EncryptionManager } = require("../utils/EncryptionManager");
const { BrowserExtensionApiKey } = require("../models/browserExtensionApiKey");
const {
  chatHistoryViewable,
} = require("../utils/middleware/chatHistoryViewable");
const { simpleSSOEnabled } = require("../utils/middleware/simpleSSOEnabled");
const { TemporaryAuthToken } = require("../models/temporaryAuthToken");

function systemEndpoints(app) {
  if (!app) return;

  app.get("/ping", (_, response) => {
    response.status(200).json({ online: true });
  });

  app.get("/migrate", async (_, response) => {
    response.sendStatus(200);
  });

  app.get("/env-dump", async (_, response) => {
    if (process.env.NODE_ENV !== "production")
      return response.sendStatus(200).end();
    dumpENV();
    response.sendStatus(200).end();
  });

  app.get("/setup-complete", async (_, response) => {
    try {
      const results = await SystemSettings.currentSettings();
      response.status(200).json({ results });
    } catch (e) {
      console.error(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.get(
    "/system/check-token",
    [validatedRequest],
    async (request, response) => {
      try {
        if (multiUserMode(response)) {
          const user = await userFromSession(request, response);
          if (!user || user.suspended) {
            response.sendStatus(403).end();
            return;
          }

          response.sendStatus(200).end();
          return;
        }

        response.sendStatus(200).end();
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post("/request-token", async (request, response) => {
    try {
      const bcrypt = require("bcrypt");

      if (await SystemSettings.isMultiUserMode()) {
        const { username, password } = reqBody(request);
        const existingUser = await User._get({ username: String(username) });

        if (!existingUser) {
          await EventLogs.logEvent(
            "failed_login_invalid_username",
            {
              ip: request.ip || "Unknown IP",
              username: username || "Unknown user",
            },
            existingUser?.id
          );
          response.status(200).json({
            user: null,
            valid: false,
            token: null,
            message: "[001] Invalid login credentials.",
          });
          return;
        }

        if (!bcrypt.compareSync(String(password), existingUser.password)) {
          await EventLogs.logEvent(
            "failed_login_invalid_password",
            {
              ip: request.ip || "Unknown IP",
              username: username || "Unknown user",
            },
            existingUser?.id
          );
          response.status(200).json({
            user: null,
            valid: false,
            token: null,
            message: "[002] Invalid login credentials.",
          });
          return;
        }

        if (existingUser.suspended) {
          await EventLogs.logEvent(
            "failed_login_account_suspended",
            {
              ip: request.ip || "Unknown IP",
              username: username || "Unknown user",
            },
            existingUser?.id
          );
          response.status(200).json({
            user: null,
            valid: false,
            token: null,
            message: "[004] Account suspended by admin.",
          });
          return;
        }

        await Telemetry.sendTelemetry(
          "login_event",
          { multiUserMode: false },
          existingUser?.id
        );

        await EventLogs.logEvent(
          "login_event",
          {
            ip: request.ip || "Unknown IP",
            username: existingUser.username || "Unknown user",
          },
          existingUser?.id
        );

        // Check if the user has seen the recovery codes
        if (!existingUser.seen_recovery_codes) {
          const plainTextCodes = await generateRecoveryCodes(existingUser.id);

          // Return recovery codes to frontend
          response.status(200).json({
            valid: true,
            user: User.filterFields(existingUser),
            token: makeJWT(
              { id: existingUser.id, username: existingUser.username },
              "30d"
            ),
            message: null,
            recoveryCodes: plainTextCodes,
          });
          return;
        }

        response.status(200).json({
          valid: true,
          user: User.filterFields(existingUser),
          token: makeJWT(
            { id: existingUser.id, username: existingUser.username },
            "30d"
          ),
          message: null,
        });
        return;
      } else {
        const { password } = reqBody(request);
        if (
          !bcrypt.compareSync(
            password,
            bcrypt.hashSync(process.env.AUTH_TOKEN, 10)
          )
        ) {
          await EventLogs.logEvent("failed_login_invalid_password", {
            ip: request.ip || "Unknown IP",
            multiUserMode: false,
          });
          response.status(401).json({
            valid: false,
            token: null,
            message: "[003] Invalid password provided",
          });
          return;
        }

        await Telemetry.sendTelemetry("login_event", { multiUserMode: false });
        await EventLogs.logEvent("login_event", {
          ip: request.ip || "Unknown IP",
          multiUserMode: false,
        });
        response.status(200).json({
          valid: true,
          token: makeJWT(
            { p: new EncryptionManager().encrypt(password) },
            "30d"
          ),
          message: null,
        });
      }
    } catch (e) {
      console.error(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.get(
    "/request-token/sso/simple",
    [simpleSSOEnabled],
    async (request, response) => {
      const { token: tempAuthToken } = request.query;
      const { sessionToken, token, error } =
        await TemporaryAuthToken.validate(tempAuthToken);

      if (error) {
        await EventLogs.logEvent("failed_login_invalid_temporary_auth_token", {
          ip: request.ip || "Unknown IP",
          multiUserMode: true,
        });
        return response.status(401).json({
          valid: false,
          token: null,
          message: `[001] An error occurred while validating the token: ${error}`,
        });
      }

      await Telemetry.sendTelemetry(
        "login_event",
        { multiUserMode: true },
        token.user.id
      );
      await EventLogs.logEvent(
        "login_event",
        {
          ip: request.ip || "Unknown IP",
          username: token.user.username || "Unknown user",
        },
        token.user.id
      );

      response.status(200).json({
        valid: true,
        user: User.filterFields(token.user),
        token: sessionToken,
        message: null,
      });
    }
  );

  app.post(
    "/system/recover-account",
    [isMultiUserSetup],
    async (request, response) => {
      try {
        const { username, recoveryCodes } = reqBody(request);
        const { success, resetToken, error } = await recoverAccount(
          username,
          recoveryCodes
        );

        if (success) {
          response.status(200).json({ success, resetToken });
        } else {
          response.status(400).json({ success, message: error });
        }
      } catch (error) {
        console.error("Error recovering account:", error);
        response
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    }
  );

  app.post(
    "/system/reset-password",
    [isMultiUserSetup],
    async (request, response) => {
      try {
        const { token, newPassword, confirmPassword } = reqBody(request);
        const { success, message, error } = await resetPassword(
          token,
          newPassword,
          confirmPassword
        );

        if (success) {
          response.status(200).json({ success, message });
        } else {
          response.status(400).json({ success, error });
        }
      } catch (error) {
        console.error("Error resetting password:", error);
        response.status(500).json({ success: false, message: error.message });
      }
    }
  );

  app.get(
    "/system/system-vectors",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const query = queryParams(request);
        const VectorDb = getVectorDbClass();
        const vectorCount = !!query.slug
          ? await VectorDb.namespaceCount(query.slug)
          : await VectorDb.totalVectors();
        response.status(200).json({ vectorCount });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/system/remove-document",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const { name } = reqBody(request);
        await purgeDocument(name);
        response.sendStatus(200).end();
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/system/remove-documents",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const { names } = reqBody(request);
        for await (const name of names) await purgeDocument(name);
        response.sendStatus(200).end();
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/system/remove-folder",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const { name } = reqBody(request);
        await purgeFolder(name);
        response.sendStatus(200).end();
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get(
    "/system/local-files",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (_, response) => {
      try {
        const localFiles = await viewLocalFiles();
        response.status(200).json({ localFiles });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get(
    "/system/document-processing-status",
    [validatedRequest],
    async (_, response) => {
      try {
        const online = await new CollectorApi().online();
        response.sendStatus(online ? 200 : 503);
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get(
    "/system/accepted-document-types",
    [validatedRequest],
    async (_, response) => {
      try {
        const types = await new CollectorApi().acceptedFileTypes();
        if (!types) {
          response.sendStatus(404).end();
          return;
        }

        response.status(200).json({ types });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/system/update-env",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const body = reqBody(request);
        const { newValues, error } = await updateENV(
          body,
          false,
          response?.locals?.user?.id
        );
        response.status(200).json({ newValues, error });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/system/update-password",
    [validatedRequest],
    async (request, response) => {
      try {
        // Cannot update password in multi - user mode.
        if (multiUserMode(response)) {
          response.sendStatus(401).end();
          return;
        }

        let error = null;
        const { usePassword, newPassword } = reqBody(request);
        if (!usePassword) {
          // Password is being disabled so directly unset everything to bypass validation.
          process.env.AUTH_TOKEN = "";
          process.env.JWT_SECRET = "";
        } else {
          error = await updateENV(
            {
              AuthToken: newPassword,
              JWTSecret: v4(),
            },
            true
          )?.error;
        }
        response.status(200).json({ success: !error, error });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/system/enable-multi-user",
    [validatedRequest],
    async (request, response) => {
      try {
        if (response.locals.multiUserMode) {
          response.status(200).json({
            success: false,
            error: "Multi-user mode is already enabled.",
          });
          return;
        }

        const { username, password } = reqBody(request);
        const { user, error } = await User.create({
          username,
          password,
          role: ROLES.admin,
        });

        if (error || !user) {
          response.status(400).json({
            success: false,
            error: error || "Failed to enable multi-user mode.",
          });
          return;
        }

        await SystemSettings._updateSettings({
          multi_user_mode: true,
        });
        await BrowserExtensionApiKey.migrateApiKeysToMultiUser(user.id);

        await updateENV(
          {
            JWTSecret: process.env.JWT_SECRET || v4(),
          },
          true
        );
        await Telemetry.sendTelemetry("enabled_multi_user_mode", {
          multiUserMode: true,
        });
        await EventLogs.logEvent("multi_user_mode_enabled", {}, user?.id);
        response.status(200).json({ success: !!user, error });
      } catch (e) {
        await User.delete({});
        await SystemSettings._updateSettings({
          multi_user_mode: false,
        });

        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get("/system/multi-user-mode", async (_, response) => {
    try {
      const multiUserMode = await SystemSettings.isMultiUserMode();
      response.status(200).json({ multiUserMode });
    } catch (e) {
      console.error(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.get("/system/logo", async function (request, response) {
    try {
      const darkMode =
        !request?.query?.theme || request?.query?.theme === "default";
      const defaultFilename = getDefaultFilename(darkMode);
      const logoPath = await determineLogoFilepath(defaultFilename);
      const { found, buffer, size, mime } = fetchLogo(logoPath);

      if (!found) {
        response.sendStatus(204).end();
        return;
      }

      const currentLogoFilename = await SystemSettings.currentLogoFilename();
      response.writeHead(200, {
        "Access-Control-Expose-Headers":
          "Content-Disposition,X-Is-Custom-Logo,Content-Type,Content-Length",
        "Content-Type": mime || "image/png",
        "Content-Disposition": `attachment; filename=${path.basename(
          logoPath
        )}`,
        "Content-Length": size,
        "X-Is-Custom-Logo":
          currentLogoFilename !== null &&
          currentLogoFilename !== defaultFilename &&
          !isDefaultFilename(currentLogoFilename),
      });
      response.end(Buffer.from(buffer, "base64"));
      return;
    } catch (error) {
      console.error("Error processing the logo request:", error);
      response.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/system/footer-data", [validatedRequest], async (_, response) => {
    try {
      const footerData =
        (await SystemSettings.get({ label: "footer_data" }))?.value ??
        JSON.stringify([]);
      response.status(200).json({ footerData: footerData });
    } catch (error) {
      console.error("Error fetching footer data:", error);
      response.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/system/support-email", [validatedRequest], async (_, response) => {
    try {
      const supportEmail =
        (
          await SystemSettings.get({
            label: "support_email",
          })
        )?.value ?? null;
      response.status(200).json({ supportEmail: supportEmail });
    } catch (error) {
      console.error("Error fetching support email:", error);
      response.status(500).json({ message: "Internal server error" });
    }
  });

  // No middleware protection in order to get this on the login page
  app.get("/system/custom-app-name", async (_, response) => {
    try {
      const customAppName =
        (
          await SystemSettings.get({
            label: "custom_app_name",
          })
        )?.value ?? null;
      response.status(200).json({ customAppName: customAppName });
    } catch (error) {
      console.error("Error fetching custom app name:", error);
      response.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(
    "/system/pfp/:id",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async function (request, response) {
      try {
        const { id } = request.params;
        const pfpPath = await determinePfpFilepath(id);

        if (!pfpPath) {
          response.sendStatus(204).end();
          return;
        }

        const { found, buffer, size, mime } = fetchPfp(pfpPath);
        if (!found) {
          response.sendStatus(204).end();
          return;
        }

        response.writeHead(200, {
          "Content-Type": mime || "image/png",
          "Content-Disposition": `attachment; filename=${path.basename(
            pfpPath
          )}`,
          "Content-Length": size,
        });
        response.end(Buffer.from(buffer, "base64"));
        return;
      } catch (error) {
        console.error("Error processing the logo request:", error);
        response.status(500).json({ message: "Internal server error" });
      }
    }
  );

  app.post(
    "/system/upload-pfp",
    [validatedRequest, flexUserRoleValid([ROLES.all]), handlePfpUpload],
    async function (request, response) {
      try {
        const user = await userFromSession(request, response);
        const uploadedFileName = request.randomFileName;
        if (!uploadedFileName) {
          return response.status(400).json({ message: "File upload failed." });
        }

        const userRecord = await User.get({ id: user.id });
        const oldPfpFilename = userRecord.pfpFilename;
        if (oldPfpFilename) {
          const storagePath = path.join(__dirname, "../storage/assets/pfp");
          const oldPfpPath = path.join(
            storagePath,
            normalizePath(userRecord.pfpFilename)
          );
          if (!isWithin(path.resolve(storagePath), path.resolve(oldPfpPath)))
            throw new Error("Invalid path name");
          if (fs.existsSync(oldPfpPath)) fs.unlinkSync(oldPfpPath);
        }

        const { success, error } = await User.update(user.id, {
          pfpFilename: uploadedFileName,
        });

        return response.status(success ? 200 : 500).json({
          message: success
            ? "Profile picture uploaded successfully."
            : error || "Failed to update with new profile picture.",
        });
      } catch (error) {
        console.error("Error processing the profile picture upload:", error);
        response.status(500).json({ message: "Internal server error" });
      }
    }
  );

  app.delete(
    "/system/remove-pfp",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async function (request, response) {
      try {
        const user = await userFromSession(request, response);
        const userRecord = await User.get({ id: user.id });
        const oldPfpFilename = userRecord.pfpFilename;

        if (oldPfpFilename) {
          const storagePath = path.join(__dirname, "../storage/assets/pfp");
          const oldPfpPath = path.join(
            storagePath,
            normalizePath(oldPfpFilename)
          );
          if (!isWithin(path.resolve(storagePath), path.resolve(oldPfpPath)))
            throw new Error("Invalid path name");
          if (fs.existsSync(oldPfpPath)) fs.unlinkSync(oldPfpPath);
        }

        const { success, error } = await User.update(user.id, {
          pfpFilename: null,
        });

        return response.status(success ? 200 : 500).json({
          message: success
            ? "Profile picture removed successfully."
            : error || "Failed to remove profile picture.",
        });
      } catch (error) {
        console.error("Error processing the profile picture removal:", error);
        response.status(500).json({ message: "Internal server error" });
      }
    }
  );

  app.post(
    "/system/upload-logo",
    [
      validatedRequest,
      flexUserRoleValid([ROLES.admin, ROLES.manager]),
      handleAssetUpload,
    ],
    async (request, response) => {
      if (!request?.file || !request?.file.originalname) {
        return response.status(400).json({ message: "No logo file provided." });
      }

      if (!validFilename(request.file.originalname)) {
        return response.status(400).json({
          message: "Invalid file name. Please choose a different file.",
        });
      }

      try {
        const newFilename = await renameLogoFile(request.file.originalname);
        const existingLogoFilename = await SystemSettings.currentLogoFilename();
        await removeCustomLogo(existingLogoFilename);

        const { success, error } = await SystemSettings._updateSettings({
          logo_filename: newFilename,
        });

        return response.status(success ? 200 : 500).json({
          message: success
            ? "Logo uploaded successfully."
            : error || "Failed to update with new logo.",
        });
      } catch (error) {
        console.error("Error processing the logo upload:", error);
        response.status(500).json({ message: "Error uploading the logo." });
      }
    }
  );

  app.get("/system/is-default-logo", async (_, response) => {
    try {
      const currentLogoFilename = await SystemSettings.currentLogoFilename();
      const isDefaultLogo = currentLogoFilename === LOGO_FILENAME;
      response.status(200).json({ isDefaultLogo });
    } catch (error) {
      console.error("Error processing the logo request:", error);
      response.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(
    "/system/remove-logo",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (_request, response) => {
      try {
        const currentLogoFilename = await SystemSettings.currentLogoFilename();
        await removeCustomLogo(currentLogoFilename);
        const { success, error } = await SystemSettings._updateSettings({
          logo_filename: LOGO_FILENAME,
        });

        return response.status(success ? 200 : 500).json({
          message: success
            ? "Logo removed successfully."
            : error || "Failed to update with new logo.",
        });
      } catch (error) {
        console.error("Error processing the logo removal:", error);
        response.status(500).json({ message: "Error removing the logo." });
      }
    }
  );

  app.get(
    "/system/welcome-messages",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async function (_, response) {
      try {
        const welcomeMessages = await WelcomeMessages.getMessages();
        response.status(200).json({ success: true, welcomeMessages });
      } catch (error) {
        console.error("Error fetching welcome messages:", error);
        response
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    }
  );

  app.post(
    "/system/set-welcome-messages",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const { messages = [] } = reqBody(request);
        if (!Array.isArray(messages)) {
          return response.status(400).json({
            success: false,
            message: "Invalid message format. Expected an array of messages.",
          });
        }

        await WelcomeMessages.saveAll(messages);
        return response.status(200).json({
          success: true,
          message: "Welcome messages saved successfully.",
        });
      } catch (error) {
        console.error("Error processing the welcome messages:", error);
        response.status(500).json({
          success: true,
          message: "Error saving the welcome messages.",
        });
      }
    }
  );

  app.get("/system/api-keys", [validatedRequest], async (_, response) => {
    try {
      if (response.locals.multiUserMode) {
        return response.sendStatus(401).end();
      }

      const apiKeys = await ApiKey.where({});
      return response.status(200).json({
        apiKeys,
        error: null,
      });
    } catch (error) {
      console.error(error);
      response.status(500).json({
        apiKey: null,
        error: "Could not find an API Key.",
      });
    }
  });

  app.post(
    "/system/generate-api-key",
    [validatedRequest],
    async (_, response) => {
      try {
        if (response.locals.multiUserMode) {
          return response.sendStatus(401).end();
        }

        const { apiKey, error } = await ApiKey.create();
        await Telemetry.sendTelemetry("api_key_created");
        await EventLogs.logEvent(
          "api_key_created",
          {},
          response?.locals?.user?.id
        );
        return response.status(200).json({
          apiKey,
          error,
        });
      } catch (error) {
        console.error(error);
        response.status(500).json({
          apiKey: null,
          error: "Error generating api key.",
        });
      }
    }
  );

  app.delete("/system/api-key", [validatedRequest], async (_, response) => {
    try {
      if (response.locals.multiUserMode) {
        return response.sendStatus(401).end();
      }

      await ApiKey.delete();
      await EventLogs.logEvent(
        "api_key_deleted",
        { deletedBy: response.locals?.user?.username },
        response?.locals?.user?.id
      );
      return response.status(200).end();
    } catch (error) {
      console.error(error);
      response.status(500).end();
    }
  });

  app.post(
    "/system/custom-models",
    [validatedRequest],
    async (request, response) => {
      try {
        const { provider, apiKey = null, basePath = null } = reqBody(request);
        const { models, error } = await getCustomModels(
          provider,
          apiKey,
          basePath
        );
        return response.status(200).json({
          models,
          error,
        });
      } catch (error) {
        console.error(error);
        response.status(500).end();
      }
    }
  );

  app.post(
    "/system/event-logs",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { offset = 0, limit = 10 } = reqBody(request);
        const logs = await EventLogs.whereWithData({}, limit, offset * limit, {
          id: "desc",
        });
        const totalLogs = await EventLogs.count();
        const hasPages = totalLogs > (offset + 1) * limit;

        response.status(200).json({ logs: logs, hasPages, totalLogs });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/system/event-logs",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (_, response) => {
      try {
        await EventLogs.delete();
        await EventLogs.logEvent(
          "event_logs_cleared",
          {},
          response?.locals?.user?.id
        );
        response.json({ success: true });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/system/workspace-chats",
    [
      chatHistoryViewable,
      validatedRequest,
      flexUserRoleValid([ROLES.admin, ROLES.manager]),
    ],
    async (request, response) => {
      try {
        const { offset = 0, limit = 20 } = reqBody(request);
        const chats = await WorkspaceChats.whereWithData(
          {},
          limit,
          offset * limit,
          { id: "desc" }
        );
        const totalChats = await WorkspaceChats.count();
        const hasPages = totalChats > (offset + 1) * limit;

        response.status(200).json({ chats: chats, hasPages, totalChats });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/system/workspace-chats/:id",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const { id } = request.params;
        Number(id) === -1
          ? await WorkspaceChats.delete({}, true)
          : await WorkspaceChats.delete({ id: Number(id) });
        response.json({ success: true, error: null });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get(
    "/system/export-chats",
    [
      chatHistoryViewable,
      validatedRequest,
      flexUserRoleValid([ROLES.manager, ROLES.admin]),
    ],
    async (request, response) => {
      try {
        const { type = "jsonl", chatType = "workspace" } = request.query;
        const { contentType, data } = await exportChatsAsType(type, chatType);
        await EventLogs.logEvent(
          "exported_chats",
          {
            type,
            chatType,
          },
          response.locals.user?.id
        );
        response.setHeader("Content-Type", contentType);
        response.status(200).send(data);
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  // Used for when a user in multi-user updates their own profile
  // from the UI.
  app.post("/system/user", [validatedRequest], async (request, response) => {
    try {
      const sessionUser = await userFromSession(request, response);
      const { username, password } = reqBody(request);
      const id = Number(sessionUser.id);

      if (!id) {
        response.status(400).json({ success: false, error: "Invalid user ID" });
        return;
      }

      const updates = {};
      if (username) {
        updates.username = User.validations.username(String(username));
      }
      if (password) {
        updates.password = String(password);
      }

      if (Object.keys(updates).length === 0) {
        response
          .status(400)
          .json({ success: false, error: "No updates provided" });
        return;
      }

      const { success, error } = await User.update(id, updates);
      response.status(200).json({ success, error });
    } catch (e) {
      console.error(e);
      response.sendStatus(500).end();
    }
  });

  app.get(
    "/system/slash-command-presets",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const userPresets = await SlashCommandPresets.getUserPresets(user?.id);
        response.status(200).json({ presets: userPresets });
      } catch (error) {
        console.error("Error fetching slash command presets:", error);
        response.status(500).json({ message: "Internal server error" });
      }
    }
  );

  app.post(
    "/system/slash-command-presets",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const { command, prompt, description } = reqBody(request);
        const presetData = {
          command: SlashCommandPresets.formatCommand(String(command)),
          prompt: String(prompt),
          description: String(description),
        };

        const preset = await SlashCommandPresets.create(user?.id, presetData);
        if (!preset) {
          return response
            .status(500)
            .json({ message: "Failed to create preset" });
        }
        response.status(201).json({ preset });
      } catch (error) {
        console.error("Error creating slash command preset:", error);
        response.status(500).json({ message: "Internal server error" });
      }
    }
  );

  app.post(
    "/system/slash-command-presets/:slashCommandId",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const { slashCommandId } = request.params;
        const { command, prompt, description } = reqBody(request);

        // Valid user running owns the preset if user session is valid.
        const ownsPreset = await SlashCommandPresets.get({
          userId: user?.id ?? null,
          id: Number(slashCommandId),
        });
        if (!ownsPreset)
          return response.status(404).json({ message: "Preset not found" });

        const updates = {
          command: SlashCommandPresets.formatCommand(String(command)),
          prompt: String(prompt),
          description: String(description),
        };

        const preset = await SlashCommandPresets.update(
          Number(slashCommandId),
          updates
        );
        if (!preset) return response.sendStatus(422);
        response.status(200).json({ preset: { ...ownsPreset, ...updates } });
      } catch (error) {
        console.error("Error updating slash command preset:", error);
        response.status(500).json({ message: "Internal server error" });
      }
    }
  );

  app.delete(
    "/system/slash-command-presets/:slashCommandId",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (request, response) => {
      try {
        const { slashCommandId } = request.params;
        const user = await userFromSession(request, response);

        // Valid user running owns the preset if user session is valid.
        const ownsPreset = await SlashCommandPresets.get({
          userId: user?.id ?? null,
          id: Number(slashCommandId),
        });
        if (!ownsPreset)
          return response
            .status(403)
            .json({ message: "Failed to delete preset" });

        await SlashCommandPresets.delete(Number(slashCommandId));
        response.sendStatus(204);
      } catch (error) {
        console.error("Error deleting slash command preset:", error);
        response.status(500).json({ message: "Internal server error" });
      }
    }
  );
}

module.exports = { systemEndpoints };
