const fs = require("fs");
const path = require("path");
const {
  buildArchiveCommand,
} = require("../../../desktop/scripts/package-windows-artifact.cjs");
const {
  requiresFullBuild,
} = require("../../../desktop/scripts/desktop-artifact-change-scope.cjs");

const workflowPath = path.resolve(
  __dirname,
  "../../../.github/workflows/desktop-artifact-build.yml"
);

function packageFixture(overrides = {}) {
  return {
    version: "1.13.0",
    dependencies: {},
    devDependencies: {
      concurrently: "^9.1.2",
      jest: "^29.7.0",
    },
    scripts: {
      setup: "old setup",
      dev: "yarn dev:all",
      "desktop:smoke": "node desktop/scripts/desktop-smoke-check.cjs",
      "desktop:artifact:package:win":
        "node desktop/scripts/package-windows-artifact.cjs",
    },
    ...overrides,
  };
}

describe("desktop artifact CI performance gates", () => {
  it("skips the full artifact for documentation and non-packaging package metadata", () => {
    const basePackage = packageFixture();
    const headPackage = packageFixture({
      description: "Updated repository truth",
      packageManager: "yarn@1.22.22",
      scripts: {
        ...basePackage.scripts,
        setup: "npm ci && install services",
      },
    });

    expect(
      requiresFullBuild({
        eventName: "pull_request",
        files: [
          "README.md",
          "docs/swarmsy/local-user/SWARMSY_LOCAL_USER_ROADMAP.md",
          "package.json",
        ],
        basePackage,
        headPackage,
      })
    ).toBe(false);
  });

  it("runs the full artifact when root dependencies change", () => {
    const basePackage = packageFixture();
    const headPackage = packageFixture({
      devDependencies: {
        ...basePackage.devDependencies,
        electron: "33.4.11",
      },
    });

    expect(
      requiresFullBuild({
        files: ["package.json", "package-lock.json"],
        basePackage,
        headPackage,
      })
    ).toBe(true);
  });

  it("runs the full artifact when desktop package scripts change", () => {
    const basePackage = packageFixture();
    const headPackage = packageFixture({
      scripts: {
        ...basePackage.scripts,
        "desktop:artifact:package:win": "node desktop/scripts/new-packager.cjs",
      },
    });

    expect(
      requiresFullBuild({
        files: ["package.json"],
        basePackage,
        headPackage,
      })
    ).toBe(true);
  });

  it.each([
    "desktop/scripts/package-windows-artifact.cjs",
    "frontend/src/main.jsx",
    "server/index.js",
    ".github/workflows/desktop-artifact-build.yml",
    "package-lock.json",
  ])("runs the full artifact for packaging-impacting path %s", (changedPath) => {
    expect(
      requiresFullBuild({
        files: [changedPath],
        basePackage: packageFixture(),
        headPackage: packageFixture(),
      })
    ).toBe(true);
  });

  it("uses only fast validation for collector-only changes", () => {
    expect(
      requiresFullBuild({
        files: ["collector/index.js"],
        basePackage: packageFixture(),
        headPackage: packageFixture(),
      })
    ).toBe(false);
  });

  it("always runs the full artifact for manual dispatch", () => {
    expect(
      requiresFullBuild({
        eventName: "workflow_dispatch",
        files: [],
      })
    ).toBe(true);
  });

  it("uses tar.exe instead of PowerShell Compress-Archive on Windows", () => {
    const command = buildArchiveCommand({
      platform: "win32",
      packageDirectory: "C:\\artifact\\app",
      archivePath: "C:\\artifact\\app.zip",
    });

    expect(command.command).toBe("tar.exe");
    expect(command.args).toEqual([
      "-a",
      "-c",
      "-f",
      "C:\\artifact\\app.zip",
      "-C",
      "C:\\artifact\\app",
      ".",
    ]);
    expect(command.args.join(" ")).not.toContain("Compress-Archive");
  });

  it("keeps fast validation required while conditionally skipping only packaging", () => {
    const workflow = fs.readFileSync(workflowPath, "utf8");

    expect(workflow).toContain("name: Determine desktop artifact scope");
    expect(workflow).toContain("name: Validate desktop artifact inputs");
    expect(workflow).toContain(
      "if: needs.artifact-scope.outputs.full_build == 'true'"
    );
    expect(workflow).toContain(
      "yarn install --frozen-lockfile --production=true"
    );
    expect(workflow).not.toContain("Install collector dependencies");
    expect(workflow).toContain("Package desktop app with fast archive path");
  });
});
