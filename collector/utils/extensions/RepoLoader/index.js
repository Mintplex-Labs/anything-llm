/**
 * Dynamically load the correct repository loader from a specific platform
 * by default will return GitHub.
 * @param {('github'|'gitlab')} platform
 * @returns {import("./GitHubRepo/RepoLoader")|import("./GitlabRepo/RepoLoader")} the repo loader class for provider
 */
function resolveRepoLoader(platform = "github") {
  switch (platform) {
    case "github":
      console.log(`Loading GitHub RepoLoader...`);
      return require("./GitHubRepo/RepoLoader");
    case "gitlab":
      console.log(`Loading GitLab RepoLoader...`);
      return require("./GitlabRepo/RepoLoader");
    default:
      console.log(`Loading GitHub RepoLoader...`);
      return require("./GitHubRepo/RepoLoader");
  }
}

/**
 * Dynamically load the correct repository loader function from a specific platform
 * by default will return GitHub.
 * @param {('github'|'gitlab')} platform
 * @returns {import("./GitHubRepo")['fetchGitHubFile'] | import("./GitlabRepo")['fetchGitlabFile']} the repo loader class for provider
 */
function resolveRepoLoaderFunction(platform = "github") {
  switch (platform) {
    case "github":
      console.log(`Loading GitHub loader function...`);
      return require("./GitHubRepo").loadGitHubRepo;
    case "gitlab":
      console.log(`Loading GitLab loader function...`);
      return require("./GitlabRepo").loadGitlabRepo;
    default:
      console.log(`Loading GitHub loader function...`);
      return require("./GitHubRepo").loadGitHubRepo;
  }
}

module.exports = { resolveRepoLoader, resolveRepoLoaderFunction };
