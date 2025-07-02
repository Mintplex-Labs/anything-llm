// To run, cd into this directory and run `node parse.mjs`
// copy outputs into the export in ../models.js

// Update the date below if you run this again because SambaNova added new models.

// Last Collected: Jun 24, 2025
// https://docs.sambanova.ai/cloud/docs/get-started/supported-models lists chat language models.
// If you want to add models, please manually add them to chat_models.txt...

import fs from "fs";

function parseChatModels() {
  const fixed = {};
  const tableString = fs.readFileSync("chat_models.txt", { encoding: "utf-8" });
  const rows = tableString.split("\n").slice(2);

  rows.forEach((row) => {
    const [provider, name, id, maxLength] = row.split("|").slice(1, -1);
    const data = {
      provider: provider.trim(),
      name: name.trim(),
      id: id.trim(),
      maxLength: Number(maxLength.trim()),
    };

    fixed[data.id] = {
      id: data.id,
      organization: data.provider,
      name: data.name,
      maxLength: data.maxLength,
    };
  });

  fs.writeFileSync("chat_models.json", JSON.stringify(fixed, null, 2), "utf-8");
  return fixed;
}

parseChatModels();
