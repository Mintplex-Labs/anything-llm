/**
 * Where this instance is running, from the ANYTHING_LLM_RUNTIME environment variable.
 * - "docker": set by the Dockerfile.
 * - "cloud": set by the launcher on AnythingLLM Cloud instances.
 * Unset on bare metal installs.
 */

function isDocker() {
  return process.env.ANYTHING_LLM_RUNTIME === "docker";
}

function isCloud() {
  return process.env.ANYTHING_LLM_RUNTIME === "cloud";
}

module.exports = { isDocker, isCloud };
