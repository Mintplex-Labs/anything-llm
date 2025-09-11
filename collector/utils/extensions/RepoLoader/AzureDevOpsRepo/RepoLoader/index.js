const ignore = require("ignore");

/**
 * @typedef {Object} RepoLoaderArgs
 * @property {string} repo - The Azure DevOps repository URL.
 * @property {string} [branch] - The branch to load from (optional).
 * @property {string} [accessToken] - Azure DevOps Personal Access Token for authentication (optional).
 * @property {string[]} [ignorePaths] - Array of paths to ignore when loading (optional).
 */

/**
 * @typedef {Object} FileTreeObject
 * @property {string} objectId - The file object ID.
 * @property {string} path - path of file.
 * @property {('blob'|'tree')} gitObjectType - type of file object.
 * @property {boolean} isFolder - whether the object is a folder.
 */

/**
 * @class
 * @classdesc Loads and manages Azure DevOps repository content.
 */
class AzureDevOpsRepoLoader {
  /**
   * Creates an instance of RepoLoader.
   * @param {RepoLoaderArgs} [args] - The configuration options.
   * @returns {AzureDevOpsRepoLoader}
   */
  constructor(args = {}) {
    this.ready = false;
    this.repo = args?.repo;
    this.branch = args?.branch;
    this.accessToken = args?.accessToken || null;
    this.ignorePaths = args?.ignorePaths || [];
    this.ignoreFilter = ignore().add(this.ignorePaths);

    this.organization = null;
    this.project = null;
    this.repositoryId = null;
    this.apiBase = null;
    this.branches = [];
  }

