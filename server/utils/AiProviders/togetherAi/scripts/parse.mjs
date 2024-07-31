// Together AI does not provide a simple REST API to get models,
// so we have a table which we copy from their documentation
// https://docs.together.ai/edit/inference-models that we can
// then parse and get all models from in a format that makes sense
// Why this does not exist is so bizarre, but whatever.

// To run, cd into this directory and run `node parse.mjs`
// copy outputs into the export in ../models.js

// Update the date below if you run this again because TogetherAI added new models.
// Last Collected: Jul 31, 2024
// Since last collection Together's docs are broken. I just copied the HTML table
// and had claude3 convert to markdown and it works well enough.

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
