const fs = require("fs");
const path = require("path");

/**
 * Builds the endpoints for the office extensions
 * @param {import('express').IRouter} app - The express application router
 */
function officeExtensionEndpoints(app) {
  if (!app) return;

  // const officeExtensionsFolder = process.env.NODE_ENV === "development"
  //   ? path.resolve(__dirname, "../../storage/plugins/office-extensions")
  //   : path.resolve(__dirname, "../../office-extensions");
  const officeExtensionsFolder = path.resolve(__dirname, "../../storage/plugins/office-extensions");
  if (!fs.existsSync(officeExtensionsFolder)) {
    console.log(`No office extensions found ${officeExtensionsFolder}`);
    return;
  }

  for (const folder of fs.readdirSync(officeExtensionsFolder)) {
    const extensionEntryPoint = path.resolve(officeExtensionsFolder, folder, 'index.js');
    const hasSupportingFiles = fs.existsSync(path.resolve(officeExtensionsFolder, folder, 'plugin'));
    if (!fs.existsSync(extensionEntryPoint) || !hasSupportingFiles) {
      console.log(`Skipping office extension - ${folder} - missing files`, {
        missingIndexFile: !fs.existsSync(extensionEntryPoint),
        missingPluginFolder: !hasSupportingFiles,
      });
      continue;
    }

    try {
      console.log(`Loading office extension - ${folder}`);
      const rootDir = path.resolve(__dirname, '../..');
      const MSOfficeExtension = require(extensionEntryPoint);
      const officeExtension = new MSOfficeExtension({ rootDir });
      officeExtension.buildEndpoints(app);
    } catch (error) {
      console.error(`Error loading office extension - ${folder}. Aborted`);
      console.error(error);
    }
  }
}

module.exports = { officeExtensionEndpoints };
