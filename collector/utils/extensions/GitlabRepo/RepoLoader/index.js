const https = require('https');
const UrlPattern = require("url-pattern");

class RepoLoader {
  constructor(args = {}) {
    this.ready = false;
    this.repo = args?.repo;
    this.branch = args?.branch;
    this.accessToken = args?.accessToken || null;
    this.ignorePaths = args?.ignorePaths || [];

    this.projectId = null;
    this.branches = [];
  }

  #validGitlabUrl() {
    const pattern = new UrlPattern(
      "https\\://gitlab.com/(:projectId(*))",
      {
        segmentValueCharset: "a-zA-Z0-9-._~%/+",
      }
    );
    const match = pattern.match(this.repo);
    if (!match) return false;

    this.projectId = encodeURIComponent(match.projectId);
    return true;
  }

  async #validBranch() {
    await this.getRepoBranches();
    if (!!this.branch && this.branches.includes(this.branch)) return;

    console.log(
      "[Gitlab Loader]: Branch not set! Auto-assigning to a default branch."
    );
    this.branch = this.branches.includes("main") ? "main" : "master";
    console.log(`[Gitlab Loader]: Branch auto-assigned to ${this.branch}.`);
    return;
  }

  async #validateAccessToken() {
    if (!this.accessToken) return;
    try {
      await this.#makeRequest('https://gitlab.com/api/v4/user');
    } catch (e) {
      console.error(
        "Invalid Gitlab Access Token provided! Access token will not be used",
        e.message
      );
      this.accessToken = null;
    }
  }

  async init() {
    if (!this.#validGitlabUrl()) return;
    await this.#validBranch();
    await this.#validateAccessToken();
    this.ready = true;
    return this;
  }

  async recursiveLoader() {
    if (!this.ready) throw new Error("[Gitlab Loader]: not in ready state!");

    if (this.accessToken)
      console.log(
        `[Gitlab Loader]: Access token set! Recursive loading enabled!`
      );

    const files = await this.getRepositoryTree();
    const docs = [];

    for (const file of files) {
      if (this.ignorePaths.some(path => file.path.includes(path))) continue;
      const content = await this.fetchSingleFile(file.path);
      if (content) {
        docs.push({
          pageContent: content,
          metadata: { source: file.path }
        });
      }
    }

    return docs;
  }

  #branchPrefSort(branches = []) {
    const preferredSort = ["main", "master"];
    return branches.reduce((acc, branch) => {
      if (preferredSort.includes(branch)) return [branch, ...acc];
      return [...acc, branch];
    }, []);
  }

  async getRepoBranches() {
    if (!this.#validGitlabUrl() || !this.projectId) return [];
    await this.#validateAccessToken();

    try {
      const data = await this.#makeRequest(`https://gitlab.com/api/v4/projects/${this.projectId}/repository/branches`);
      this.branches = JSON.parse(data).map(branch => branch.name);
      return this.#branchPrefSort(this.branches);
    } catch (err) {
      console.log(`RepoLoader.branches`, err);
      return [];
    }
  }

  async getRepositoryTree() {
    try {
      const data = await this.#makeRequest(`https://gitlab.com/api/v4/projects/${this.projectId}/repository/tree?ref=${this.branch}&recursive=true&per_page=100`);
      return JSON.parse(data).filter(item => item.type === 'blob');
    } catch (e) {
      console.error(`RepoLoader.getRepositoryTree`, e);
      return [];
    }
  }

  async fetchSingleFile(sourceFilePath) {
    try {
      const data = await this.#makeRequest(`https://gitlab.com/api/v4/projects/${this.projectId}/repository/files/${encodeURIComponent(sourceFilePath)}/raw?ref=${this.branch}`);
      return data;
    } catch (e) {
      console.error(`RepoLoader.fetchSingleFile`, e);
      return null;
    }
  }

  #makeRequest(url) {
    return new Promise((resolve, reject) => {
      const options = {
        headers: this.accessToken ? { 'PRIVATE-TOKEN': this.accessToken } : {}
      };

      https.get(url, options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data);
          } else {
            reject(new Error(`Request failed with status code ${res.statusCode}`));
          }
        });
      }).on('error', reject);
    });
  }
}

module.exports = RepoLoader;
