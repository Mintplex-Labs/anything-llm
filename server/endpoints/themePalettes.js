const { SystemSettings } = require("../models/systemSettings");
const { sanitizeThemePalettes } = require("../utils/themePalettes");

function themePalettesEndpoints(app) {
  if (!app) return;

  // No middleware protection in order to theme the login page.
  // Updates go through /admin/system-preferences as `theme_palettes`.
  app.get("/system/theme-palettes", async (_, response) => {
    try {
      const setting = await SystemSettings.get({ label: "theme_palettes" });
      response
        .status(200)
        .json({ themePalettes: sanitizeThemePalettes(setting?.value) });
    } catch (error) {
      console.error("Error fetching theme palettes:", error);
      response.status(500).json({ message: "Internal server error" });
    }
  });
}

module.exports = { themePalettesEndpoints };
