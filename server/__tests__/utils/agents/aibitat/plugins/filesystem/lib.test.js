/* eslint-env jest */
const fs = require("fs");
const os = require("os");
const path = require("path");
const filesystem = require("../../../../../../utils/agents/aibitat/plugins/filesystem/lib.js");

describe("applyFileEdits whitespace-tolerant match", () => {
  let dir;
  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "fs-edit-"));
  });
  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  async function edit(content, oldText, newText) {
    const file = path.join(dir, "file.txt");
    fs.writeFileSync(file, content);
    await filesystem.applyFileEdits(file, [{ oldText, newText }]);
    return fs.readFileSync(file, "utf8");
  }

  test("keeps nested lines indented when oldText is quoted with less indentation", async () => {
    const result = await edit(
      "function check(x) {\n    if (x > 1) {\n        return 1;\n    }\n}\n",
      "if (x > 1) {\n    return 1;\n}",
      "if (x > 2) {\n    return 2;\n}"
    );
    expect(result).toBe(
      "function check(x) {\n    if (x > 2) {\n        return 2;\n    }\n}\n"
    );
  });

  test("keeps nested lines indented when only trailing whitespace differs", async () => {
    const result = await edit(
      "class A:\n    def f(self): \n        return 1\n",
      "    def f(self):\n        return 1",
      "    def f(self):\n        return 2"
    );
    expect(result).toBe("class A:\n    def f(self):\n        return 2\n");
  });
});
