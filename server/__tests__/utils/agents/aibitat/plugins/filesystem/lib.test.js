/* eslint-env jest */
const fs = require("fs");
const os = require("os");
const path = require("path");
const filesystem = require("../../../../../../utils/agents/aibitat/plugins/filesystem/lib.js");

describe("FilesystemManager.applyFileEdits", () => {
  let dir;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "filesystem-edit-test-"));
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  // A string passed as the second argument of String.prototype.replace is a
  // replacement pattern: $$, $&, $` and $' are expanded instead of inserted.
  test.each([
    [
      "$$ in a Makefile recipe",
      "build:\n\techo TODO\n",
      { oldText: "echo TODO", newText: "echo $$PPID" },
      "build:\n\techo $$PPID\n",
    ],
    [
      "$& in a sed expression",
      "sed -E 's/foo/bar/' file\n",
      { oldText: "s/foo/bar/", newText: "s/foo/[$&]/" },
      "sed -E 's/foo/[$&]/' file\n",
    ],
    [
      "$` in Markdown inline code",
      "Amounts are shown in EUR.\n",
      { oldText: "EUR", newText: "USD (`$`)" },
      "Amounts are shown in USD (`$`).\n",
    ],
    [
      "$' in bash ANSI-C quoting",
      "#!/bin/bash\nIFS=x\necho done\n",
      { oldText: "IFS=x", newText: "IFS=$'\\n'" },
      "#!/bin/bash\nIFS=$'\\n'\necho done\n",
    ],
  ])(
    "writes newText containing %s exactly as given",
    async (_label, original, edit, expected) => {
      const filePath = path.join(dir, "file.txt");
      fs.writeFileSync(filePath, original);

      await filesystem.applyFileEdits(filePath, [edit]);

      expect(fs.readFileSync(filePath, "utf-8")).toBe(expected);
    }
  );
});
