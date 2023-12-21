const path = require("path");
const fs = require("fs");
const { getType } = require("mime");
const { v4 } = require("uuid");
const { SystemSettings } = require("../../models/systemSettings");
const LOGO_FILENAME = "anything-llm.png";

function validFilename(newFilename = "") {
  return ![LOGO_FILENAME].includes(newFilename);
}

function getDefaultFilename() {
  return LOGO_FILENAME;
}

async function determineLogoFilepath(defaultFilename = LOGO_FILENAME) {
  const currentLogoFilename = await SystemSettings.currentLogoFilename();
  const basePath = process.env.STORAGE_DIR
    ? path.join(process.env.STORAGE_DIR, "assets")
    : path.join(__dirname, "../../storage/assets");
  const defaultFilepath = path.join(basePath, defaultFilename);

  if (currentLogoFilename && validFilename(currentLogoFilename)) {
    customLogoPath = path.join(basePath, currentLogoFilename);
    return fs.existsSync(customLogoPath) ? customLogoPath : defaultFilepath;
  }

  return defaultFilepath;
}

function fetchLogo(logoPath) {
  if (!fs.existsSync(logoPath)) {
    return {
      found: false,
      buffer: null,
      size: 0,
      mime: "none/none",
    };
  }

  const mime = getType(logoPath);
  const buffer = fs.readFileSync(logoPath);
  return {
    found: true,
    buffer,
    size: buffer.length,
    mime,
  };
}

async function renameLogoFile(originalFilename = null) {
  const extname = path.extname(originalFilename) || ".png";
  const newFilename = `${v4()}${extname}`;
  const originalFilepath = process.env.STORAGE_DIR
    ? path.join(process.env.STORAGE_DIR, "assets", originalFilename)
    : path.join(__dirname, `../../storage/assets/${originalFilename}`);
  const outputFilepath = process.env.STORAGE_DIR
    ? path.join(process.env.STORAGE_DIR, "assets", newFilename)
    : path.join(__dirname, `../../storage/assets/${newFilename}`);

  fs.renameSync(originalFilepath, outputFilepath);
  return newFilename;
}

async function removeCustomLogo(logoFilename = LOGO_FILENAME) {
  if (!logoFilename || !validFilename(logoFilename)) return false;
  const logoPath = process.env.STORAGE_DIR
    ? path.join(process.env.STORAGE_DIR, `assets/${logoFilename}`)
    : path.join(__dirname, `../../storage/assets/${logoFilename}`);
  if (fs.existsSync(logoPath)) fs.unlinkSync(logoPath);
  return true;
}

module.exports = {
  fetchLogo,
  renameLogoFile,
  removeCustomLogo,
  validFilename,
  getDefaultFilename,
  determineLogoFilepath,
  LOGO_FILENAME,
};
