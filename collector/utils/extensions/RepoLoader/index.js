/**
 * Dynamically load the correct repository loader from a specific platform
 * by default will return GitHub.
 * @param {('github'|'gitlab')} platform
 * @returns {import("./GithubRepo/RepoLoader")|import("./GitLabRepo/RepoLoader")} the repo loader class for provider
 */
function resolveRepoLoader(platform = "github") {
  switch (platform) {
    case "github":
      console.log(`Loading GitHub RepoLoader...`);
      return require("./GithubRepo/RepoLoader");
    case "gitlab":
      console.log(`Loading GitLab RepoLoader...`);
      return require("./GitLabRepo/RepoLoader");
    default:
      console.log(`Loading GitHub RepoLoader...`);
      return require("./GithubRepo/RepoLoader");
  }
}

/**
 * Dynamically load the correct repository loader function from a specific platform
 * by default will return Github.
 * @param {('github'|'gitlab')} platform
 * @returns {import("./GithubRepo")['fetchGithubFile'] | import("./GitLabRepo")['fetchGitLabFile']} the repo loader class for provider
 */
function resolveRepoLoaderFunction(platform = "github") {
  switch (platform) {
    case "github":
      console.log(`Loading GitHub loader function...`);
      return require("./GithubRepo").loadGithubRepo;
    case "gitlab":
      console.log(`Loading GitLab loader function...`);
      return require("./GitLabRepo").loadGitLabRepo;
    default:
      console.log(`Loading GitHub loader function...`);
      return require("./GithubRepo").loadGithubRepo;
  }
}

module.exports = { resolveRepoLoader, resolveRepoLoaderFunction };
