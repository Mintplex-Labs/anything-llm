const fs = require("fs");
const path = require("path");
const officeExtensionsFolder =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, `../../storage/plugins/office-extensions`)
    : path.resolve(
        process.env.STORAGE_DIR ??
          path.resolve(__dirname, `../../storage/plugins/office-extensions`),
        `office-extensions`
      );

function log(text, ...args) {
  console.log(`\x1b[34m[OfficeExtensionsLoader]\x1b[0m`, text, ...args);
}

/**
 * Builds the endpoints for the office extensions
 * @param {import('express').IRouter} app - The express application router
 */
function officeExtensionEndpoints(app) {
  if (!app) return;
  if (!fs.existsSync(officeExtensionsFolder))
    return log(`No office extensions found ${officeExtensionsFolder}`);

  for (const folder of fs.readdirSync(officeExtensionsFolder)) {
    if (fs.lstatSync(path.resolve(officeExtensionsFolder, folder)).isFile())
      continue;

    const extensionEntryPoint = path.resolve(
      officeExtensionsFolder,
      folder,
      "index.js"
    );
    const hasSupportingFiles = fs.existsSync(
      path.resolve(officeExtensionsFolder, folder, "plugin")
    );
    if (!fs.existsSync(extensionEntryPoint) || !hasSupportingFiles) {
      log(`Skipping office extension - ${folder} - missing files`, {
        missingIndexFile: !fs.existsSync(extensionEntryPoint),
        missingPluginFolder: !hasSupportingFiles,
      });
      continue;
    }

    try {
      log(`Loading office extension - ${folder}`);
      const rootDir = path.resolve(__dirname, "../..");
      const MSOfficeExtension = require(extensionEntryPoint);
      const officeExtension = new MSOfficeExtension({ rootDir });
      officeExtension.buildEndpoints(app);
    } catch (error) {
      log(`Error loading office extension - ${folder}. Aborted`);
      log(error);
    }
  }
}

module.exports = { officeExtensionEndpoints };
