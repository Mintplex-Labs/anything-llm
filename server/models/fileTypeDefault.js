const { SystemSettings } = require("./systemSettings");

const FileTypeDefault = {
  featureKey: "experimental_file_type_default",

  /** Check if the fileTypeDefault feature is enabled. */
  enabled: async function () {
    return (
      (await SystemSettings.get({ label: this.featureKey }))?.value ===
      "enabled"
    );
  },
};

module.exports = { FileTypeDefault };
