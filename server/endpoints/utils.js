const { SystemSettings } = require("../models/systemSettings");

function getGitVersion() {
  return require("child_process")
    .execSync("git rev-parse HEAD")
    .toString()
    .trim();
}

function byteToGigaByte(n) {
  return n / Math.pow(10, 9);
}

async function getDiskStorage() {
  try {
    const checkDiskSpace = require("check-disk-space").default;
    const { free, size } = await checkDiskSpace("/");
    return {
      current: Math.floor(byteToGigaByte(free)),
      capacity: Math.floor(byteToGigaByte(size)),
    };
  } catch {
    return {
      current: null,
      capacity: null,
    };
  }
}

function utilEndpoints(app) {
  if (!app) return;

  app.get("/utils/metrics", async (_, response) => {
    try {
      const metrics = {
        online: true,
        version: getGitVersion(),
        mode: (await SystemSettings.isMultiUserMode())
          ? "multi-user"
          : "single-user",
        vectorDB: process.env.VECTOR_DB || "lancedb",
        storage: await getDiskStorage(),
      };
      response.status(200).json(metrics);
    } catch (e) {
      console.error(e);
      response.sendStatus(500).end();
    }
  });
}

module.exports = { utilEndpoints, getGitVersion };
