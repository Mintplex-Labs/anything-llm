const minimatch = require("minimatch");

/**
 * @typedef {Object} RepoLoaderArgs
 * @property {string} repo - The GitLab repository URL.
 * @property {string} [branch] - The branch to load from (optional).
 * @property {string} [accessToken] - GitLab access token for authentication (optional).
 * @property {string[]} [ignorePaths] - Array of paths to ignore when loading (optional).
 */

/**
 * @typedef {Object} FileTreeObject
 * @property {string} id - The file object ID.
 * @property {string} name - name of file.
 * @property {('blob'|'tree')} type - type of file object.
 * @property {string} path - path + name of file.
 * @property {string} mode - Linux permission code.
 */

/**
 * @class
 * @classdesc Loads and manages GitLab repository content.
 */
class GitLabRepoLoader {
  /**
   * Creates an instance of RepoLoader.
   * @param {RepoLoaderArgs} [args] - The configuration options.
   * @returns {GitLabRepoLoader}
   */
  constructor(args = {}) {
    this.ready = false;
    this.repo = args?.repo;
    this.branch = args?.branch;
    this.accessToken = args?.accessToken || null;
    this.ignorePaths = args?.ignorePaths || [];

    this.projectId = null;
    this.apiBase = "https://gitlab.com";
    this.author = null;
    this.project = null;
    this.branches = [];
  }

  #validGitlabUrl() {
    const UrlPattern = require("url-pattern");
    const validPatterns = [
      new UrlPattern("https\\://gitlab.com/(:projectId(*))", {
        segmentValueCharset: "a-zA-Z0-9-._~%/+",
      }),
      // This should even match the regular hosted URL, but we may want to know
      // if this was a hosted GitLab (above) or a self-hosted (below) instance
      // since the API interface could be different.
      new UrlPattern(
        "(:protocol(http|https))\\://(:hostname*)/(:projectId(*))",
        {
          segmentValueCharset: "a-zA-Z0-9-._~%/+",
        }
      ),
    ];

    let match = null;
    for (const pattern of validPatterns) {
      if (match !== null) continue;
      match = pattern.match(this.repo);
    }
    if (!match) return false;
    const [author, project] = match.projectId.split("/");

    this.projectId = encodeURIComponent(match.projectId);
    this.apiBase = new URL(this.repo).origin;
    this.author = author;
    this.project = project;
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
      await fetch(`${this.apiBase}/api/v4/user`, {
        method: "GET",
        headers: this.accessToken ? { "PRIVATE-TOKEN": this.accessToken } : {},
      }).then((res) => res.ok);
    } catch (e) {
      console.error(
        "Invalid Gitlab Access Token provided! Access token will not be used",
        e.message
      );
      this.accessToken = null;
    }
  }

  /**
   * Initializes the RepoLoader instance.
   * @returns {Promise<RepoLoader>} The initialized RepoLoader instance.
   */
  async init() {
    if (!this.#validGitlabUrl()) return;
    await this.#validBranch();
    await this.#validateAccessToken();
    this.ready = true;
    return this;
  }

  /**
   * Recursively loads the repository content.
   * @returns {Promise<Array<Object>>} An array of loaded documents.
   * @throws {Error} If the RepoLoader is not in a ready state.
   */
  async recursiveLoader() {
    if (!this.ready) throw new Error("[Gitlab Loader]: not in ready state!");

    if (this.accessToken)
      console.log(
        `[Gitlab Loader]: Access token set! Recursive loading enabled!`
      );

    const files = await this.fetchFilesRecursive();
    const docs = [];

    for (const file of files) {
      if (this.ignorePaths.some((path) => file.path.includes(path))) continue;

      const content = await this.fetchSingleFileContents(file.path);
      if (content) {
        docs.push({
          pageContent: content,
          metadata: { source: file.path },
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

  /**
   * Retrieves all branches for the repository.
   * @returns {Promise<string[]>} An array of branch names.
   */
  async getRepoBranches() {
    if (!this.#validGitlabUrl() || !this.projectId) return [];
    await this.#validateAccessToken();

    try {
      this.branches = await fetch(
        `${this.apiBase}/api/v4/projects/${this.projectId}/repository/branches`,
        {
          method: "GET",
          headers: {
            Accepts: "application/json",
            ...(this.accessToken ? { "PRIVATE-TOKEN": this.accessToken } : {}),
          },
        }
      )
        .then((res) => res.json())
        .then((branches) => {
          return branches.map((b) => b.name);
        })
        .catch((e) => {
          console.error(e);
          return [];
        });

      return this.#branchPrefSort(this.branches);
    } catch (err) {
      console.log(`RepoLoader.getRepoBranches`, err);
      this.branches = [];
      return [];
    }
  }

  /**
   * Returns list of all file objects from tree API for GitLab
   * @returns {Promise<FileTreeObject[]>}
   */
  async fetchFilesRecursive() {
    const files = [];
    let perPage = 100;
    let fetching = true;
    let page = 1;

    while (fetching) {
      try {
        const params = new URLSearchParams({
          ref: this.branch,
          recursive: true,
          per_page: perPage,
          page,
        });
        const queryUrl = `${this.apiBase}/api/v4/projects/${
          this.projectId
        }/repository/tree?${params.toString()}`;
        const response = await fetch(queryUrl, {
          method: "GET",
          headers: this.accessToken
            ? { "PRIVATE-TOKEN": this.accessToken }
            : {},
        });
        const totalPages = Number(response.headers.get("x-total-pages"));
        const nextPage = Number(response.headers.get("x-next-page"));
        const data = await response.json();

        /** @type {FileTreeObject[]} */
        const objects = Array.isArray(data)
          ? data.filter((item) => item.type === "blob")
          : []; // only get files, not paths or submodules

        // Apply ignore path rules to found objects. If any rules match it is an invalid file path.
        console.log(
          `Found ${objects.length} blobs from repo from pg ${page}/${totalPages}`
        );
        for (const file of objects) {
          const isIgnored = this.ignorePaths.some((ignorePattern) =>
            minimatch(file.path, ignorePattern, { matchBase: true })
          );
          if (!isIgnored) files.push(file);
        }

        if (page === totalPages) {
          fetching = false;
          break;
        }

        page = Number(nextPage);
      } catch (e) {
        console.error(`RepoLoader.getRepositoryTree`, e);
        fetching = false;
        break;
      }
    }
    return files;
  }

  /**
   * Fetches the content of a single file from the repository.
   * @param {string} sourceFilePath - The path to the file in the repository.
   * @returns {Promise<string|null>} The content of the file, or null if fetching fails.
   */
  async fetchSingleFileContents(sourceFilePath) {
    try {
      const data = await fetch(
        `${this.apiBase}/api/v4/projects/${
          this.projectId
        }/repository/files/${encodeURIComponent(sourceFilePath)}/raw?ref=${
          this.branch
        }`,
        {
          method: "GET",
          headers: this.accessToken
            ? { "PRIVATE-TOKEN": this.accessToken }
            : {},
        }
      ).then((res) => {
        if (res.ok) return res.text();
        throw new Error(`Failed to fetch single file ${sourceFilePath}`);
      });

      return data;
    } catch (e) {
      console.error(`RepoLoader.fetchSingleFileContents`, e);
      return null;
    }
  }
}

module.exports = GitLabRepoLoader;
