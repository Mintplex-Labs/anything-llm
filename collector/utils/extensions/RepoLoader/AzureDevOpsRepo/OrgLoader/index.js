const RepoLoader = require("../RepoLoader");

/**
 * @typedef {Object} OrgLoaderArgs
 * @property {string} organization - The Azure DevOps organization name.
 * @property {string} [accessToken] - Azure DevOps Personal Access Token for authentication (optional).
 * @property {string[]} [ignorePaths] - Array of paths to ignore when loading (optional).
 * @property {string[]} [includeProjects] - Array of specific project names to include (optional, loads all if not specified).
 * @property {string[]} [excludeProjects] - Array of project names to exclude (optional).
 * @property {string[]} [includeRepositories] - Array of specific repository names to include (optional, loads all if not specified).
 * @property {string[]} [excludeRepositories] - Array of repository names to exclude (optional).
 */

/**
 * @typedef {Object} ProjectInfo
 * @property {string} id - The project ID.
 * @property {string} name - The project name.
 * @property {string} description - The project description.
 * @property {string} state - The project state.
 */

/**
 * @typedef {Object} RepositoryInfo
 * @property {string} id - The repository ID.
 * @property {string} name - The repository name.
 * @property {string} projectId - The project ID this repository belongs to.
 * @property {string} projectName - The project name this repository belongs to.
 * @property {string} remoteUrl - The remote URL of the repository.
 * @property {string} defaultBranch - The default branch of the repository.
 */

/**
 * @class
 * @classdesc Loads and manages Azure DevOps organization content across all projects and repositories.
 */
class AzureDevOpsOrgLoader {
  /**
   * Creates an instance of AzureDevOpsOrgLoader.
   * @param {OrgLoaderArgs} [args] - The configuration options.
   * @returns {AzureDevOpsOrgLoader}
   */
  constructor(args = {}) {
    this.ready = false;
    this.organization = args?.organization;
    this.accessToken = args?.accessToken || null;
    this.ignorePaths = args?.ignorePaths || [];
    this.includeProjects = args?.includeProjects || [];
    this.excludeProjects = args?.excludeProjects || [];
    this.includeRepositories = args?.includeRepositories || [];
    this.excludeRepositories = args?.excludeRepositories || [];

    // Determine API base URL format
    this.apiBase = null;
    this.projects = [];
    this.repositories = [];
  }

  /**
   * Validates the organization name and sets up API base URL.
   * @returns {boolean} True if the organization is valid, false otherwise.
   */
  #validOrganization() {
    if (!this.organization) {
      console.log("[Azure DevOps Org Loader]: Organization name is required!");
      return false;
    }

