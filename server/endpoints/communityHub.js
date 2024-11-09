const { SystemSettings } = require("../models/systemSettings");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const { reqBody } = require("../utils/http");
const { CommunityHub } = require("../models/communityHub");

function communityHubEndpoints(app) {
  if (!app) return;

  app.get(
    "/community-hub/settings",
    [validatedRequest],
    async (_, response) => {
      try {
        const { connectionKey } = await SystemSettings.hubSettings();
        response.status(200).json({ success: true, connectionKey });
      } catch (error) {
        console.error(error);
        response.status(500).json({ success: false, error: error.message });
      }
    }
  );

  app.post(
    "/community-hub/settings",
    [validatedRequest],
    async (request, response) => {
      try {
        const data = reqBody(request);
        const result = await SystemSettings.updateSettings(data);
        if (result.error) throw new Error(result.error);
        response.status(200).json({ success: true, error: null });
      } catch (error) {
        console.error(error);
        response.status(500).json({ success: false, error: error.message });
      }
    }
  );

  app.get("/community-hub/explore", [validatedRequest], async (_, response) => {
    try {
      const exploreItems = await CommunityHub.fetchExploreItems();
      response.status(200).json({ success: true, result: exploreItems });
    } catch (error) {
      console.error(error);
      response.status(500).json({
        success: false,
        result: null,
        error: error.message,
      });
    }
  });

  app.post(
    "/community-hub/item",
    [validatedRequest],
    async (request, response) => {
      try {
        const { importId } = reqBody(request);
        if (!importId) throw new Error("Import ID is required");
        const { item, error } =
          await CommunityHub.getItemFromImportId(importId);
        if (error) throw new Error(error);

        response.status(200).json({ success: true, item, error: null });
      } catch (error) {
        console.error(error);
        response.status(500).json({
          success: false,
          item: null,
          error: error.message,
        });
      }
    }
  );

  app.post(
    "/community-hub/import",
    [validatedRequest],
    async (request, response) => {
      try {
        const { importId } = reqBody(request);
        if (!importId) throw new Error("Import ID is required");

        const {
          url,
          item,
          error: fetchError,
        } = await CommunityHub.getBundleItem(importId);
        if (fetchError) throw new Error(fetchError);

        const { success, error: importError } =
          await CommunityHub.importBundleItem({ url, item });
        if (importError) throw new Error(importError);

        response.status(200).json({ success: true, error: null });
      } catch (error) {
        console.error(error);
        response.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  );

  app.get(
    "/community-hub/items",
    [validatedRequest],
    async (_, response) => {
      try {
        const { connectionKey } = await SystemSettings.hubSettings();
        const items = await CommunityHub.fetchUserItems(connectionKey);
        response.status(200).json({ success: true, ...items });
      } catch (error) {
        console.error(error);
        response.status(500).json({ success: false, error: error.message });
      }
    }
  );
}

module.exports = { communityHubEndpoints };
