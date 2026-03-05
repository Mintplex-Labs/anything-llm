const path = require("path");
const fs = require("fs");
const { getType } = require("mime");
const { normalizePath, isWithin } = require(".");
const { EmbedConfig } = require("../../models/embedConfig");

function fetchEmbedLogo(logoPath) {
  if (!fs.existsSync(logoPath)) {
    return { found: false, buffer: null, size: 0, mime: "none/none" };
  }
  const mime = getType(logoPath);
  const buffer = fs.readFileSync(logoPath);
  return { found: true, buffer, size: buffer.length, mime };
}

function getEmbedLogosBasePath() {
  return process.env.STORAGE_DIR
    ? path.join(process.env.STORAGE_DIR, "assets/embed-logos")
    : path.join(__dirname, "../../storage/assets/embed-logos");
}

async function determineEmbedLogoFilepath(embedId) {
  const embed = await EmbedConfig.get({ id: Number(embedId) });
  if (!embed || !embed.visual_config) return null;

  let config;
  try {
    config = JSON.parse(embed.visual_config);
  } catch {
    return null;
  }

  const logoFilename = config.logoFilename || null;
  if (!logoFilename) return null;

  const basePath = getEmbedLogosBasePath();
  const logoPath = path.join(basePath, normalizePath(logoFilename));
  if (!isWithin(path.resolve(basePath), path.resolve(logoPath))) return null;
  if (!fs.existsSync(logoPath)) return null;
  return logoPath;
}

function deleteOldEmbedLogo(filename) {
  if (!filename) return;
  const basePath = getEmbedLogosBasePath();
  const filePath = path.join(basePath, normalizePath(filename));
  if (!isWithin(path.resolve(basePath), path.resolve(filePath))) return;
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

module.exports = {
  fetchEmbedLogo,
  getEmbedLogosBasePath,
  determineEmbedLogoFilepath,
  deleteOldEmbedLogo,
};
