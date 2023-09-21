process.env.NODE_ENV === "development"
  ? require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` })
  : require("dotenv").config();
const { validateTablePragmas } = require("../utils/database");
const { viewLocalFiles } = require("../utils/files");
const { exportData, unpackAndOverwriteImport } = require("../utils/files/data");
const {
  checkPythonAppAlive,
  acceptedFileTypes,
} = require("../utils/files/documentProcessor");
const { purgeDocument } = require("../utils/files/purgeDocument");
const { getVectorDbClass } = require("../utils/helpers");
const { updateENV, dumpENV } = require("../utils/helpers/updateENV");
const {
  reqBody,
  makeJWT,
  userFromSession,
  multiUserMode,
} = require("../utils/http");
const { setupDataImports, setupLogoUploads } = require("../utils/files/multer");
const { v4 } = require("uuid");
const { SystemSettings } = require("../models/systemSettings");
const { User } = require("../models/user");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const { handleImports } = setupDataImports();
const { handleLogoUploads } = setupLogoUploads();
const fs = require("fs");
const path = require("path");
const {
  getDefaultFilename,
  determineLogoFilepath,
  fetchLogo,
  validFilename,
  renameLogoFile,
  removeCustomLogo,
  DARK_LOGO_FILENAME,
} = require("../utils/files/logo");
const { Telemetry } = require("../models/telemetry");
const { WelcomeMessages } = require("../models/welcomeMessages");
const { ApiKey } = require("../models/apiKeys");
const { escape } = require("sqlstring-sqlite");

function systemEndpoints(app) {
  if (!app) return;

  app.get("/ping", (_, response) => {
    response.status(200).json({ online: true });
  });

  app.get("/migrate", async (_, response) => {
    await validateTablePragmas(true);
    response.sendStatus(200);
  });

  app.get("/env-dump", async (_, response) => {
    if (process.env.NODE_ENV !== "production")
      return response.sendStatus(200).end();
    await dumpENV();
    response.sendStatus(200).end();
  });

  app.get("/setup-complete", async (_, response) => {
    try {
      const results = await SystemSettings.currentSettings();
      response.status(200).json({ results });
    } catch (e) {
      console.log(e.message, e);
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
        console.log(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post("/request-token", async (request, response) => {
    try {
      if (await SystemSettings.isMultiUserMode()) {
        const { username, password } = reqBody(request);
        const existingUser = await User.get(`username = ${escape(username)}`);

        if (!existingUser) {
          response.status(200).json({
            user: null,
            valid: false,
            token: null,
            message: "[001] Invalid login credentials.",
          });
          return;
        }

        const bcrypt = require("bcrypt");
        if (!bcrypt.compareSync(password, existingUser.password)) {
          response.status(200).json({
            user: null,
            valid: false,
            token: null,
            message: "[002] Invalid login credentials.",
          });
          return;
        }

        if (existingUser.suspended) {
          response.status(200).json({
            user: null,
            valid: false,
            token: null,
            message: "[004] Account suspended by admin.",
          });
          return;
        }

        response.status(200).json({
          valid: true,
          user: existingUser,
          token: makeJWT(
            { id: existingUser.id, username: existingUser.username },
            "30d"
          ),
          message: null,
        });
        return;
      } else {
        const { password } = reqBody(request);
        if (password !== process.env.AUTH_TOKEN) {
          response.status(401).json({
            valid: false,
            token: null,
            message: "[003] Invalid password provided",
          });
          return;
        }

        response.status(200).json({
          valid: true,
          token: makeJWT({ p: password }, "30d"),
          message: null,
        });
      }
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.get("/system/system-vectors", [validatedRequest], async (_, response) => {
    try {
      const VectorDb = getVectorDbClass();
      const vectorCount = await VectorDb.totalVectors();
      response.status(200).json({ vectorCount });
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.delete(
    "/system/remove-document",
    [validatedRequest],
    async (request, response) => {
      try {
        const { name, meta } = reqBody(request);
        await purgeDocument(name, meta);
        response.sendStatus(200).end();
      } catch (e) {
        console.log(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get("/system/local-files", [validatedRequest], async (_, response) => {
    try {
      const localFiles = await viewLocalFiles();
      response.status(200).json({ localFiles });
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.get(
    "/system/document-processing-status",
    [validatedRequest],
    async (_, response) => {
      try {
        const online = await checkPythonAppAlive();
        response.sendStatus(online ? 200 : 503);
      } catch (e) {
        console.log(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get(
    "/system/accepted-document-types",
    [validatedRequest],
    async (_, response) => {
      try {
        const types = await acceptedFileTypes();
        if (!types) {
          response.sendStatus(404).end();
          return;
        }

        response.status(200).json({ types });
      } catch (e) {
        console.log(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/system/update-env",
    [validatedRequest],
    async (request, response) => {
      try {
        const body = reqBody(request);
        const { newValues, error } = updateENV(body);
        if (process.env.NODE_ENV === "production") await dumpENV();
        response.status(200).json({ newValues, error });
      } catch (e) {
        console.log(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/system/update-password",
    [validatedRequest],
    async (request, response) => {
      try {
        const { usePassword, newPassword } = reqBody(request);
        const { error } = updateENV({
          AuthToken: usePassword ? newPassword : "",
          JWTSecret: usePassword ? v4() : "",
        });
        response.status(200).json({ success: !error, error });
      } catch (e) {
        console.log(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/system/enable-multi-user",
    [validatedRequest],
    async (request, response) => {
      try {
        const { username, password } = reqBody(request);
        const multiUserModeEnabled = await SystemSettings.isMultiUserMode();
        if (multiUserModeEnabled) {
          response.status(200).json({
            success: false,
            error: "Multi-user mode is already enabled.",
          });
          return;
        }

        const { user, error } = await User.create({
          username,
          password,
          role: "admin",
        });
        await SystemSettings.updateSettings({
          multi_user_mode: true,
          users_can_delete_workspaces: false,
          limit_user_messages: false,
          message_limit: 25,
        });
        process.env.AUTH_TOKEN = null;
        process.env.JWT_SECRET = process.env.JWT_SECRET ?? v4(); // Make sure JWT_SECRET is set for JWT issuance.
        await Telemetry.sendTelemetry("enabled_multi_user_mode");
        response.status(200).json({ success: !!user, error });
      } catch (e) {
        console.log(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get("/system/data-export", [validatedRequest], async (_, response) => {
    try {
      const { filename, error } = await exportData();
      response.status(200).json({ filename, error });
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.get(
    "/system/data-exports/:filename",
    [validatedRequest],
    (request, response) => {
      const exportLocation = __dirname + "/../storage/exports/";
      const sanitized = path
        .normalize(request.params.filename)
        .replace(/^(\.\.(\/|\\|$))+/, "");
      const finalDestination = path.join(exportLocation, sanitized);

      if (!fs.existsSync(finalDestination)) {
        response.status(404).json({
          error: 404,
          msg: `File ${request.params.filename} does not exist in exports.`,
        });
        return;
      }

      response.download(finalDestination, request.params.filename, (err) => {
        if (err) {
          response.send({
            error: err,
            msg: "Problem downloading the file",
          });
        }
      });
    }
  );

  app.post(
    "/system/data-import",
    handleImports.single("file"),
    async function (request, response) {
      const { originalname } = request.file;
      const { success, error } = await unpackAndOverwriteImport(originalname);
      response.status(200).json({ success, error });
    }
  );

  app.get("/system/logo/:mode?", async function (request, response) {
    try {
      const defaultFilename = getDefaultFilename(request.params.mode);
      const logoPath = await determineLogoFilepath(defaultFilename);
      const { buffer, size, mime } = fetchLogo(logoPath);
      response.writeHead(200, {
        "Content-Type": mime || "image/png",
        "Content-Disposition": `attachment; filename=${path.basename(
          logoPath
        )}`,
        "Content-Length": size,
      });
      response.end(Buffer.from(buffer, "base64"));
      return;
    } catch (error) {
      console.error("Error processing the logo request:", error);
      response.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(
    "/system/upload-logo",
    [validatedRequest],
    handleLogoUploads.single("logo"),
    async (request, response) => {
      if (!request.file || !request.file.originalname) {
        return response.status(400).json({ message: "No logo file provided." });
      }

      if (!validFilename(request.file.originalname)) {
        return response.status(400).json({
          message: "Invalid file name. Please choose a different file.",
        });
      }

      try {
        if (
          response.locals.multiUserMode &&
          response.locals.user?.role !== "admin"
        ) {
          return response.sendStatus(401).end();
        }

        const newFilename = await renameLogoFile(request.file.originalname);
        const existingLogoFilename = await SystemSettings.currentLogoFilename();
        await removeCustomLogo(existingLogoFilename);

        const { success, error } = await SystemSettings.updateSettings({
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

  app.get(
    "/system/remove-logo",
    [validatedRequest],
    async (request, response) => {
      try {
        if (
          response.locals.multiUserMode &&
          response.locals.user?.role !== "admin"
        ) {
          return response.sendStatus(401).end();
        }

        const currentLogoFilename = await SystemSettings.currentLogoFilename();
        await removeCustomLogo(currentLogoFilename);
        const { success, error } = await SystemSettings.updateSettings({
          logo_filename: DARK_LOGO_FILENAME,
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
    "/system/can-delete-workspaces",
    [validatedRequest],
    async function (request, response) {
      try {
        if (!response.locals.multiUserMode) {
          return response.status(200).json({ canDelete: true });
        }

        if (response.locals.user?.role === "admin") {
          return response.status(200).json({ canDelete: true });
        }

        const canDelete = await SystemSettings.canDeleteWorkspaces();
        response.status(200).json({ canDelete });
      } catch (error) {
        console.error("Error fetching can delete workspaces:", error);
        response.status(500).json({
          success: false,
          message: "Internal server error",
          canDelete: false,
        });
      }
    }
  );

  app.get("/system/welcome-messages", async function (request, response) {
    try {
      const welcomeMessages = await WelcomeMessages.getMessages();
      response.status(200).json({ success: true, welcomeMessages });
    } catch (error) {
      console.error("Error fetching welcome messages:", error);
      response
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  });

  app.post(
    "/system/set-welcome-messages",
    [validatedRequest],
    async (request, response) => {
      try {
        if (
          response.locals.multiUserMode &&
          response.locals.user?.role !== "admin"
        ) {
          return response.sendStatus(401).end();
        }

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

  app.get("/system/api-key", [validatedRequest], async (_, response) => {
    try {
      if (response.locals.multiUserMode) {
        return response.sendStatus(401).end();
      }

      const apiKey = await ApiKey.get("id IS NOT NULL");
      return response.status(200).json({
        apiKey,
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

        await ApiKey.delete();
        const { apiKey, error } = await ApiKey.create();
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
      return response.status(200).end();
    } catch (error) {
      console.error(error);
      response.status(500).end();
    }
  });
}

module.exports = { systemEndpoints };
