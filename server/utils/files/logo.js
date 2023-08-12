const path = require("path");
const fs = require("fs");
const { getType } = require("mime");
const { v4 } = require("uuid");
const { SystemSettings } = require("../../models/systemSettings");
const LIGHT_LOGO_FILENAME = "anything-llm-light.png";
const DARK_LOGO_FILENAME = "anything-llm-dark.png";

function validFilename(newFilename = "") {
  return ![DARK_LOGO_FILENAME, LIGHT_LOGO_FILENAME].includes(newFilename);
}

function getDefaultFilename(mode = "dark") {
  return mode === "light" ? DARK_LOGO_FILENAME : LIGHT_LOGO_FILENAME;
}

async function determineLogoFilepath(defaultFilename = DARK_LOGO_FILENAME) {
  const currentLogoFilename = await SystemSettings.currentLogoFilename();
  const basePath = path.join(__dirname, "../../storage/assets");
  const defaultFilepath = path.join(basePath, defaultFilename);

  if (currentLogoFilename && validFilename(currentLogoFilename)) {
    customLogoPath = path.join(basePath, currentLogoFilename);
    return fs.existsSync(customLogoPath) ? customLogoPath : defaultFilepath;
  }

  return defaultFilepath;
}

function fetchLogo(logoPath) {
  const mime = getType(logoPath);
  const buffer = fs.readFileSync(logoPath);
  return {
    buffer,
    size: buffer.length,
    mime,
  };
}

async function renameLogoFile(originalFilename = null) {
  const extname = path.extname(originalFilename) || ".png";
  const newFilename = `${v4()}${extname}`;
  const originalFilepath = path.join(
    __dirname,
    `../../storage/assets/${originalFilename}`
  );
  const outputFilepath = path.join(
    __dirname,
    `../../storage/assets/${newFilename}`
  );

  fs.renameSync(originalFilepath, outputFilepath);
  return newFilename;
}

async function removeCustomLogo(logoFilename = DARK_LOGO_FILENAME) {
  if (!logoFilename || !validFilename(logoFilename)) return false;
  const logoPath = path.join(__dirname, `../../storage/assets/${logoFilename}`);
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
  LIGHT_LOGO_FILENAME,
  DARK_LOGO_FILENAME,
};
