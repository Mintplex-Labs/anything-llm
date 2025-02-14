const fs = require("fs");

const processFile = async (
  filePath,
  mode = "speed",
  langs = ["eng"],
  runDir = null
) => {
  const { default: scribe } = await import("scribe.js-ocr");
  // Change directory to the run directory if it is provided
  // This will allow the traineddata files to be persisted in storage
  // and not be deleted after the worker is done or the app is killed.
  // If not defined this will wind up pulling the traineddata files into the current
  // directory of the worker (collector/index.js) and will cause subsequent runs to be slower.
  if (runDir) {
    if (!fs.existsSync(runDir)) fs.mkdirSync(runDir, { recursive: true });
    process.chdir(runDir);
  }

  try {
    await scribe.importFiles([filePath]);
    const textContent = await scribe
      .recognize({ mode, langs })
      .then(() => scribe.exportData("text"));

    return { textContent };
  } catch (e) {
    return { error: e.message };
  } finally {
    scribe.terminate();
  }
};

process.on(
  "message",
  async ({ filePath, mode = "speed", langs = ["eng"], runDir = null }) => {
    const result = await processFile(filePath, mode, langs, runDir);
    process.send(result);
    process.exit(0);
  }
);
