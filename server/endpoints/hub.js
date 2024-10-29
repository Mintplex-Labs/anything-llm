const { SystemSettings } = require("../models/systemSettings");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const { reqBody } = require("../utils/http");
const { HubItem } = require("../models/hubItems");

function hubEndpoints(app) {
  if (!app) return;

  app.get("/hub/settings", [validatedRequest], async (_, response) => {
    try {
      const settings = await SystemSettings.hubSettings();
      response.status(200).json({ success: true, settings });
    } catch (error) {
      console.error(error);
      response.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/hub/settings", [validatedRequest], async (request, response) => {
    try {
      const data = reqBody(request);
      const result = await SystemSettings.updateSettings(data);
      if (result.error) {
        throw new Error(result.error);
      }
      response.status(200).json({ success: true, error: null });
    } catch (error) {
      console.error(error);
      response.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/hub/items", [validatedRequest], async (_, response) => {
    try {
      const items = await HubItem.get();
      const placeholderItems = [
        { id: 1, name: "Placeholder 1", type: "prompt", createdAt: new Date() },
        { id: 2, name: "Placeholder 2", type: "skill", createdAt: new Date() },
      ];
      response.status(200).json({ success: true, items: placeholderItems });
    } catch (error) {
      console.error(error);
      response.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/hub/items", [validatedRequest], async (request, response) => {
    try {
      const data = reqBody(request);
      const { item, message } = await HubItem.createItem(
        data,
        request.user?.id
      );
      response.status(200).json({ success: true, item, message });
    } catch (error) {
      console.error(error);
      response.status(500).json({ success: false, error: error.message });
    }
  });

  app.delete(
    "/hub/items/:id",
    [validatedRequest],
    async (request, response) => {
      try {
        const { id } = request.params;
        const success = await HubItem.delete(id);
        response.status(success ? 200 : 500).json({ success });
      } catch (error) {
        console.error(error);
        response.status(500).json({ success: false, error: error.message });
      }
    }
  );

  app.post("/hub/import", [validatedRequest], async (request, response) => {
    try {
      console.log("CALL HUB APP BACKEND IMPORT ENDPOINT");
      response.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      response.status(500).json({ success: false, error: error.message });
    }
  });

  // Proxy endpoint to retrieve trending items from the hub
  app.get("/hub/explore", [validatedRequest], async (request, response) => {
    try {
      const placeholderItems = [
        // Prompts
        {
          id: 1,
          name: "Customer Service Assistant",
          type: "prompt",
          createdAt: new Date(),
          hubId: "p1",
          content: "A helpful customer service assistant",
        },
        {
          id: 2,
          name: "Technical Writer",
          type: "prompt",
          createdAt: new Date(),
          hubId: "p2",
          content: "Technical documentation expert",
        },
        {
          id: 3,
          name: "Data Analyst",
          type: "prompt",
          createdAt: new Date(),
          hubId: "p3",
          content: "Data analysis specialist",
        },
        {
          id: 4,
          name: "Creative Writer",
          type: "prompt",
          createdAt: new Date(),
          hubId: "p4",
          content: "Creative writing assistant",
        },

        // Skills
        {
          id: 5,
          name: "Currency Converter",
          type: "skill",
          createdAt: new Date(),
          hubId: "s1",
          content: "Convert currency",
        },
        {
          id: 6,
          name: "Weather Forecast",
          type: "skill",
          createdAt: new Date(),
          hubId: "s2",
          content: "Get weather forecast",
        },
        {
          id: 7,
          name: "Computer Control",
          type: "skill",
          createdAt: new Date(),
          hubId: "s3",
          content: "Control your computer using vision",
        },
        {
          id: 8,
          name: "Email",
          type: "skill",
          createdAt: new Date(),
          hubId: "s4",
          content: "Allow you to send emails using the agent",
        },

        // Workspaces
        {
          id: 9,
          name: "Project Management",
          type: "workspace",
          createdAt: new Date(),
          hubId: "w1",
          content: "Project management workspace",
        },
        {
          id: 10,
          name: "Development Team",
          type: "workspace",
          createdAt: new Date(),
          hubId: "w2",
          content: "Development team workspace",
        },
        {
          id: 11,
          name: "Marketing",
          type: "workspace",
          createdAt: new Date(),
          hubId: "w3",
          content: "Marketing workspace",
        },
        {
          id: 12,
          name: "Support",
          type: "workspace",
          createdAt: new Date(),
          hubId: "w4",
          content: "Support team workspace",
        },

        // Commands
        {
          id: 13,
          name: "/analyze",
          type: "command",
          createdAt: new Date(),
          hubId: "c1",
          content: "Analyze data command",
        },
        {
          id: 14,
          name: "/summarize",
          type: "command",
          createdAt: new Date(),
          hubId: "c2",
          content: "Summarize text command",
        },
        {
          id: 15,
          name: "/translate",
          type: "command",
          createdAt: new Date(),
          hubId: "c3",
          content: "Translate text command",
        },
        {
          id: 16,
          name: "/explain",
          type: "command",
          createdAt: new Date(),
          hubId: "c4",
          content: "Explain concept command",
        },
      ];

      response.status(200).json({ success: true, items: placeholderItems });
    } catch (error) {
      console.error(error);
      response.status(500).json({ success: false, error: error.message });
    }
  });
}

module.exports = { hubEndpoints };
