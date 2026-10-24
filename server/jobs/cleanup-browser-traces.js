const { log, conclude } = require("./helpers/index.js");
const {
  BrowserTraces,
} = require("../utils/agents/aibitat/plugins/browser-use/traces.js");

// Browser Use session screenshots are only for reviewing recent sessions - drop the old ones.
(async () => {
  try {
    const pruned = BrowserTraces.pruneThumbnails();
    if (pruned)
      log(`Removed old screenshots from ${pruned} browser use session(s).`);
  } catch (error) {
    console.error(error);
    log(`Error during cleanup: ${error.message}`);
  } finally {
    conclude();
  }
})();
