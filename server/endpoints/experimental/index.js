const { liveSyncEndpoints } = require("./liveSync");

// All endpoints here are not stable and can move around - have breaking changes
// or are opt-in features that are not fully released.
// When a feature is promoted it should be removed from here and added to the appropriate scope.
function experimentalEndpoints(router) {
  liveSyncEndpoints(router);
}

module.exports = { experimentalEndpoints };
