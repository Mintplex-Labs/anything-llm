const { FineTuning } = require("../../models/fineTuning");
const { Telemetry } = require("../../models/telemetry");
const { WorkspaceChats } = require("../../models/workspaceChats");
const { reqBody } = require("../../utils/http");
const {
  flexUserRoleValid,
  ROLES,
} = require("../../utils/middleware/multiUserProtected");
const { validatedRequest } = require("../../utils/middleware/validatedRequest");

function fineTuningEndpoints(app) {
  if (!app) return;

  app.get(
    "/experimental/fine-tuning/check-eligible",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (_request, response) => {
      try {
        const chatCount = await WorkspaceChats.count();
        response
          .status(200)
          .json({ eligible: chatCount >= FineTuning.recommendedMinDataset });
      } catch (e) {
        console.error(e);
        response.status(500).end();
      }
    }
  );

  app.get(
    "/experimental/fine-tuning/info",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (_request, response) => {
      try {
        const fineTuningInfo = await FineTuning.getInfo();
        await Telemetry.sendTelemetry("fine_tuning_interest", {
          step: "information",
        });
        response.status(200).json(fineTuningInfo);
      } catch (e) {
        console.error(e);
        response.status(500).end();
      }
    }
  );

  app.post(
    "/experimental/fine-tuning/dataset",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { slugs = [], feedback = null } = reqBody(request);
        if (!Array.isArray(slugs) || slugs.length === 0) {
          return response.status(200).json({
            count: 0,
            recommendedMin: FineTuning.recommendedMinDataset,
          });
        }

        const count = await FineTuning.datasetSize(slugs, feedback);
        await Telemetry.sendTelemetry("fine_tuning_interest", {
          step: "uploaded_dataset",
        });
        response
          .status(200)
          .json({ count, recommendedMin: FineTuning.recommendedMinDataset });
      } catch (e) {
        console.error(e);
        response.status(500).end();
      }
    }
  );

  app.post(
    "/experimental/fine-tuning/order",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { email, baseModel, modelName, trainingData } = reqBody(request);
        if (
          !email ||
          !baseModel ||
          !modelName ||
          !trainingData ||
          !trainingData?.slugs.length
        )
          throw new Error("Invalid order details");

        const { jobId, checkoutUrl } = await FineTuning.newOrder({
          email,
          baseModel,
          modelName,
          trainingData,
        });
        await Telemetry.sendTelemetry("fine_tuning_interest", {
          step: "created_order",
          jobId,
        });
        response.status(200).json({ jobId, checkoutUrl });
      } catch (e) {
        console.error(e);
        response.status(500).end();
      }
    }
  );
}

module.exports = { fineTuningEndpoints };
