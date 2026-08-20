/**
 * Dynamically load the correct repository loader from a specific platform
 * by default will return GitHub.
 * @param {('github'|'gitlab'|'gitea')} platform
 * @returns {import("./GithubRepo/RepoLoader")|import("./GitlabRepo/RepoLoader")|import("./GiteaRepo/RepoLoader")} the repo loader class for provider
 */
function resolveRepoLoader(platform = "github") {
  switch (platform) {
    case "github":
      console.log(`Loading GitHub RepoLoader...`);
      return require("./GithubRepo/RepoLoader");
    case "gitlab":
      console.log(`Loading GitLab RepoLoader...`);
      return require("./GitlabRepo/RepoLoader");
    case "gitea":
      console.log(`Loading Gitea RepoLoader...`);
      return require("./GiteaRepo/RepoLoader");
    default:
      console.log(`Loading GitHub RepoLoader...`);
      return require("./GithubRepo/RepoLoader");
  }
}

/**
 * Dynamically load the correct repository loader function from a specific platform
 * by default will return Github.
 * @param {('github'|'gitlab'|'gitea')} platform
 * @returns {import("./GithubRepo")['fetchGithubFile'] | import("./GitlabRepo")['fetchGitlabFile'] | import("./GiteaRepo")['fetchGiteaFile']} the repo loader class for provider
 */
function resolveRepoLoaderFunction(platform = "github") {
  switch (platform) {
    case "github":
      console.log(`Loading GitHub loader function...`);
      return require("./GithubRepo").loadGithubRepo;
    case "gitlab":
      console.log(`Loading GitLab loader function...`);
      return require("./GitlabRepo").loadGitlabRepo;
    case "gitea":
      console.log(`Loading Gitea loader function...`);
      return require("./GiteaRepo").loadGiteaRepo;
    default:
      console.log(`Loading GitHub loader function...`);
      return require("./GithubRepo").loadGithubRepo;
  }
}

module.exports = { resolveRepoLoader, resolveRepoLoaderFunction };
