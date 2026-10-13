const {
  anthropicTooledComplete,
} = require("../../../../../../utils/agents/aibitat/providers/helpers/anthropicTooled.js");
const {
  FilesystemReadTextFile,
} = require("../../../../../../utils/agents/aibitat/plugins/filesystem/read-text-file.js");

describe("required parameters of bundled plugins", () => {
  it("anthropicTooledComplete sends filesystem-read-text-file's required list in input_schema", async () => {
    const functions = [];
    FilesystemReadTextFile.plugin.call(FilesystemReadTextFile).setup({
      function: (definition) => functions.push(definition),
    });

    const create = jest.fn(async () => ({
      content: [{ type: "text", text: "ok" }],
      stop_reason: "end_turn",
      usage: null,
    }));
    await anthropicTooledComplete(
      { messages: { create } },
      "m",
      1024,
      [{ role: "user", content: "read config.json" }],
      functions
    );

    const [tool] = create.mock.calls[0][0].tools;
    expect(tool.name).toBe("filesystem-read-text-file");
    expect(tool.input_schema.required).toEqual(["path"]);
  });
});
