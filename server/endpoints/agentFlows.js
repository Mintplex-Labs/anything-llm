const { AgentFlows } = require("../utils/agentFlows");
const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const { Telemetry } = require("../models/telemetry");

function agentFlowEndpoints(app) {
  if (!app) return;

  // Save a flow configuration
  app.post(
    "/agent-flows/save",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { name, config, uuid } = request.body;

        if (!name || !config) {
          return response.status(400).json({
            success: false,
            error: "Name and config are required",
          });
        }

        const flow = AgentFlows.saveFlow(name, config, uuid);
        if (!flow || !flow.success)
          return response
            .status(200)
            .json({ flow: null, error: flow.error || "Failed to save flow" });

        if (!uuid) {
          await Telemetry.sendTelemetry("agent_flow_created", {
            blockCount: config.blocks?.length || 0,
          });
        }

        return response.status(200).json({
          success: true,
          flow,
        });
      } catch (error) {
        console.error("Error saving flow:", error);
        return response.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  );

  // List all available flows
  app.get(
    "/agent-flows/list",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (_request, response) => {
      try {
        const flows = AgentFlows.listFlows();
        return response.status(200).json({
          success: true,
          flows,
        });
      } catch (error) {
        console.error("Error listing flows:", error);
        return response.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  );

  // Get a specific flow by UUID
  app.get(
    "/agent-flows/:uuid",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { uuid } = request.params;
        const flow = AgentFlows.loadFlow(uuid);
        if (!flow) {
          return response.status(404).json({
            success: false,
            error: "Flow not found",
          });
        }

        return response.status(200).json({
          success: true,
          flow,
        });
      } catch (error) {
        console.error("Error getting flow:", error);
        return response.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  );

  // Run a specific flow
  // app.post(
  //   "/agent-flows/:uuid/run",
  //   [validatedRequest, flexUserRoleValid([ROLES.admin])],
  //   async (request, response) => {
  //     try {
  //       const { uuid } = request.params;
  //       const { variables = {} } = request.body;

  //       // TODO: Implement flow execution
  //       console.log("Running flow with UUID:", uuid);

  //       await Telemetry.sendTelemetry("agent_flow_executed", {
  //         variableCount: Object.keys(variables).length,
  //       });

  //       return response.status(200).json({
  //         success: true,
  //         results: {
  //           success: true,
  //           results: "test",
  //           variables: variables,
  //         },
  //       });
  //     } catch (error) {
  //       console.error("Error running flow:", error);
  //       return response.status(500).json({
  //         success: false,
  //         error: error.message,
  //       });
  //     }
  //   }
  // );

  // Delete a specific flow
  app.delete(
    "/agent-flows/:uuid",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { uuid } = request.params;
        const { success } = AgentFlows.deleteFlow(uuid);

        if (!success) {
          return response.status(500).json({
            success: false,
            error: "Failed to delete flow",
          });
        }

        return response.status(200).json({
          success,
        });
      } catch (error) {
        console.error("Error deleting flow:", error);
        return response.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  );

  // Toggle flow active status
  app.post(
    "/agent-flows/:uuid/toggle",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { uuid } = request.params;
        const { active } = request.body;

        const flow = AgentFlows.loadFlow(uuid);
        if (!flow) {
          return response
            .status(404)
            .json({ success: false, error: "Flow not found" });
        }

        flow.config.active = active;
        const { success } = AgentFlows.saveFlow(flow.name, flow.config, uuid);

        if (!success) {
          return response
            .status(500)
            .json({ success: false, error: "Failed to update flow" });
        }

        return response.json({ success: true, flow });
      } catch (error) {
        console.error("Error toggling flow:", error);
        response.status(500).json({ success: false, error: error.message });
      }
    }
  );
}

module.exports = { agentFlowEndpoints };
