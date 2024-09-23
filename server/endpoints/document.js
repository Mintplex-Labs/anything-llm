const { Document } = require("../models/documents");
const { normalizePath, documentsPath } = require("../utils/files");
const { reqBody } = require("../utils/http");
const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const prisma = require("../utils/prisma");
const fs = require("fs");
const path = require("path");

function documentEndpoints(app) {
  if (!app) return;

  app.post(
    "/document/create-folder",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const { name, metadata } = reqBody(request);

        // Validate that all required metadata fields are present and are strings
        const requiredFields = [
          "numExp",
          "ano",
          "cliente",
          "juzgadoPrincipal",
          "fechaAlta",
          "estadoDeExpediente",
        ];

        for (const field of requiredFields) {
          if (
            //TODO: remove eslint rule
            // eslint-disable-next-line no-prototype-builtins
            !metadata.hasOwnProperty(field) ||
            typeof metadata[field] !== "string" ||
            metadata[field].trim() === ""
          ) {
            return response.status(400).json({
              success: false,
              message: `Field '${field}' is required and must be a non-empty string.`,
            });
          }
        }

        // Check if folder already exists
        const existingFolder = await prisma.folder.findUnique({
          where: { name },
        });
        if (existingFolder) {
          return response.status(400).json({
            success: false,
            message: "Folder by that name already exists",
          });
        }

        // Create new folder entry in the database
        await prisma.folder.create({
          data: {
            name,
            ...metadata,
          },
        });

        // Optionally, create a physical folder in the filesystem
        // const storagePath = path.join(documentsPath, normalizePath(name));
        // fs.mkdirSync(storagePath, { recursive: true });

        response.status(200).json({ success: true, message: null });
      } catch (e) {
        console.error(e);
        response.status(500).json({
          success: false,
          message: `Failed to create folder: ${e.message}`,
        });
      }
    }
  );

  app.put(
    "/document/update-folder-metadata/:folderName",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const { folderName } = request.params;
        const metadataBody = reqBody(request);

        // Validate provided metadata fields
        const validFields = [
          "numExp",
          "ano",
          "cliente",
          "juzgadoPrincipal",
          "fechaAlta",
          "estadoDeExpediente",
        ];

        const dataToUpdate = {};

        for (const field of validFields) {
          //TODO: remove eslint rule
          // eslint-disable-next-line no-prototype-builtins
          if (metadataBody.hasOwnProperty(field)) {
            if (
              typeof metadataBody[field] !== "string" ||
              metadataBody[field].trim() === ""
            ) {
              return response.status(400).json({
                success: false,
                message: `Field '${field}' must be a non-empty string.`,
              });
            }
            dataToUpdate[field] = metadataBody[field];
          }
        }

        if (Object.keys(dataToUpdate).length === 0) {
          return response.status(400).json({
            success: false,
            message: "No valid metadata fields provided for update.",
          });
        }

        // Check if folder exists
        const existingFolder = await prisma.folder.findUnique({
          where: { name: folderName },
        });
        if (!existingFolder) {
          return response.status(404).json({
            success: false,
            message: "Folder not found",
          });
        }

        // Update folder metadata in the database
        await prisma.folder.update({
          where: { name: folderName },
          data: dataToUpdate,
        });

        // Optionally perform filesystem operations
        // if (CREATE_PHYSICAL_FOLDER) {
        //   // If necessary, perform any filesystem updates here
        //   // For example, if you allow renaming the folder
        // }

        response.status(200).json({
          success: true,
          message: "Folder metadata updated successfully",
        });
      } catch (e) {
        console.error(e);
        response.status(500).json({
          success: false,
          message: `Failed to update folder metadata: ${e.message}`,
        });
      }
    }
  );

  app.post(
    "/document/move-files",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const { files } = reqBody(request);
        const docpaths = files.map(({ from }) => from);
        const documents = await Document.where({ docpath: { in: docpaths } });

        const embeddedFiles = documents.map((doc) => doc.docpath);
        const moveableFiles = files.filter(
          ({ from }) => !embeddedFiles.includes(from)
        );

        const movePromises = moveableFiles.map(({ from, to }) => {
          const sourcePath = path.join(documentsPath, normalizePath(from));
          const destinationPath = path.join(documentsPath, normalizePath(to));

          return new Promise((resolve, reject) => {
            fs.rename(sourcePath, destinationPath, (err) => {
              if (err) {
                console.error(`Error moving file ${from} to ${to}:`, err);
                reject(err);
              } else {
                resolve();
              }
            });
          });
        });

        Promise.all(movePromises)
          .then(() => {
            const unmovableCount = files.length - moveableFiles.length;
            if (unmovableCount > 0) {
              response.status(200).json({
                success: true,
                message: `${unmovableCount}/${files.length} files not moved. Unembed them from all workspaces.`,
              });
            } else {
              response.status(200).json({
                success: true,
                message: null,
              });
            }
          })
          .catch((err) => {
            console.error("Error moving files:", err);
            response
              .status(500)
              .json({ success: false, message: "Failed to move some files." });
          });
      } catch (e) {
        console.error(e);
        response
          .status(500)
          .json({ success: false, message: "Failed to move files." });
      }
    }
  );
}

module.exports = { documentEndpoints };
