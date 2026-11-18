/* eslint-env jest */
const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { performance } = require("perf_hooks");
const childProcess = require("child_process");
const realSpawnSync = childProcess.spawnSync;
const realExecFile = childProcess.execFile;

jest.mock(
  "../../../../../../utils/agents/aibitat/plugins/filesystem/lib.js",
  () => ({
    ensureInitialized: jest.fn().mockResolvedValue(undefined),
    getAllowedDirectories: jest.fn(),
    readFileContent: jest.fn(),
    truncateContentForContext: jest.fn((content) => ({
      content,
      wasTruncated: false,
    })),
  })
);
jest.mock("../../../../../../models/user", () => ({ User: {} }));

const filesystem = require("../../../../../../utils/agents/aibitat/plugins/filesystem/lib.js");
const {
  FilesystemSearchFiles,
} = require("../../../../../../utils/agents/aibitat/plugins/filesystem/search-files.js");

function setupPlugin() {
  const aibitat = {
    function: (config) => (aibitat._fn = config),
    handlerProps: { log: jest.fn() },
    introspect: jest.fn(),
    addCitation: jest.fn(),
  };
  FilesystemSearchFiles.plugin().setup(aibitat);
  return { aibitat, handler: aibitat._fn.handler.bind(aibitat._fn) };
}

const match = (file, line, content) => ({
  type: "match",
  data: { path: { text: file }, line_number: line, lines: { text: content } },
});
let delay;
let exitCode;
let output;
let invocations;

// Keep real process execution: replace only the external ripgrep executable
// with a portable Node fixture so a slow search is deterministic and inexpensive.
function fixtureArgs(args) {
  invocations.push(args);
  const stdout =
    args.at(-1) === "/bad"
      ? "/bad/unreadable\n"
      : (output ??
        (args.includes("--files")
          ? "/notes/a.txt\n/notes/a.txt\n/notes/b.txt\n"
          : JSON.stringify([match("/notes/a.txt", 2, " microVMs \n")])));
  return [
    "-e",
    `setTimeout(() => {
    process.stdout.write(${JSON.stringify(stdout)});
    process.stderr.write(${JSON.stringify("cannot read directory")});
    process.exit(${args.at(-1) === "/bad" ? 2 : exitCode});
  }, ${delay});`,
    "--",
    ...args,
  ];
}

beforeEach(() => {
  jest.clearAllMocks();
  delay = 0;
  exitCode = 0;
  output = null;
  invocations = [];
  filesystem.getAllowedDirectories.mockReturnValue(["/notes"]);
  filesystem.readFileContent.mockResolvedValue("full file contents");
  jest
    .spyOn(childProcess, "spawnSync")
    .mockImplementation((_file, args, options) =>
      realSpawnSync(process.execPath, fixtureArgs(args), options)
    );
  jest
    .spyOn(childProcess, "execFile")
    .mockImplementation((_file, args, options, callback) =>
      realExecFile(process.execPath, fixtureArgs(args), options, callback)
    );
});

afterEach(() => jest.restoreAllMocks());

