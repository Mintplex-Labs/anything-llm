/**
 * This is a script that syncs the static lists of models from the Gemini API
 * so that maintainers can keep the fallback lists up to date.
 * 
 * To run, cd into this directory and run:
 * node syncStaticLists.mjs
 */

import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: `../../../.env.development` });
const existingCachePath = path.resolve('../../../storage/models/gemini')

// This will fetch all of the models from the Gemini API as well as post-process them
// to remove any models that are deprecated or experimental.
import { GeminiLLM } from "./index.js";

if (fs.existsSync(existingCachePath)) {
  console.log("Removing existing cache so we can fetch fresh models from Gemini endpoints...");
  fs.rmSync(existingCachePath, { recursive: true, force: true });
}

const models = await GeminiLLM.fetchModels(process.env.GEMINI_API_KEY);

function updateDefaultModelsFile(models) {
  const stableModelKeys = models.filter((model) => !model.experimental).map((model) => model.id);
  const v1BetaModelKeys = models.filter((model) => model.experimental).map((model) => model.id);

  let defaultModelFileContents = fs.readFileSync(path.join("./defaultModels.js"), "utf8");

  // Update the stable models between %STABLE_MODELS% and %EOC_STABLE_MODELS% comments
  defaultModelFileContents = defaultModelFileContents.replace(
    /%STABLE_MODELS%[\s\S]*?%EOC_STABLE_MODELS%/,
    `%STABLE_MODELS% - updated ${new Date().toISOString()}\n"${stableModelKeys.join('",\n"')}",\n// %EOC_STABLE_MODELS%`
  );

  // Update the v1beta models between %V1BETA_MODELS% and %EOC_V1BETA_MODELS% comments
  defaultModelFileContents = defaultModelFileContents.replace(
    /%V1BETA_MODELS%[\s\S]*?%EOC_V1BETA_MODELS%/,
    `%V1BETA_MODELS% - updated ${new Date().toISOString()}\n"${v1BetaModelKeys.join('",\n"')}",\n// %EOC_V1BETA_MODELS%`
  );

  fs.writeFileSync(path.join("./defaultModels.js"), defaultModelFileContents);
  console.log("Updated defaultModels.js. Dont forget to `yarn lint` and commit!");
}
updateDefaultModelsFile(models);
