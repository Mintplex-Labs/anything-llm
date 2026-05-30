const fs = require("fs");
const os = require("os");
const path = require("path");
const {
  getSwarmsyRequiredDocsStatus,
} = require("../../../utils/swarmsy/requiredDocs");

function createTempRoot(prefix = "swarmsy-required-docs") {
  return fs.mkdtempSync(path.join(os.tmpdir(), `${prefix}-`));
}

function writeDoc(root, relativePath, content) {
  const absolutePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content, "utf8");
  return absolutePath;
}

describe("swarmsy required docs status helper", () => {
  const originalDocsRoot = process.env.SWARMSY_DOCTRINE_DOCS_ROOT;

  afterEach(() => {
    if (typeof originalDocsRoot === "undefined") {
      delete process.env.SWARMSY_DOCTRINE_DOCS_ROOT;
    } else {
      process.env.SWARMSY_DOCTRINE_DOCS_ROOT = originalDocsRoot;
    }
    jest.restoreAllMocks();
  });

  it("returns grouped present/missing/loadable status", () => {
    const tmpRoot = createTempRoot();
    process.env.SWARMSY_DOCTRINE_DOCS_ROOT = tmpRoot;

    writeDoc(tmpRoot, "docs/swarmsy/required.md", "ready");
    writeDoc(tmpRoot, "docs/swarmsy/optional-empty.md", "   ");

    const status = getSwarmsyRequiredDocsStatus({
      manifest: {
        name: "Test Manifest",
        groups: [
          {
            id: "required",
            label: "Required Group",
            required: true,
            paths: ["docs/swarmsy/required.md", "docs/swarmsy/missing.md"],
          },
          {
            id: "optional",
            label: "Optional Group",
            required: false,
            paths: ["docs/swarmsy/optional-empty.md"],
          },
        ],
      },
    });

    expect(status.success).toBe(true);
    expect(status.docsRootAvailable).toBe(true);
    expect(status.groups[0]).toMatchObject({
      id: "required",
      required: true,
      optional: false,
      present: 1,
      missing: 1,
      loadable: 1,
    });
    expect(status.groups[1]).toMatchObject({
      id: "optional",
      required: false,
      optional: true,
      present: 1,
      missing: 0,
      loadable: 0,
    });
    expect(status.summary).toEqual({
      requiredPresent: 1,
      requiredMissing: 1,
      optionalPresent: 1,
      optionalMissing: 0,
      loadable: 1,
    });
  });

  it('coerces required strings so "true" is required and "false" is optional', () => {
    const tmpRoot = createTempRoot();
    process.env.SWARMSY_DOCTRINE_DOCS_ROOT = tmpRoot;

    const status = getSwarmsyRequiredDocsStatus({
      manifest: {
        name: "String Required",
        groups: [
          {
            id: "required-as-string",
            label: "Required as String",
            required: "true",
            paths: ["docs/swarmsy/missing-a.md"],
          },
          {
            id: "optional-as-string",
            label: "Optional as String",
            required: "false",
            paths: ["docs/swarmsy/missing-b.md"],
          },
        ],
      },
    });

    expect(status.groups[0].required).toBe(true);
    expect(status.groups[0].optional).toBe(false);
    expect(status.groups[1].required).toBe(false);
    expect(status.groups[1].optional).toBe(true);
    expect(status.summary.requiredMissing).toBe(1);
    expect(status.summary.optionalMissing).toBe(1);
  });

  it("returns unavailable docs root status when env root is missing", () => {
    const missingRoot = path.join(
      os.tmpdir(),
      `swarmsy-doctrine-root-missing-${Date.now()}-${process.pid}`
    );
    process.env.SWARMSY_DOCTRINE_DOCS_ROOT = missingRoot;

    const status = getSwarmsyRequiredDocsStatus({
      manifest: {
        name: "Missing Root",
        groups: [
          {
            id: "required",
            label: "Required Group",
            required: true,
            paths: ["docs/swarmsy/file.md"],
          },
        ],
      },
    });

    expect(status.docsRoot).toBe(path.resolve(missingRoot));
    expect(status.docsRootAvailable).toBe(false);
    expect(status.groups[0].files[0]).toMatchObject({
      present: false,
      loadable: false,
    });
  });

  it("does not throw when docs root stat fails", () => {
    const tmpRoot = createTempRoot();
    process.env.SWARMSY_DOCTRINE_DOCS_ROOT = tmpRoot;

    const originalStatSync = fs.statSync;
    jest.spyOn(fs, "statSync").mockImplementation((targetPath, ...rest) => {
      if (path.resolve(targetPath) === path.resolve(tmpRoot)) {
        throw new Error("EACCES: permission denied");
      }
      return originalStatSync(targetPath, ...rest);
    });

    expect(() =>
      getSwarmsyRequiredDocsStatus({
        manifest: {
          name: "Stat Error",
          groups: [
            {
              id: "required",
              label: "Required Group",
              required: true,
              paths: ["docs/swarmsy/file.md"],
            },
          ],
        },
      })
    ).not.toThrow();

    const status = getSwarmsyRequiredDocsStatus({
      manifest: {
        name: "Stat Error",
        groups: [
          {
            id: "required",
            label: "Required Group",
            required: true,
            paths: ["docs/swarmsy/file.md"],
          },
        ],
      },
    });

    expect(status.docsRootAvailable).toBe(false);
  });

  it("rejects manifest path traversal", () => {
    const tmpRoot = createTempRoot();
    process.env.SWARMSY_DOCTRINE_DOCS_ROOT = tmpRoot;

    const status = getSwarmsyRequiredDocsStatus({
      manifest: {
        name: "Traversal",
        groups: [
          {
            id: "required",
            label: "Required Group",
            required: true,
            paths: ["docs/swarmsy/../secret.md"],
          },
        ],
      },
    });

    expect(status.groups[0].files[0].present).toBe(false);
    expect(status.groups[0].files[0].loadable).toBe(false);
    expect(status.groups[0].files[0].error).toContain("Invalid manifest path");
  });

  it("marks symlink docs as present but not loadable without reading target", () => {
    const tmpRoot = createTempRoot();
    process.env.SWARMSY_DOCTRINE_DOCS_ROOT = tmpRoot;

    const targetPath = writeDoc(tmpRoot, "docs/swarmsy/target.md", "real content");
    const symlinkPath = path.join(tmpRoot, "docs/swarmsy/symlink.md");
    fs.symlinkSync(targetPath, symlinkPath);
    const readSpy = jest.spyOn(fs, "readFileSync");

    const status = getSwarmsyRequiredDocsStatus({
      manifest: {
        name: "Symlink File",
        groups: [
          {
            id: "required",
            label: "Required Group",
            required: true,
            paths: ["docs/swarmsy/symlink.md"],
          },
        ],
      },
    });

    expect(status.groups[0].files[0]).toMatchObject({
      present: true,
      loadable: false,
      bytes: 0,
      error: "Document path must not include symbolic links.",
    });
    expect(readSpy).not.toHaveBeenCalledWith(symlinkPath, "utf8");
  });

  it("marks parent directory symlink as present but not loadable without reading target", () => {
    const tmpRoot = createTempRoot();
    const externalRoot = createTempRoot("swarmsy-external");
    process.env.SWARMSY_DOCTRINE_DOCS_ROOT = tmpRoot;

    const externalDir = path.join(externalRoot, "docs", "swarmsy");
    fs.mkdirSync(externalDir, { recursive: true });
    fs.writeFileSync(path.join(externalDir, "secret.md"), "external content", "utf8");

    const symlinkDirParent = path.join(tmpRoot, "docs");
    fs.mkdirSync(symlinkDirParent, { recursive: true });
    const symlinkDir = path.join(symlinkDirParent, "swarmsy");
    fs.symlinkSync(externalDir, symlinkDir);

    const readSpy = jest.spyOn(fs, "readFileSync");

    const status = getSwarmsyRequiredDocsStatus({
      manifest: {
        name: "Symlink Parent Dir",
        groups: [
          {
            id: "required",
            label: "Required Group",
            required: true,
            paths: ["docs/swarmsy/secret.md"],
          },
        ],
      },
    });

    expect(status.groups[0].files[0]).toMatchObject({
      present: true,
      loadable: false,
      bytes: 0,
      error: "Document path must not include symbolic links.",
    });
    expect(readSpy).not.toHaveBeenCalledWith(
      path.join(tmpRoot, "docs", "swarmsy", "secret.md"),
      "utf8"
    );
  });

  it("accepts docs/swarmsy paths when docs root is filesystem root", () => {
    process.env.SWARMSY_DOCTRINE_DOCS_ROOT = path.parse(process.cwd()).root;

    const status = getSwarmsyRequiredDocsStatus({
      manifest: {
        name: "Root Path",
        groups: [
          {
            id: "required",
            label: "Required Group",
            required: true,
            paths: ["docs/swarmsy/missing.md"],
          },
        ],
      },
    });

    expect(status.docsRoot).toBe(path.parse(process.cwd()).root);
    expect(status.docsRootAvailable).toBe(true);
    expect(status.groups[0].files[0].error).toBe("Document is missing.");
  });

  it("marks missing docs as not present and not loadable", () => {
    const tmpRoot = createTempRoot();
    process.env.SWARMSY_DOCTRINE_DOCS_ROOT = tmpRoot;

    const status = getSwarmsyRequiredDocsStatus({
      manifest: {
        name: "Missing File",
        groups: [
          {
            id: "required",
            label: "Required Group",
            required: true,
            paths: ["docs/swarmsy/missing.md"],
          },
        ],
      },
    });

    expect(status.groups[0].files[0]).toMatchObject({
      present: false,
      loadable: false,
    });
  });

  it("handles ENOENT stat failures as missing docs", () => {
    const tmpRoot = createTempRoot();
    process.env.SWARMSY_DOCTRINE_DOCS_ROOT = tmpRoot;

    const originalStatSync = fs.statSync;
    jest.spyOn(fs, "statSync").mockImplementation((targetPath, ...rest) => {
      if (
        path.resolve(targetPath) ===
        path.resolve(path.join(tmpRoot, "docs/swarmsy/enoent.md"))
      ) {
        const error = new Error("ENOENT: no such file or directory");
        error.code = "ENOENT";
        throw error;
      }

      return originalStatSync(targetPath, ...rest);
    });

    const status = getSwarmsyRequiredDocsStatus({
      manifest: {
        name: "ENOENT File",
        groups: [
          {
            id: "required",
            label: "Required Group",
            required: true,
            paths: ["docs/swarmsy/enoent.md"],
          },
        ],
      },
    });

    expect(status.groups[0].files[0]).toMatchObject({
      present: false,
      loadable: false,
    });
  });

  it("handles non-ENOENT stat failures as present but not loadable", () => {
    const tmpRoot = createTempRoot();
    process.env.SWARMSY_DOCTRINE_DOCS_ROOT = tmpRoot;
    writeDoc(tmpRoot, "docs/swarmsy/eacces.md", "blocked");

    const originalStatSync = fs.statSync;
    jest.spyOn(fs, "statSync").mockImplementation((targetPath, ...rest) => {
      if (
        path.resolve(targetPath) ===
        path.resolve(path.join(tmpRoot, "docs/swarmsy/eacces.md"))
      ) {
        const error = new Error("EACCES: permission denied");
        error.code = "EACCES";
        throw error;
      }

      return originalStatSync(targetPath, ...rest);
    });

    const status = getSwarmsyRequiredDocsStatus({
      manifest: {
        name: "EACCES File",
        groups: [
          {
            id: "required",
            label: "Required Group",
            required: true,
            paths: ["docs/swarmsy/eacces.md"],
          },
        ],
      },
    });

    expect(status.groups[0].files[0]).toMatchObject({
      present: true,
      loadable: false,
    });
  });

  it("marks empty files as not loadable", () => {
    const tmpRoot = createTempRoot();
    process.env.SWARMSY_DOCTRINE_DOCS_ROOT = tmpRoot;
    writeDoc(tmpRoot, "docs/swarmsy/empty.md", " \n\t");

    const status = getSwarmsyRequiredDocsStatus({
      manifest: {
        name: "Empty File",
        groups: [
          {
            id: "required",
            label: "Required Group",
            required: true,
            paths: ["docs/swarmsy/empty.md"],
          },
        ],
      },
    });

    expect(status.groups[0].files[0]).toMatchObject({
      present: true,
      loadable: false,
    });
  });

  it("marks non-empty files as loadable", () => {
    const tmpRoot = createTempRoot();
    process.env.SWARMSY_DOCTRINE_DOCS_ROOT = tmpRoot;
    writeDoc(tmpRoot, "docs/swarmsy/non-empty.md", "non-empty");

    const status = getSwarmsyRequiredDocsStatus({
      manifest: {
        name: "Non-empty File",
        groups: [
          {
            id: "required",
            label: "Required Group",
            required: true,
            paths: ["docs/swarmsy/non-empty.md"],
          },
        ],
      },
    });

    expect(status.groups[0].files[0]).toMatchObject({
      present: true,
      loadable: true,
    });
  });
});