describe("filesystem-search-files", () => {
  test.each(["glob", "content"])(
    "%s search serves HTTP requests before the child exits",
    async (mode) => {
      delay = 400;
      const { handler } = setupPlugin();
      const server = http.createServer((_req, res) => res.end("pong"));
      await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
      let completed = false;
      const started = performance.now();
      const pending = handler({ pattern: "microVMs", mode }).then((result) => {
        completed = true;
        return result;
      });
      try {
        const response = await new Promise((resolve, reject) => {
          http
            .get(
              `http://127.0.0.1:${server.address().port}/api/ping`,
              (res) => {
                let body = "";
                res.on("data", (chunk) => (body += chunk));
                res.on("end", () =>
                  resolve({ body, searchCompleted: completed })
                );
              }
            )
            .on("error", reject);
        });
        console.log(
          `${mode}: HTTP response after ${Math.round(performance.now() - started)}ms; searchCompleted=${response.searchCompleted}; child delay=${delay}ms`
        );
        expect(invocations).toHaveLength(1);
        expect(response.body).toBe("pong");
        expect(response.searchCompleted).toBe(false);
        expect(await pending).toContain("/notes/a.txt");
      } finally {
        await pending;
        await new Promise((resolve) => server.close(resolve));
      }
    }
  );

  test("glob preserves pattern expansion, exclusions, deduplication and limits", async () => {
    const { handler } = setupPlugin();
    expect(
      await handler({
        pattern: "notes",
        excludePatterns: ["*.log"],
        maxResults: 1,
      })
    ).toBe("/notes/a.txt");
    expect(invocations[0]).toEqual([
      "--files",
      "--no-ignore",
      "--glob",
      "*notes*",
      "--glob",
      "**/*notes*",
      "--glob",
      "!*.log",
      "--",
      "/notes",
    ]);
  });

  test("content preserves filters, formatting and positional argument separation", async () => {
    const { handler } = setupPlugin();
    expect(
      await handler({
        pattern: "microVMs",
        mode: "content",
        filePattern: "*.txt",
        excludePatterns: ["private/**"],
        caseSensitive: false,
        maxResults: 2,
      })
    ).toBe("/notes/a.txt:2: microVMs");
    expect(invocations[0]).toEqual([
      "--json",
      "--line-number",
      "--no-ignore",
      "--max-count",
      "2",
      "--ignore-case",
      "--glob",
      "*.txt",
      "--glob",
      "!private/**",
      "--",
      "microVMs",
      "/notes",
    ]);
  });

  test.each(["glob", "content"])(
    "%s accepts ripgrep's no-match exit code",
    async (mode) => {
      exitCode = 1;
      output = "";
      expect(await setupPlugin().handler({ pattern: "missing", mode })).toBe(
        "No matches found"
      );
    }
  );

  test.each(["glob", "content"])(
    "%s skips a failed directory and searches the next one",
    async (mode) => {
      filesystem.getAllowedDirectories.mockReturnValue(["/bad", "/notes"]);
      const { handler } = setupPlugin();
      expect(await handler({ pattern: "notes", mode })).toBe(
        mode === "glob"
          ? "/notes/a.txt\n/notes/b.txt"
          : "/notes/a.txt:2: microVMs"
      );
      expect(invocations).toHaveLength(2);
    }
  );

  test.each(["glob", "content"])(
    "%s reads matching files and adds citations",
    async (mode) => {
      const { aibitat, handler } = setupPlugin();
      expect(
        await handler({
          pattern: "notes",
          mode,
          includeFileContents: true,
          maxFilesToRead: 1,
        })
      ).toContain("=== /notes/a.txt ===\nfull file contents");
      expect(filesystem.readFileContent).toHaveBeenCalledTimes(1);
      expect(aibitat.addCitation).toHaveBeenCalledWith(
        expect.objectContaining({
          chunkSource: "/notes/a.txt",
          text: "full file contents",
        })
      );
    }
  );

  test("content rejects option-like patterns without launching ripgrep", async () => {
    expect(
      await setupPlugin().handler({ pattern: "--pre=/bin/sh", mode: "content" })
    ).toBe("No matches found");
    expect(invocations).toHaveLength(0);
  });

  test("returns the existing error when no directories are allowed", async () => {
    filesystem.getAllowedDirectories.mockReturnValue([]);
    expect(await setupPlugin().handler({ pattern: "notes" })).toBe(
      "Error: No allowed directories configured"
    );
    expect(invocations).toHaveLength(0);
  });

  test("real ripgrep preserves glob and content searches, exclusions and no matches", async () => {
    jest.restoreAllMocks();
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "filesystem-search-"));
    const note = path.join(dir, "notes.txt");
    try {
      fs.writeFileSync(note, "MicroVMs and Firecracker\n");
      fs.writeFileSync(path.join(dir, "skip.txt"), "MicroVMs secret\n");
      fs.writeFileSync(path.join(dir, ".gitignore"), "*.txt\n");
      filesystem.getAllowedDirectories.mockReturnValue([dir, dir]);
      const { handler } = setupPlugin();
      expect(
        await handler({ pattern: "*.txt", excludePatterns: ["skip.txt"] })
      ).toBe(note);
      expect(
        await handler({
          pattern: "microvms",
          mode: "content",
          caseSensitive: false,
          filePattern: "*.txt",
          excludePatterns: ["skip.txt"],
        })
      ).toBe(`${note}:1: MicroVMs and Firecracker`);
      expect(await handler({ pattern: "microvms", mode: "content" })).toBe(
        "No matches found"
      );
      expect(await handler({ pattern: "missing", mode: "glob" })).toBe(
        "No matches found"
      );
      expect(await handler({ pattern: "[", mode: "content" })).toBe(
        "No matches found"
      );
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
