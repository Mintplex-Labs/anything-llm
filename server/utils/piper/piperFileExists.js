const fs = require("fs");
const path = require("path");
const { Readable } = require("stream");
const { pipeline } = require("stream/promises");
const PIPER_ASSETS_PATH =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, "../../storage/models/pipertts")
    : path.resolve(process.env.STORAGE_DIR, `pipertts`);

const BUCKET_BASE =
  "https://s3.us-west-1.amazonaws.com/public.useanything.com/support/pipertts";
const AVAILABLE_FILES = [
  "piper_phonemize.data",
  "piper_phonemize.wasm",
  "ort/ort-wasm-simd.wasm",
];

async function downloadFromStorage(url, outputPath) {
  console.log(
    `PiperTTSStatic: Downloading PiperTTS file one-time from ${url}...`
  );
  const response = await fetch(url);
  if (!response.ok) {
    console.error(
      `PiperTTSStatic: Failed to get valid 200 response from ${url}. File will fail to download.`
    );
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const fileStream = fs.createWriteStream(outputPath);
  await pipeline(Readable.fromWeb(response.body), fileStream);
  console.log(`PiperTTSStatic: Download success!`);
  return true;
}

// Runs a pre-flight check for a given piper file if it exists. Only specific files are cached by the app
// and this is defined via the baseURL override for @mintplex-labs/piper-tts-web package.
// This middleware will passthrough or download and continue for a file so it resolves properly.
async function piperFileExists(request, response, next) {
  const filepath = request.url.slice(1); // eg: /ort/...wasm;
  if (!AVAILABLE_FILES.includes(filepath))
    return response.sendStatus(404).end();

  const fileLocation = path.join(PIPER_ASSETS_PATH, filepath);
  if (fs.existsSync(fileLocation)) return next();

  fs.mkdirSync(path.dirname(fileLocation), { recursive: true });
  const success = await downloadFromStorage(
    `${BUCKET_BASE}/${filepath}`,
    fileLocation
  ).catch(() => false);

  if (!success) return response.sendStatus(404).end();
  next();
}

module.exports = {
  piperFileExists,
  PIPER_ASSETS_PATH,
};
