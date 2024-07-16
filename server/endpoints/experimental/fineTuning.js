const { FineTuning } = require("../../models/fineTuning");
const { reqBody } = require("../../utils/http");
const {
  flexUserRoleValid,
  ROLES,
} = require("../../utils/middleware/multiUserProtected");
const { validatedRequest } = require("../../utils/middleware/validatedRequest");

function fineTuningEndpoints(app) {
  if (!app) return;

  app.get(
    "/experimental/fine-tuning/info",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (_request, response) => {
      try {
        const fineTuningInfo = await FineTuning.getInfo();
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
          return response
            .status(200)
            .json({
              count: 0,
              recommendedMin: FineTuning.recommendedMinDataset,
            });
        }

        const count = await FineTuning.datasetSize(slugs, feedback);
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
        response.status(200).json({ jobId, checkoutUrl });
      } catch (e) {
        console.error(e);
        response.status(500).end();
      }
    }
  );
}

module.exports = { fineTuningEndpoints };
