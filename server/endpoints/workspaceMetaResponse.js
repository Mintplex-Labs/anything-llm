const { multiUserMode, userFromSession } = require("../utils/http");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const { Telemetry } = require("../models/telemetry");
const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");
const { EventLogs } = require("../models/eventLogs");
const { WorkspaceMetaResponse } = require("../models/workspaceMetaResponse");
const { validWorkspaceSlug } = require("../utils/middleware/validWorkspace");

function workspaceMetaResponse(app) {
  if (!app) return;

  app.patch(
    "/workspace/:slug/metaResponse/toggle",
    [validatedRequest, flexUserRoleValid([ROLES.all]), validWorkspaceSlug],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const workspace = response.locals.workspace;
        const metaResponse = workspace.metaResponse;
        // If metaResponse settings are not found, create them
        if (!workspace.metaResponse && !workspace.metaResponseSettings) {
          metaResponseDefaultSettings.inputs.config.systemPrompt.openAiPrompt =
            workspace.openAiPrompt || "";
          await WorkspaceMetaResponse.update(
            workspace.id,
            JSON.stringify(metaResponseDefaultSettings)
          );
          await Telemetry.sendTelemetry(
            "workspace_meta_response_enabled",
            {
              multiUserMode: multiUserMode(response),
              LLMSelection: process.env.LLM_PROVIDER || "openai",
              Embedder: process.env.EMBEDDING_ENGINE || "inherit",
              VectorDbSelection: process.env.VECTOR_DB || "pinecone",
            },
            user?.id
          );

          await EventLogs.logEvent(
            "workspace_meta_response_enabled",
            {
              workspaceName: workspace?.name || "Unknown Workspace",
            },
            user?.id
          );
        }
        await WorkspaceMetaResponse.toggleMetaResponse(
          workspace.id,
          !metaResponse
        );
        response.sendStatus(200).end();
      } catch (e) {
        console.log(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get(
    "/workspace/:slug/metaResponse/status",
    [validatedRequest, flexUserRoleValid([ROLES.all]), validWorkspaceSlug],
    async (request, response) => {
      try {
        const workspace = response.locals.workspace;
        response.status(200).json({ status: workspace.metaResponse });
      } catch (e) {
        console.log(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get(
    "/workspace/:slug/metaResponse/settings",
    [validatedRequest, flexUserRoleValid([ROLES.all]), validWorkspaceSlug],
    async (request, response) => {
      try {
        const workspace = response.locals.workspace;
        const settings = JSON.parse(workspace.metaResponseSettings);
        if (!settings) {
          response.status(200).json(metaResponseDefaultSettings);
          return;
        }
        response.status(200).json(settings);
      } catch (e) {
        console.log(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.patch(
    "/workspace/:slug/metaResponse/settings",
    [validatedRequest, flexUserRoleValid([ROLES.all]), validWorkspaceSlug],
    async (request, response) => {
      try {
        const workspace = response.locals.workspace;
        const data = request.body;
        const result = await WorkspaceMetaResponse.update(workspace.id, data);
        response.status(200).json(JSON.parse(result.metaResponseSettings));
      } catch (e) {
        console.log(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get(
    "/workspace/:slug/metaResponse/inputs/settings",

    [validatedRequest, flexUserRoleValid([ROLES.all]), validWorkspaceSlug],
    async (request, response) => {
      try {
        const workspace = response.locals.workspace;
        const settings = JSON.parse(workspace.metaResponseSettings);
        response.status(200).json(settings.inputs);
      } catch (e) {
        console.log(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.patch(
    "/workspace/:slug/metaResponse/inputs/settings",
    [validatedRequest, flexUserRoleValid([ROLES.all]), validWorkspaceSlug],
    async (request, response) => {
      try {
        const workspace = response.locals.workspace;
        const data = request.body;
        const settings = JSON.parse(workspace.metaResponseSettings);
        settings.inputs = data;
        const result = await WorkspaceMetaResponse.update(
          workspace.id,
          JSON.stringify(settings)
        );
        response
          .status(200)
          .json(JSON.parse(result.metaResponseSettings).inputs);
      } catch (e) {
        console.log(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.patch(
    "/workspace/:slug/metaResponse/inputs/toggle",
    [validatedRequest, flexUserRoleValid([ROLES.all]), validWorkspaceSlug],
    async (request, response) => {
      try {
        const workspace = response.locals.workspace;
        const settings = JSON.parse(workspace.metaResponseSettings);
        settings.inputs.isEnabled = !settings.inputs.isEnabled;
        const result = await WorkspaceMetaResponse.update(
          workspace.id,
          JSON.stringify(settings)
        );
        response.sendStatus(200).end();
      } catch (e) {
        console.log(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get(
    "/workspace/:slug/metaResponse/sentiments/settings",
    [validatedRequest, flexUserRoleValid([ROLES.all]), validWorkspaceSlug],
    async (request, response) => {
      try {
        const workspace = response.locals.workspace;
        const settings = JSON.parse(workspace.metaResponseSettings);
        response.status(200).json(settings.sentiments);
      } catch (e) {
        console.log(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.patch(
    "/workspace/:slug/metaResponse/sentiments/settings",
    [validatedRequest, flexUserRoleValid([ROLES.all]), validWorkspaceSlug],
    async (request, response) => {
      try {
        const workspace = response.locals.workspace;
        const data = request.body;
        const settings = JSON.parse(workspace.metaResponseSettings);
        settings.sentiments = data;
        const result = await WorkspaceMetaResponse.update(
          workspace.id,
          JSON.stringify(settings)
        );
        response
          .status(200)
          .json(JSON.parse(result.metaResponseSettings).sentiments);
      } catch (e) {
        console.log(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.patch(
    "/workspace/:slug/metaResponse/sentiments/toggle",
    [validatedRequest, flexUserRoleValid([ROLES.all]), validWorkspaceSlug],
    async (request, response) => {
      try {
        const workspace = response.locals.workspace;
        const settings = JSON.parse(workspace.metaResponseSettings);
        settings.sentiments.isEnabled = !settings.sentiments.isEnabled;
        const result = await WorkspaceMetaResponse.update(
          workspace.id,
          JSON.stringify(settings)
        );
        response.sendStatus(200).end();
      } catch (e) {
        console.log(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );
}

const metaResponseDefaultSettings = {
  inputs: {
    isEnabled: false,
    config: {
      systemPrompt: {
        isEnabled: false,
        content: "",
        openAiPrompt: "",
        overrideSystemPrompt: false,
        suggestionsList: [
          {
            title: "",
            content: "",
          },
        ],
        canEdit: ["admin", "manager"],
      },
      promptSchema: {
        content: "",
        suggestionsList: [
          {
            title: "",
            content: "",
          },
        ],
        overrideWorkspacePrompt: false,
        canEdit: ["admin", "manager"],
      },
      components: {
        dropDownMenu: {
          isEnabled: false,
          options: [],
          description:
            "Drop Down menu best to select  between functional derisions, ie: continue, Repeat or Move to a new sequence.. etc",
        },
        optionsList: {
          isEnabled: false,
          options: [],
          description: "Best suited  for expansion on a topic",
        },
        optionsButtons: {
          isEnabled: false,
          options: [],
          description:
            "Chat will provide answers with the LLM's general knowledge and document context that is found.",
        },
        multiSelectCheckboxes: {
          isEnabled: false,
          options: [],
          description:
            "Chat will provide answers with the LLM's general knowledge and document context that is found.",
        },
      },
    },
    permissions: ["user"],
    description:
      "Traditionally, interaction with AnythingLLM occurs through a text area. Meta Inputs enhance this by offering alternative interaction methods, including option buttons, multi-select checkboxes, sliders, drop-down menus, and date/time selectors. To utilize these components, you'll need to guide the LLM on incorporating them into its responses with a specific schema",
  },
  sentiments: {
    isEnabled: false,
    config: {
      sentimentAnalysis: {
        isEnabled: false,

        scoreThreshold: 0.5,
      },
    },
    permissions: ["user"],
    description:
      "Activate to enable the AI to analyze and adapt its responses based on the emotional tone of the conversation, enhancing interaction personalization",
  },
  avatars: {
    isEnabled: false,
    config: {
      avatarType: "circle",
      avatarSize: "medium",
      avatarName: "user",
    },
    permissions: ["user"],
    description:
      "Enable avatars to reflect user sentiments, allowing the AI to visually empathize and convey understanding through changes in its profile image based on the meta object's sentiment data.",
  },
};

module.exports = { workspaceMetaResponse };
