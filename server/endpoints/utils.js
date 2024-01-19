const { SystemSettings } = require("../models/systemSettings");

function getGitVersion() {
  try {
    return require("child_process")
      .execSync("git rev-parse HEAD")
      .toString()
      .trim();
  } catch (e) {
    console.error("getGitVersion", e.message);
    return "--";
  }
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

async function convertToCSV(workspaceChatsMap) {
  const rows = ["role,content"];
  for (const workspaceChats of Object.values(workspaceChatsMap)) {
    for (const message of workspaceChats.messages) {
      // Escape double quotes and wrap content in double quotes
      const escapedContent = `"${message.content
        .replace(/"/g, '""')
        .replace(/\n/g, " ")}"`;
      rows.push(`${message.role},${escapedContent}`);
    }
  }
  return rows.join("\n");
}

async function convertToJSON(workspaceChatsMap) {
  const allMessages = [].concat.apply(
    [],
    Object.values(workspaceChatsMap).map((workspace) => workspace.messages)
  );
  return JSON.stringify(allMessages);
}

async function convertToJSONL(workspaceChatsMap) {
  return Object.values(workspaceChatsMap)
    .map((workspaceChats) => JSON.stringify(workspaceChats))
    .join("\n");
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

module.exports = {
  utilEndpoints,
  getGitVersion,
  convertToCSV,
  convertToJSON,
  convertToJSONL,
};
