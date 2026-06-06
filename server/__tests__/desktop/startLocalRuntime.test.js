const fs = require("fs");
const os = require("os");
const path = require("path");

const repoRoot = path.resolve(__dirname, "../../..");
const runtimePath = path.join(
  repoRoot,
  "desktop/runtime/start-local-runtime.cjs"
);

function makeExecutable(targetPath, contents = "#!/bin/sh\nexit 0\n") {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, contents, { mode: 0o755 });
}

describe("packaged desktop local runtime entrypoint", () => {
  it("resolves persistent runtime data outside the managed app copy", () => {
    const { resolveRuntimeDataRoot } = require(runtimePath);
    const serverRoot = path.join("/tmp", "managed-local-runtime", "app", "server");

    expect(
      resolveRuntimeDataRoot(serverRoot, {
        env: { SWARMSY_DESKTOP_USER_DATA_DIR: "/tmp/swarmsy-user" },
      })
    ).toBe(path.join("/tmp/swarmsy-user", "local-user-data", "runtime"));

    expect(
      resolveRuntimeDataRoot(serverRoot, {
        env: { SWARMSY_DESKTOP_MANAGED_RUNTIME_DIR: "/tmp/managed" },
      })
    ).toBe(path.join("/tmp/managed", "local-user-data", "runtime"));

    expect(resolveRuntimeDataRoot(serverRoot, { env: {} })).toBe(
      path.join(serverRoot, "storage")
    );
  });

  it("resolves platform-tolerant Prisma shims", () => {
    const { resolvePrismaBin } = require(runtimePath);
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "swarmsy-prisma-"));
    const binDir = path.join(root, "node_modules", ".bin");

    makeExecutable(path.join(binDir, "prisma.ps1"), "");
    expect(resolvePrismaBin(root, { platform: "win32" })).toBe(
      path.join(binDir, "prisma.ps1")
    );

    makeExecutable(path.join(binDir, "prisma.cmd"), "");
    expect(resolvePrismaBin(root, { platform: "win32" })).toBe(
      path.join(binDir, "prisma.cmd")
    );

    fs.rmSync(path.join(binDir, "prisma.cmd"), { force: true });
    fs.rmSync(path.join(binDir, "prisma.ps1"), { force: true });
    makeExecutable(path.join(binDir, "prisma"));
    expect(resolvePrismaBin(root, { platform: "linux" })).toBe(
      path.join(binDir, "prisma")
    );
  });

  it("runs PowerShell Prisma shims through powershell.exe", () => {
    const { run } = require(runtimePath);
    const spawnSyncImpl = jest.fn(() => ({ status: 0 }));

    const prismaPs1 = path.win32.join("C:\\app", "node_modules", ".bin", "prisma.ps1");
    run(prismaPs1, ["migrate", "deploy"], {
      platform: "win32",
      spawnSyncImpl,
      cwd: "C:\\app",
    });

    expect(spawnSyncImpl).toHaveBeenCalledWith(
      "powershell.exe",
      [
        "-NoProfile",
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        prismaPs1,
        "migrate",
        "deploy",
      ],
      expect.objectContaining({ shell: false, cwd: "C:\\app" })
    );
  });

  it("runs Windows cmd Prisma shims through cmd shell", () => {
    const { run } = require(runtimePath);
    const spawnSyncImpl = jest.fn(() => ({ status: 0 }));

    const prismaCmd = path.win32.join("C:\\app", "node_modules", ".bin", "prisma.cmd");
    run(prismaCmd, ["db", "seed"], {
      platform: "win32",
      spawnSyncImpl,
    });

    expect(spawnSyncImpl).toHaveBeenCalledWith(
      prismaCmd,
      ["db", "seed"],
      expect.objectContaining({ shell: true })
    );
  });

  it("initializes local storage and preserves secrets outside app code", () => {
    const { initializeLocalRuntime } = require(runtimePath);
    const serverRoot = fs.mkdtempSync(path.join(os.tmpdir(), "swarmsy-server-"));
    const userData = fs.mkdtempSync(path.join(os.tmpdir(), "swarmsy-user-"));
    makeExecutable(path.join(serverRoot, "node_modules", ".bin", "prisma"));

    const env = { SWARMSY_DESKTOP_USER_DATA_DIR: userData };
    initializeLocalRuntime(serverRoot, { env });

    const runtimeRoot = path.join(userData, "local-user-data", "runtime");
    const jwtPath = path.join(runtimeRoot, "local-runtime.jwt");
    const firstJwt = fs.readFileSync(jwtPath, "utf8");

    expect(env.STORAGE_DIR).toBe(runtimeRoot);
    expect(env.DATABASE_URL).toBe(
      `file:${path.join(runtimeRoot, "anythingllm.db").replace(/\\/g, "/")}`
    );
    expect(fs.existsSync(path.join(runtimeRoot, "documents"))).toBe(true);
    expect(fs.existsSync(path.join(runtimeRoot, "vector-cache"))).toBe(true);
    expect(fs.existsSync(path.join(runtimeRoot, "assets"))).toBe(true);
    expect(fs.existsSync(path.join(serverRoot, "storage"))).toBe(false);
    expect(env.DATABASE_URL.includes(serverRoot.replace(/\\/g, "/"))).toBe(
      false
    );

    initializeLocalRuntime(serverRoot, { env });
    expect(fs.readFileSync(jwtPath, "utf8")).toBe(firstJwt);
  });

  it("throws a clear error when no Prisma shim is bundled", () => {
    const { initializeLocalRuntime } = require(runtimePath);
    const serverRoot = fs.mkdtempSync(path.join(os.tmpdir(), "swarmsy-server-"));

    expect(() =>
      initializeLocalRuntime(serverRoot, {
        env: { SWARMSY_DESKTOP_USER_DATA_DIR: os.tmpdir() },
      })
    ).toThrow(/Bundled Prisma CLI is missing under/);
  });
});
