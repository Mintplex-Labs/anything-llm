const { WorkspaceTemplate } = require("../models/workspaceTemplate");
const { Workspace } = require("../models/workspace");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");
const { reqBody, userFromSession, multiUserMode } = require("../utils/http");

function workspaceTemplateEndpoints(app) {
  if (!app) return;

  app.post(
    "/workspace-templates",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const { name, description, workspaceSlug } = reqBody(request);

        if (!name || !workspaceSlug) {
          return response
            .status(400)
            .json({
              template: null,
              message: "Name and workspaceSlug are required",
            });
        }

        const user = await userFromSession(request, response);
        const workspace = multiUserMode(response)
          ? await Workspace.getWithUser(user, { slug: workspaceSlug })
          : await Workspace.get({ slug: workspaceSlug });

        if (!workspace) {
          return response
            .status(404)
            .json({ template: null, message: "Workspace not found" });
        }

        const { template, message } = await WorkspaceTemplate.create({
          name,
          description,
          workspaceId: workspace.id,
        });

        return response
          .status(template ? 200 : 500)
          .json({ template, message });
      } catch (error) {
        console.error("Error creating workspace template:", error);
        return response
          .status(500)
          .json({ template: null, message: error.message });
      }
    }
  );

  app.get(
    "/workspace-templates",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (_request, response) => {
      try {
        const templates = await WorkspaceTemplate.all();
        return response.status(200).json({ templates });
      } catch (error) {
        console.error("Error fetching workspace templates:", error);
        return response
          .status(500)
          .json({ templates: [], message: error.message });
      }
    }
  );

  app.delete(
    "/workspace-templates/:id",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const { id } = request.params;
        const success = await WorkspaceTemplate.delete(id);

        if (!success) {
          return response
            .status(500)
            .json({ success: false, message: "Failed to delete template" });
        }

        return response.status(200).json({ success: true });
      } catch (error) {
        console.error("Error deleting workspace template:", error);
        return response
          .status(500)
          .json({ success: false, message: error.message });
      }
    }
  );
}

module.exports = { workspaceTemplateEndpoints };