    // Support both dev.azure.com and visualstudio.com formats
    // We'll default to dev.azure.com format for organization-only loading
    this.apiBase = `https://dev.azure.com/${this.organization}`;
    return true;
  }

  /**
   * Validates the Azure DevOps Personal Access Token.
   */
  async #validateAccessToken() {
    if (!this.accessToken) {
      console.log("[Azure DevOps Org Loader]: Warning - No access token provided. Only public repositories will be accessible.");
      return;
    }

    try {
      const valid = await fetch(`${this.apiBase}/_apis/profile/profiles/me?api-version=7.1`, {
        method: "GET",
        headers: {
          Authorization: `Basic ${Buffer.from(`:${this.accessToken}`).toString('base64')}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error(res.statusText);
          return res.ok;
        })
        .catch((e) => {
          console.error(
            "Invalid Azure DevOps Personal Access Token provided! Access token will not be used",
            e.message
          );
          return false;
        });

      if (!valid) {
        this.accessToken = null;
        console.log("[Azure DevOps Org Loader]: Access token invalid, proceeding without authentication.");
      }
      return;
    } catch (e) {
      console.error(
        "Error validating Azure DevOps Access Token:",
        e.message
      );
      this.accessToken = null;
    }
  }

  /**
   * Fetches all projects in the organization.
   * @returns {Promise<ProjectInfo[]>} Array of project information.
   */
  async getOrganizationProjects() {
    if (!this.organization) return [];

    try {
      const headers = {
        "Content-Type": "application/json",
      };

      if (this.accessToken) {
        headers.Authorization = `Basic ${Buffer.from(`:${this.accessToken}`).toString('base64')}`;
      }

      const response = await fetch(
        `${this.apiBase}/_apis/projects?api-version=7.1`,
        {
          method: "GET",
          headers,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const allProjects = data.value.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description || "",
        state: project.state,
      }));

      // Filter projects based on include/exclude lists
      let filteredProjects = allProjects;

      if (this.includeProjects.length > 0) {
        filteredProjects = filteredProjects.filter(project => 
          this.includeProjects.includes(project.name)
        );
      }

      if (this.excludeProjects.length > 0) {
        filteredProjects = filteredProjects.filter(project => 
          !this.excludeProjects.includes(project.name)
        );
      }

      this.projects = filteredProjects;
      console.log(`[Azure DevOps Org Loader]: Found ${this.projects.length} projects in organization ${this.organization}`);
      return this.projects;
    } catch (e) {
      console.error(`[Azure DevOps Org Loader]: Failed to get organization projects: ${e.message}`);
      this.projects = [];
      return [];
    }
  }

  /**
   * Fetches all repositories in a specific project.
   * @param {string} projectName - The project name.
   * @returns {Promise<RepositoryInfo[]>} Array of repository information.
   */
  async getProjectRepositories(projectName) {
    if (!this.organization || !projectName) return [];

    try {
      const headers = {
        "Content-Type": "application/json",
      };

      if (this.accessToken) {
        headers.Authorization = `Basic ${Buffer.from(`:${this.accessToken}`).toString('base64')}`;
      }

      const response = await fetch(
        `${this.apiBase}/${encodeURIComponent(projectName)}/_apis/git/repositories?api-version=7.1`,
        {
          method: "GET",
          headers,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const allRepositories = data.value.map(repo => ({
        id: repo.id,
        name: repo.name,
        projectId: repo.project.id,
        projectName: repo.project.name,
        remoteUrl: repo.remoteUrl,
        defaultBranch: repo.defaultBranch ? repo.defaultBranch.replace("refs/heads/", "") : "main",
      }));

      // Filter repositories based on include/exclude lists
      let filteredRepositories = allRepositories;

      if (this.includeRepositories.length > 0) {
        filteredRepositories = filteredRepositories.filter(repo => 
          this.includeRepositories.includes(repo.name)
        );
      }

      if (this.excludeRepositories.length > 0) {
        filteredRepositories = filteredRepositories.filter(repo => 
          !this.excludeRepositories.includes(repo.name)
        );
      }

      console.log(`[Azure DevOps Org Loader]: Found ${filteredRepositories.length} repositories in project ${projectName}`);
      return filteredRepositories;
    } catch (e) {
      console.error(`[Azure DevOps Org Loader]: Failed to get repositories for project ${projectName}: ${e.message}`);
      return [];
    }
  }

  /**
   * Fetches all repositories across all projects in the organization.
   * @returns {Promise<RepositoryInfo[]>} Array of all repository information.
   */
  async getAllRepositories() {
    if (this.projects.length === 0) {
      await this.getOrganizationProjects();
    }

    const allRepositories = [];

    for (const project of this.projects) {
      const projectRepos = await this.getProjectRepositories(project.name);
      allRepositories.push(...projectRepos);
    }

    this.repositories = allRepositories;
    console.log(`[Azure DevOps Org Loader]: Total repositories found across organization: ${this.repositories.length}`);
    return this.repositories;
  }

  /**
   * Initializes the OrgLoader instance.
   * @returns {Promise<AzureDevOpsOrgLoader>} The initialized OrgLoader instance.
   */
  async init() {
    if (!this.#validOrganization()) return;
    await this.#validateAccessToken();
    await this.getOrganizationProjects();
    await this.getAllRepositories();
    this.ready = true;
    return this;
  }

  /**
   * Loads all repositories in the organization using individual RepoLoader instances.
   * @returns {Promise<Array<Object>>} An array of loaded documents from all repositories.
   * @throws {Error} If the OrgLoader is not in a ready state.
   */
  async loadAllRepositories() {
    if (!this.ready) throw new Error("[Azure DevOps Org Loader]: not in ready state!");

    console.log(`[Azure DevOps Org Loader]: Starting to load ${this.repositories.length} repositories...`);

    const allDocs = [];
    const results = [];

    for (const repo of this.repositories) {
      try {
        console.log(`[Azure DevOps Org Loader]: Loading repository ${repo.projectName}/${repo.name}...`);

        // Create a RepoLoader instance for this specific repository
        const repoLoader = new RepoLoader({
          repo: repo.remoteUrl,
          branch: repo.defaultBranch,
          accessToken: this.accessToken,
          ignorePaths: this.ignorePaths,
        });

        await repoLoader.init();

        if (!repoLoader.ready) {
          console.log(`[Azure DevOps Org Loader]: Skipping repository ${repo.projectName}/${repo.name} - could not initialize`);
          results.push({
            success: false,
            repository: repo,
            reason: "Could not initialize repository loader",
            files: 0,
          });
          continue;
        }

        const docs = await repoLoader.recursiveLoader();
        
        // Add organization and project context to each document
        const enrichedDocs = docs.map(doc => ({
          ...doc,
          metadata: {
            ...doc.metadata,
            organization: this.organization,
            project: repo.projectName,
            repository: repo.name,
            repositoryUrl: repo.remoteUrl,
            branch: repo.defaultBranch,
          },
        }));

        allDocs.push(...enrichedDocs);
        results.push({
          success: true,
          repository: repo,
          reason: null,
          files: docs.length,
        });

        console.log(`[Azure DevOps Org Loader]: Successfully loaded ${docs.length} files from ${repo.projectName}/${repo.name}`);

      } catch (error) {
        console.error(`[Azure DevOps Org Loader]: Error loading repository ${repo.projectName}/${repo.name}:`, error.message);
        results.push({
          success: false,
          repository: repo,
          reason: error.message,
          files: 0,
        });
      }
    }

    console.log(`[Azure DevOps Org Loader]: Completed loading organization. Total files: ${allDocs.length}`);

    return {
      documents: allDocs,
      results: results,
      summary: {
        totalRepositories: this.repositories.length,
        successfulRepositories: results.filter(r => r.success).length,
        failedRepositories: results.filter(r => !r.success).length,
        totalFiles: allDocs.length,
        organization: this.organization,
        projects: this.projects.map(p => p.name),
      },
    };
  }
}

module.exports = AzureDevOpsOrgLoader;
