const fs = require("fs");
const path = require("path");

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
    if (!fs.existsSync(extensionEntryPoint)) continue;

    const MSOfficeExtension = require(extensionEntryPoint);
    const officeExtension = new MSOfficeExtension();
    officeExtension.buildEndpoints(app);
  }
}

module.exports = { officeExtensionEndpoints };
