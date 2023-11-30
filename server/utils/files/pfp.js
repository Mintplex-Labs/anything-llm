const path = require("path");
const fs = require("fs");
const { getType } = require("mime");
const { User } = require("../../models/user");

function fetchPfp(pfpPath) {
  const mime = getType(pfpPath);
  const buffer = fs.readFileSync(pfpPath);
  return {
    buffer,
    size: buffer.length,
    mime,
  };
}

async function determinePfpFilepath(id) {
  const numberId = Number(id);
  const user = await User.get({ id: numberId });
  const pfpFilename = user.pfpFilename;
  if (!pfpFilename) return null;
  const basePath = path.join(__dirname, "../../storage/assets/pfp");
  const pfpFilepath = path.join(basePath, pfpFilename);

  if (pfpFilename && fs.existsSync(pfpFilepath)) {
    return pfpFilepath;
  }

  return null;
}

module.exports = {
  fetchPfp,
  determinePfpFilepath,
};
