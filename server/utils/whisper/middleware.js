const fs = require("fs");
const path = require("path");
const { Readable } = require("stream");
const { pipeline } = require("stream/promises");
const XENOVA_ASSETS_PATH =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, "../../storage/models/Xenova/wasm")
    : path.resolve(process.env.STORAGE_DIR, `models`, "Xenova", "wasm");
const XENOVA_MODELS_PATH =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, "../../storage/models")
    : path.resolve(process.env.STORAGE_DIR, `models`);

const BUCKET_BASE =
  "https://s3.us-west-1.amazonaws.com/public.useanything.com/support/whisperstt";

const AVAILABLE_WASM_FILES = ["ort-wasm-simd.wasm"];

async function downloadFromStorage(url, outputPath) {
  console.log(
    `WhisperSTTStatic: Downloading WhisperWorkerSTT WASM file one-time from ${url}...`
  );

  const headers = new Headers();
  headers.set("User-Agent", `anythingllm-desktop/; is_ci/false;`);

  const response = await fetch(url, { headers });
  if (!response.ok) {
    console.error(
      `WhisperSTTStatic: Failed to get valid 200 response from ${url}. File will fail to download.`
    );
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const fileStream = fs.createWriteStream(outputPath);
  await pipeline(Readable.fromWeb(response.body), fileStream);
  console.log(`WhisperSTTStatic: Download success!`);
  return true;
}

// Runs a pre-flight check for a given wasm file if it exists. If not, we will download the required
// asset to the user storage so we can retrieve is locally.
async function whisperAssetExists(request, response, next) {
  const filepath = request.url.slice(1); // eg: /ort-wasm-simd.wasm
  if (!AVAILABLE_WASM_FILES.includes(filepath))
    return response.sendStatus(404).end();

  const fileLocation = path.join(XENOVA_ASSETS_PATH, filepath);
  if (fs.existsSync(fileLocation)) return next();

  fs.mkdirSync(path.dirname(fileLocation), { recursive: true });
  const success = await downloadFromStorage(
    `${BUCKET_BASE}/wasm/${filepath}`,
    fileLocation
  ).catch(() => false);

  if (!success) return response.sendStatus(404).end();
  next();
}

// Runs a pre-flight check for a given model file if it exists. If not, we will download the required
// model from HF to the user storage so we can retrieve it locally later. This basically simulates
// what transformers does for pipeline loading without using the library.
async function whisperModelExists(request, response, next) {
  const url = request.url.slice(1); // eg: /Xenova/whisper-tiny.en/<asset/onnx>.file
  const [author, model, ...rest] = url.split("/");

  const fileLocation = path.join(XENOVA_MODELS_PATH, ...url.split("/"));
  if (fs.existsSync(fileLocation)) return next();

  fs.mkdirSync(path.dirname(fileLocation), { recursive: true });
  const assetUrl = `https://huggingface.co/${author}/${model}/resolve/main/${rest.join("/")}`;
  const success = await downloadFromStorage(assetUrl, fileLocation).catch(
    () => false
  );
  if (!success) return response.sendStatus(404).end();
  next();
}

module.exports = {
  whisperAssetExists,
  whisperModelExists,
  XENOVA_ASSETS_PATH,
};
