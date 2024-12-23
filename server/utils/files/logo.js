const path = require("path");
const fs = require("fs");
const { getType } = require("mime");
const { v4 } = require("uuid");
const { SystemSettings } = require("../../models/systemSettings");
const { normalizePath, isWithin } = require(".");
const LOGO_FILENAME = "anything-llm.png";
const LOGO_FILENAME_DARK = "anything-llm-dark.png";

/**
 * Checks if the filename is the default logo filename for dark or light mode.
 * @param {string} filename - The filename to check.
 * @returns {boolean} Whether the filename is the default logo filename.
 */
function isDefaultFilename(filename) {
  return [LOGO_FILENAME, LOGO_FILENAME_DARK].includes(filename);
}

function validFilename(newFilename = "") {
  return !isDefaultFilename(newFilename);
}

/**
 * Shows the logo for the current theme. In dark mode, it shows the light logo
 * and vice versa.
 * @param {boolean} darkMode - Whether the logo should be for dark mode.
 * @returns {string} The filename of the logo.
 */
function getDefaultFilename(darkMode = true) {
  return darkMode ? LOGO_FILENAME : LOGO_FILENAME_DARK;
}

async function determineLogoFilepath(defaultFilename = LOGO_FILENAME) {
  const currentLogoFilename = await SystemSettings.currentLogoFilename();
  const basePath = process.env.STORAGE_DIR
    ? path.join(process.env.STORAGE_DIR, "assets")
    : path.join(__dirname, "../../storage/assets");
  const defaultFilepath = path.join(basePath, defaultFilename);

  if (currentLogoFilename && validFilename(currentLogoFilename)) {
    customLogoPath = path.join(basePath, normalizePath(currentLogoFilename));
    if (!isWithin(path.resolve(basePath), path.resolve(customLogoPath)))
      return defaultFilepath;
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
  const assetsDirectory = process.env.STORAGE_DIR
    ? path.join(process.env.STORAGE_DIR, "assets")
    : path.join(__dirname, `../../storage/assets`);
  const originalFilepath = path.join(
    assetsDirectory,
    normalizePath(originalFilename)
  );
  if (!isWithin(path.resolve(assetsDirectory), path.resolve(originalFilepath)))
    throw new Error("Invalid file path.");

  // The output always uses a random filename.
  const outputFilepath = process.env.STORAGE_DIR
    ? path.join(process.env.STORAGE_DIR, "assets", normalizePath(newFilename))
    : path.join(__dirname, `../../storage/assets`, normalizePath(newFilename));

  fs.renameSync(originalFilepath, outputFilepath);
  return newFilename;
}

async function removeCustomLogo(logoFilename = LOGO_FILENAME) {
  if (!logoFilename || !validFilename(logoFilename)) return false;
  const assetsDirectory = process.env.STORAGE_DIR
    ? path.join(process.env.STORAGE_DIR, "assets")
    : path.join(__dirname, `../../storage/assets`);

  const logoPath = path.join(assetsDirectory, normalizePath(logoFilename));
  if (!isWithin(path.resolve(assetsDirectory), path.resolve(logoPath)))
    throw new Error("Invalid file path.");
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
  isDefaultFilename,
  LOGO_FILENAME,
};