  /**
   * Validates the Azure DevOps URL format and extracts components.
   * - ensure the url is valid
   * - ensure the hostname is dev.azure.com or visualstudio.com
   * - ensure the pathname is in the format of dev.azure.com/{organization}/{project}/_git/{repository}
   * - sets the organization, project, and repositoryId properties of class instance
   * @returns {boolean} True if the URL is valid, false otherwise.
   */
  #validAzureDevOpsUrl() {
    try {
      const url = new URL(this.repo);

      // Support both dev.azure.com and *.visualstudio.com hostnames
      const isDevAzure = url.hostname === "dev.azure.com";
      const isVisualStudio = url.hostname.endsWith(".visualstudio.com");

      if (!isDevAzure && !isVisualStudio) {
        console.log(
          `[Azure DevOps Loader]: Invalid Azure DevOps URL provided! Hostname must be 'dev.azure.com' or '*.visualstudio.com'. Got ${url.hostname}`
        );
        return false;
      }

      let organization, project, repository;

      if (isDevAzure) {
        // Format: https://dev.azure.com/{organization}/{project}/_git/{repository}
        const pathParts = url.pathname.slice(1).split("/");
        if (pathParts.length < 4 || pathParts[2] !== "_git") {
          console.log(
            `[Azure DevOps Loader]: Invalid Azure DevOps URL format! Expected format: dev.azure.com/{organization}/{project}/_git/{repository}. Got ${url.pathname}`
          );
          return false;
        }
        [organization, project, , repository] = pathParts;
        this.apiBase = `https://dev.azure.com/${organization}`;
      } else {
        // Format: https://{organization}.visualstudio.com/{project}/_git/{repository}
        organization = url.hostname.split(".")[0];
        const pathParts = url.pathname.slice(1).split("/");
        if (pathParts.length < 3 || pathParts[1] !== "_git") {
          console.log(
            `[Azure DevOps Loader]: Invalid Azure DevOps URL format! Expected format: {organization}.visualstudio.com/{project}/_git/{repository}. Got ${url.pathname}`
          );
          return false;
        }
        [project, , repository] = pathParts;
        this.apiBase = `https://${organization}.visualstudio.com`;
      }

      if (!organization || !project || !repository) {
        console.log(
          `[Azure DevOps Loader]: Missing required URL components. Got organization: ${organization}, project: ${project}, repository: ${repository}`
        );
        return false;
      }

      this.organization = organization;
      this.project = project;
      this.repositoryId = repository;
      return true;
    } catch (e) {
      console.log(
        `[Azure DevOps Loader]: Invalid Azure DevOps URL provided! Error: ${e.message}`
      );
      return false;
    }
  }

  /**
   * Ensure the branch provided actually exists
   * and if it does not or has not been set auto-assign to primary branch.
   */
  async #validBranch() {
    await this.getRepoBranches();
    if (!!this.branch && this.branches.includes(this.branch)) return;

    console.log(
      "[Azure DevOps Loader]: Branch not set! Auto-assigning to a default branch."
    );
    this.branch = this.branches.includes("main") ? "main" : "master";
    console.log(`[Azure DevOps Loader]: Branch auto-assigned to ${this.branch}.`);
    return;
  }

  /**
   * Validates the Azure DevOps Personal Access Token.
   */
  async #validateAccessToken() {
    if (!this.accessToken) return;
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

      if (!valid) this.accessToken = null;
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
   * Initializes the RepoLoader instance.
   * @returns {Promise<AzureDevOpsRepoLoader>} The initialized RepoLoader instance.
   */
  async init() {
    if (!this.#validAzureDevOpsUrl()) return;
    await this.#validBranch();
    await this.#validateAccessToken();
    this.ready = true;
    return this;
  }

  /**
   * Get all branches for the repository.
   * @returns {Promise<void>}
   */
  async getRepoBranches() {
    if (!this.organization || !this.project || !this.repositoryId) return [];

    try {
      const headers = {
        "Content-Type": "application/json",
      };

      if (this.accessToken) {
        headers.Authorization = `Basic ${Buffer.from(`:${this.accessToken}`).toString('base64')}`;
      }

      const response = await fetch(
        `${this.apiBase}/${this.project}/_apis/git/repositories/${this.repositoryId}/refs?filter=heads/&api-version=7.1`,
        {
          method: "GET",
          headers,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      this.branches = data.value
        .filter((ref) => ref.name.startsWith("refs/heads/"))
        .map((ref) => ref.name.replace("refs/heads/", ""));

      return this.branches;
    } catch (e) {
      console.error(`[Azure DevOps Loader]: Failed to get repository branches: ${e.message}`);
      this.branches = [];
      return [];
    }
  }

  /**
   * Recursively loads the repository content.
   * @returns {Promise<Array<Object>>} An array of loaded documents.
   * @throws {Error} If the RepoLoader is not in a ready state.
   */
  async recursiveLoader() {
    if (!this.ready) throw new Error("[Azure DevOps Loader]: not in ready state!");

    if (this.accessToken) {
      console.log(
        `[Azure DevOps Loader]: Access token set! Recursive loading enabled for ${this.repo}!`
      );
    }

    const docs = [];

    console.log(`[Azure DevOps Loader]: Fetching files.`);

    const files = await this.fetchFilesRecursive();

    console.log(`[Azure DevOps Loader]: Fetched ${files.length} files.`);

    for (const file of files) {
      if (this.ignoreFilter.ignores(file.path)) continue;

      docs.push({
        pageContent: file.content,
        metadata: {
          source: file.path,
        },
      });
    }

    return docs;
  }

  /**
   * Recursively fetch all files from the repository.
   * @returns {Promise<Array<{path: string, content: string}>>}
   */
  async fetchFilesRecursive() {
    const files = [];
    const itemsToProcess = [{ path: "", isFolder: true }];

    while (itemsToProcess.length > 0) {
      const item = itemsToProcess.shift();

      if (item.isFolder) {
        const folderItems = await this.fetchFolderContents(item.path);
        for (const folderItem of folderItems) {
          if (folderItem.isFolder) {
            itemsToProcess.push(folderItem);
          } else {
            const content = await this.fetchSingleFile(folderItem.path);
            if (content) {
              files.push({
                path: folderItem.path,
                content,
              });
            }
          }
        }
      }
    }

    return files;
  }

  /**
   * Fetch the contents of a specific folder.
   * @param {string} folderPath - The path of the folder to fetch.
   * @returns {Promise<Array<FileTreeObject>>}
   */
  async fetchFolderContents(folderPath = "") {
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      if (this.accessToken) {
        headers.Authorization = `Basic ${Buffer.from(`:${this.accessToken}`).toString('base64')}`;
      }

      const scopePath = folderPath ? `&scopePath=${encodeURIComponent(folderPath)}` : "";
      const response = await fetch(
        `${this.apiBase}/${this.project}/_apis/git/repositories/${this.repositoryId}/items?recursionLevel=OneLevel&versionDescriptor.version=${this.branch}&versionDescriptor.versionType=branch&api-version=7.1${scopePath}`,
        {
          method: "GET",
          headers,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.value
        .filter((item) => item.path !== folderPath) // Exclude the folder itself
        .map((item) => ({
          objectId: item.objectId,
          path: item.path,
          gitObjectType: item.gitObjectType,
          isFolder: item.isFolder || item.gitObjectType === "tree",
        }));
    } catch (e) {
      console.error(
        `[Azure DevOps Loader]: Failed to fetch folder contents for ${folderPath}: ${e.message}`
      );
      return [];
    }
  }

  /**
   * Fetch the content of a single file.
   * @param {string} filePath - The path of the file to fetch.
   * @returns {Promise<string|null>} The file content or null if failed.
   */
  async fetchSingleFile(filePath) {
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      if (this.accessToken) {
        headers.Authorization = `Basic ${Buffer.from(`:${this.accessToken}`).toString('base64')}`;
      }

      const response = await fetch(
        `${this.apiBase}/${this.project}/_apis/git/repositories/${this.repositoryId}/items?path=${encodeURIComponent(filePath)}&versionDescriptor.version=${this.branch}&versionDescriptor.versionType=branch&includeContent=true&api-version=7.1`,
        {
          method: "GET",
          headers,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.value && data.value.length > 0) {
        const item = data.value[0];
        if (item.content) {
          // Content might be base64 encoded for binary files
          if (item.contentMetadata && item.contentMetadata.encoding === 1) {
            // Base64 encoded
            return Buffer.from(item.content, 'base64').toString('utf8');
          } else {
            return item.content;
          }
        }
      }

      return null;
    } catch (e) {
      console.error(
        `[Azure DevOps Loader]: Failed to fetch file content for ${filePath}: ${e.message}`
      );
      return null;
    }
  }
}

module.exports = AzureDevOpsRepoLoader;
