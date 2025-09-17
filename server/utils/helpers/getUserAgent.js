const { getDeploymentVersion } = require("../../endpoints/utils");

function getAnythingLLMUserAgent() {
  const version = getDeploymentVersion() || "VERSION_NOT_FOUND";
  return `AnythingLLM/${version}`;
}

module.exports = {
  getAnythingLLMUserAgent,
};
