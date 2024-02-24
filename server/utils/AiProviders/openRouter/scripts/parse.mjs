// OpenRouter has lots of models we can use so we use this script
// to cache all the models. We can see the list of all the models
// here: https://openrouter.ai/docs#models

// To run, cd into this directory and run `node parse.mjs`
// copy outputs into the export in ../models.js

// Update the date below if you run this again because OpenRouter added new models.
// Last Collected: Feb 23, 2024

import fs from "fs";

async function parseChatModels() {
  const models = {};
  const response = await fetch("https://openrouter.ai/api/v1/models");
  const data = await response.json();
  data.data.forEach((model) => {
    models[model.id] = {
      id: model.id,
      name: model.name,
      // capitalize first letter
      organization:
        model.id.split("/")[0].charAt(0).toUpperCase() +
        model.id.split("/")[0].slice(1),
      maxLength: model.context_length,
    };
  });

  fs.writeFileSync(
    "chat_models.json",
    JSON.stringify(models, null, 2),
    "utf-8"
  );
  return models;
}

parseChatModels();
