const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const server = path.resolve(__dirname, "../..");
const entrypoint = path.resolve(server, "../docker/docker-entrypoint.sh");
let fixture;

beforeEach(() => {
  fixture = fs.mkdtempSync(
    path.join(fs.realpathSync(os.tmpdir()), "anythingllm-docker-")
  );
  fs.cpSync(path.join(server, "prisma"), path.join(fixture, "prisma"), {
    recursive: true,
  });
  fs.mkdirSync(path.join(fixture, "utils"));
  fs.cpSync(
    path.join(server, "utils/prisma"),
    path.join(fixture, "utils/prisma"),
    {
      recursive: true,
    }
  );

  // Generate an isolated client against the same schema and migrations as Docker.
  fs.mkdirSync(path.join(fixture, "node_modules/@prisma"), { recursive: true });
  for (const dependency of ["@prisma/client", "dotenv", "prisma"]) {
    const packageDir = path.dirname(
      require.resolve(`${dependency}/package.json`)
    );
    const target = path.join(fixture, "node_modules", dependency);
    if (dependency === "@prisma/client") {
      fs.cpSync(packageDir, target, { recursive: true });
    } else {
      fs.symlinkSync(packageDir, target, "dir");
    }
  }
  fs.mkdirSync(path.join(fixture, "node_modules/.bin"));
  fs.symlinkSync(
    "../prisma/build/index.js",
    path.join(fixture, "node_modules/.bin/prisma")
  );
  fs.writeFileSync(
    path.join(fixture, "package.json"),
    JSON.stringify({ private: true })
  );

  // Map the image's absolute paths onto the fixture and replace the services.
  // The server probe uses the real application Prisma singleton after migration.
  fs.writeFileSync(
    path.join(fixture, "image-paths.sh"),
    `
cd() {
  if [[ "$1" == /app/server/ ]]; then
    builtin cd "$SERVER_FIXTURE"
  else
    builtin cd "$@"
  fi
}
node() {
  case "$1" in
    /app/server/index.js) command node ./probe.js ;;
    /app/collector/index.js) exec sleep 60 ;;
    *) command node "$@" ;;
  esac
}
trap 'for job in $(jobs -pr); do kill "$job" 2>/dev/null; done' EXIT
`
  );
  fs.writeFileSync(
    path.join(fixture, "probe.js"),
    `
require("dotenv").config();
const prisma = require("./utils/prisma");
async function probe() {
  try {
    const [{ file }] = await prisma.$queryRaw\`PRAGMA database_list\`;
    const label = "docker-storage-probe";
    const previous = await prisma.system_settings.findUnique({ where: { label } });
    if (!previous) {
      await prisma.system_settings.create({ data: { label, value: "persisted" } });
    }
    require("fs").writeFileSync("probe.json", JSON.stringify({
      file,
      previous: previous?.value ?? null,
    }));
  } finally {
    await prisma.$disconnect();
  }
}
probe().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
`
  );
});

afterEach(() => fs.rmSync(fixture, { recursive: true, force: true }));

function startDocker(storageDir) {
  const env = {
    ...process.env,
    SERVER_FIXTURE: fixture,
    NODE_ENV: "production",
  };
  delete env.ANYTHINGLLM_SQLITE_URL;
  delete env.STORAGE_DIR;
  if (storageDir !== undefined) env.STORAGE_DIR = storageDir;
  env.BASH_ENV = path.join(fixture, "image-paths.sh");
  execFileSync("bash", [entrypoint], { cwd: fixture, env, timeout: 30000 });
  return JSON.parse(fs.readFileSync(path.join(fixture, "probe.json"), "utf8"));
}

describe("Docker SQLite storage", () => {
  it("uses the mounted STORAGE_DIR for migrations and server queries", () => {
    const mounted = path.join(fixture, "mounted storage");
    fs.mkdirSync(mounted);
    fs.writeFileSync(path.join(fixture, ".env"), "STORAGE_DIR=storage\n");
    const database = path.join(mounted, "anythingllm.db");
    expect(startDocker(mounted)).toEqual({ file: database, previous: null });
    expect(fs.existsSync(database)).toBe(true);
    expect(fs.existsSync(path.join(fixture, "storage/anythingllm.db"))).toBe(
      false
    );
    expect(startDocker(mounted)).toEqual({
      file: database,
      previous: "persisted",
    });
  });

  it("reads STORAGE_DIR from the mounted .env file", () => {
    const mounted = path.join(fixture, "mounted storage");
    fs.mkdirSync(mounted);
    fs.writeFileSync(
      path.join(fixture, ".env"),
      'STORAGE_DIR="mounted storage"\n'
    );
    expect(startDocker().file).toBe(path.join(mounted, "anythingllm.db"));
  });

  it.each([undefined, "storage"])(
    "uses the original database when STORAGE_DIR is %s",
    (storageDir) => {
      const database = path.join(fixture, "storage/anythingllm.db");
      fs.mkdirSync(path.dirname(database));
      expect(startDocker().file).toBe(database);
      expect(startDocker(storageDir)).toEqual({
        file: database,
        previous: "persisted",
      });
    }
  );
});
