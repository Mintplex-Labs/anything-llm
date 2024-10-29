const { SystemSettings } = require("../models/systemSettings");
const { Hub } = require("../models/hub");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const { reqBody } = require("../utils/http");

function hubEndpoints(app) {
  if (!app) return;

  app.get("/hub/settings", [validatedRequest], async (_, response) => {
    try {
      const settings = await SystemSettings.hubSettings();
      response.status(200).json({ settings });
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: error.message });
    }
  });

  app.post("/hub/settings", [validatedRequest], async (request, response) => {
    try {
      const { hub_api_key } = reqBody(request);
      const { success, error } = await SystemSettings.updateSettings({
        hub_api_key,
      });

      if (!success) throw new Error(error || "Failed to update hub API key");
      const settings = await SystemSettings.hubSettings();
      response.status(200).json({ settings, error: null });
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: error.message });
    }
  });

  app.get("/hub/items", [validatedRequest], async (_, response) => {
    try {
      const items = await Hub.getItems();
      response.status(200).json({ items });
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: error.message });
    }
  });

  // Fetch a new item from the hub
  app.post("/hub/items", [validatedRequest], async (request, response) => {
    try {
      const data = reqBody(request);
      // TODO: Fetch the data from the hub
      const { item, message } = await Hub.createItem(data, request.user?.id);
      response.status(200).json({ item, message });
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: error.message });
    }
  });

  app.delete(
    "/hub/items/:id",
    [validatedRequest],
    async (request, response) => {
      try {
        const { id } = request.params;
        const success = await Hub.deleteItem(id);
        response.status(success ? 200 : 500).json({ success });
      } catch (error) {
        console.error(error);
        response.status(500).json({ error: error.message });
      }
    }
  );
}

module.exports = { hubEndpoints };
