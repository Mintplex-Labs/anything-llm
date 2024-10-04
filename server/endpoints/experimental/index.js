const { fineTuningEndpoints } = require("./fineTuning");
const { liveSyncEndpoints } = require("./liveSync");
const { importedAgentPluginEndpoints } = require("./imported-agent-plugins");

// All endpoints here are not stable and can move around - have breaking changes
// or are opt-in features that are not fully released.
// When a feature is promoted it should be removed from here and added to the appropriate scope.
function experimentalEndpoints(router) {
  liveSyncEndpoints(router);
  fineTuningEndpoints(router);
  importedAgentPluginEndpoints(router);
}

module.exports = { experimentalEndpoints };
