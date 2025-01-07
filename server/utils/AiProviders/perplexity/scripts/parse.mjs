// Perplexity does not provide a simple REST API to get models,
// so we have a table which we copy from their documentation
// https://docs.perplexity.ai/edit/model-cards that we can
// then parse and get all models from in a format that makes sense
// Why this does not exist is so bizarre, but whatever.

// To run, cd into this directory and run `node parse.mjs`
// copy outputs into the export in ../models.js

// Update the date below if you run this again because Perplexity added new models.
// Last Collected: Sept 12, 2024

import fs from "fs";

function parseChatModels() {
  const models = {};
  const tableString = fs.readFileSync("chat_models.txt", { encoding: "utf-8" });
  const rows = tableString.split("\n").slice(2);

  rows.forEach((row) => {
    let [model, _, contextLength] = row
      .split("|")
      .slice(1, -1)
      .map((text) => text.trim());
    model = model.replace(/`|\s*\[\d+\]\s*/g, "");
    const maxLength = Number(contextLength.replace(/[^\d]/g, ""));
    if (model && maxLength) {
      models[model] = {
        id: model,
        name: model,
        maxLength: maxLength,
      };
    }
  });

  fs.writeFileSync(
    "chat_models.json",
    JSON.stringify(models, null, 2),
    "utf-8"
  );
  return models;
}

parseChatModels();
