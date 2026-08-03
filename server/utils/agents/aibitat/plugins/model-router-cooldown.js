/**
 * Plugin to restart the model router cooldown when an agent stops responding.
 *
 * Chat flows get this for free - the router wraps its delegate provider so the
 * sticky route is re-stamped when the stream drains. Agents cannot: aibitat
 * instantiates its own provider from the resolved route, so the router object
 * is never on the inference path.
 *
 * `interrupt` fires at the end of each turn (the agent is now waiting on the
 * next prompt from the socket) and `terminate` fires when the loop exits, so
 * every turn re-stamps rather than only the first.
 */
const modelRouterCooldown = {
  name: "model-router-cooldown",
  startupConfig: {
    params: {},
  },
  plugin: function (onInferenceComplete = () => null) {
    return {
      name: this.name,
      setup: function (aibitat) {
        aibitat.onInterrupt(() => onInferenceComplete());
        aibitat.onTerminate(() => onInferenceComplete());
      },
    };
  },
};

module.exports = { modelRouterCooldown };
