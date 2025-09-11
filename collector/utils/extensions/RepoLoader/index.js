/**
 * Dynamically load the correct repository loader from a specific platform
 * by default will return GitHub.
 * @param {('github'|'gitlab'|'azuredevops')} platform
 * @returns {import("./GithubRepo/RepoLoader")|import("./GitlabRepo/RepoLoader")|import("./AzureDevOpsRepo/RepoLoader")} the repo loader class for provider
 */
function resolveRepoLoader(platform = "github") {
  switch (platform) {
    case "github":
      console.log(`Loading GitHub RepoLoader...`);
      return require("./GithubRepo/RepoLoader");
    case "gitlab":
      console.log(`Loading GitLab RepoLoader...`);
      return require("./GitlabRepo/RepoLoader");
    case "azuredevops":
      console.log(`Loading Azure DevOps RepoLoader...`);
      return require("./AzureDevOpsRepo/RepoLoader");
    default:
      console.log(`Loading GitHub RepoLoader...`);
      return require("./GithubRepo/RepoLoader");
  }
}

/**
 * Dynamically load the correct organization loader from a specific platform
 * @param {('azuredevops')} platform
 * @returns {import("./AzureDevOpsRepo/OrgLoader")} the org loader class for provider
 */
function resolveOrgLoader(platform = "azuredevops") {
  switch (platform) {
    case "azuredevops":
      console.log(`Loading Azure DevOps OrgLoader...`);
      return require("./AzureDevOpsRepo/OrgLoader");
    default:
      throw new Error(`Organization loading not supported for platform: ${platform}`);
  }
}

/**
 * Dynamically load the correct repository loader function from a specific platform
 * by default will return Github.
 * @param {('github'|'gitlab'|'azuredevops')} platform
 * @returns {import("./GithubRepo")['fetchGithubFile'] | import("./GitlabRepo")['fetchGitlabFile'] | import("./AzureDevOpsRepo")['fetchAzureDevOpsFile']} the repo loader class for provider
 */
function resolveRepoLoaderFunction(platform = "github") {
  switch (platform) {
    case "github":
      console.log(`Loading GitHub loader function...`);
      return require("./GithubRepo").loadGithubRepo;
    case "gitlab":
      console.log(`Loading GitLab loader function...`);
      return require("./GitlabRepo").loadGitlabRepo;
    case "azuredevops":
      console.log(`Loading Azure DevOps loader function...`);
      return require("./AzureDevOpsRepo").loadAzureDevOpsRepo;
    default:
      console.log(`Loading GitHub loader function...`);
      return require("./GithubRepo").loadGithubRepo;
  }
}

/**
 * Dynamically load the correct organization loader function from a specific platform
 * @param {('azuredevops')} platform
 * @returns {import("./AzureDevOpsRepo")['loadAzureDevOpsOrganization']} the org loader function for provider
 */
function resolveOrgLoaderFunction(platform = "azuredevops") {
  switch (platform) {
    case "azuredevops":
      console.log(`Loading Azure DevOps organization loader function...`);
      return require("./AzureDevOpsRepo").loadAzureDevOpsOrganization;
    default:
      throw new Error(`Organization loading not supported for platform: ${platform}`);
  }
}

module.exports = { 
  resolveRepoLoader, 
  resolveRepoLoaderFunction, 
  resolveOrgLoader,
  resolveOrgLoaderFunction,
};
