const ignore = require("ignore");
const MAX_RETRIES = 3;

/**
 * @typedef {Object} RepoLoaderArgs
 * @property {string} repo - The Gitea repository URL.
 * @property {string} [branch] - The branch to load from (optional).
 * @property {string} [accessToken] - Gitea access token for authentication (optional).
 * @property {string[]} [ignorePaths] - Array of paths to ignore when loading (optional).
 */

/**
 * @typedef {Object} FileTreeObject
 * @property {string} path - path + name of file.
 * @property {('blob'|'tree')} type - type of file object.
 * @property {string} sha - the object SHA.
 * @property {number} size - size of the object in bytes.
 */

/**
 * @class
 * @classdesc Loads and manages Gitea repository content. Gitea is always a
 * self-hosted instance so the API base is derived from the repository URL itself.
 */
class GiteaRepoLoader {
  /**
   * Creates an instance of RepoLoader.
   * @param {RepoLoaderArgs} [args] - The configuration options.
   * @returns {GiteaRepoLoader}
   */
  constructor(args = {}) {
    this.ready = false;
    this.repo = args?.repo;
    this.branch = args?.branch;
    this.accessToken = args?.accessToken || null;
    this.ignorePaths = args?.ignorePaths || [];
    this.ignoreFilter = ignore().add(this.ignorePaths);

    this.apiBase = null;
    this.scheme = null;
    this.author = null;
    this.project = null;
    this.branches = [];
  }

  #wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Headers sent with every request to the Gitea API. Gitea accepts a personal
   * access token via the `token` authorization scheme - no header is sent when
   * no token was provided so public repositories still work.
   * @returns {Record<string, string>}
   */
  #headers() {
    return this.accessToken
      ? { Authorization: `token ${this.accessToken}` }
      : {};
  }

  /**
   * Validates the Gitea URL format.
   * - ensure the url is valid and http(s)
   * - ensure the pathname is in the format of {host}/{author}/{project}
   * - sets the scheme, apiBase, author and project properties of the class instance
   * - normalizes `this.repo` so trailing paths (eg: /src/branch/main) and a
   *   `.git` suffix do not leak into the chunk source we store for resyncing.
   * @returns {boolean} True if the URL is valid, false otherwise.
   */
  #validGiteaUrl() {
    try {
      const url = new URL(this.repo);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        console.log(
          `[Gitea Loader]: Invalid Gitea URL provided! Protocol must be http or https. Got ${url.protocol}`
        );
        return false;
      }

      // A Gitea repository always lives at {host}/{author}/{project} - anything
      // deeper (eg: /src/branch/main/file.js) is a view of that same repository.
      const [author, project, ..._rest] = url.pathname.slice(1).split("/");
      if (!author || !project) {
        console.log(
          `[Gitea Loader]: Invalid Gitea URL provided! URL must be in the format of '{host}/{author}/{project}'. Got ${url.pathname}`
        );
        return false;
      }

      this.scheme = url.protocol.replace(":", "");
      this.apiBase = url.origin;
      this.author = author;
      this.project = project.endsWith(".git") ? project.slice(0, -4) : project;
      this.repo = `${url.origin}/${this.author}/${this.project}`;
      return true;
    } catch (e) {
      console.log(
        `[Gitea Loader]: Invalid Gitea URL provided! Error: ${e.message}`
      );
      return false;
    }
  }

  // Ensure the branch provided actually exists and if it does not or has not
  // been set auto-assign to the repository default branch.
  async #validBranch() {
    await this.getRepoBranches();
    if (!!this.branch && this.branches.includes(this.branch)) return;

    console.log(
      "[Gitea Loader]: Branch not set! Auto-assigning to a default branch."
    );
    const defaultBranch = await this.fetchDefaultBranch();
    if (defaultBranch && this.branches.includes(defaultBranch)) {
      this.branch = defaultBranch;
    } else {
      this.branch = this.branches.includes("main") ? "main" : "master";
    }
    console.log(`[Gitea Loader]: Branch auto-assigned to ${this.branch}.`);
    return;
  }

  async #validateAccessToken() {
    if (!this.accessToken) return;
    const valid = await fetch(`${this.apiBase}/api/v1/user`, {
      method: "GET",
      headers: this.#headers(),
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.ok;
      })
      .catch((e) => {
        console.error(
          "Invalid Gitea Access Token provided! Access token will not be used",
          e.message
        );
        return false;
      });

    if (!valid) this.accessToken = null;
    return;
  }

  /**
   * Initializes the RepoLoader instance.
   * @returns {Promise<GiteaRepoLoader>} The initialized RepoLoader instance.
   */
  async init() {
    if (!this.#validGiteaUrl()) return;
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
    if (!this.ready) throw new Error("[Gitea Loader]: not in ready state!");

    if (this.accessToken)
      console.log(
        `[Gitea Loader]: Access token set! Recursive loading enabled for ${this.repo}!`
      );

    const docs = [];

    console.log(`[Gitea Loader]: Fetching files.`);
    const files = await this.fetchFilesRecursive();
    console.log(`[Gitea Loader]: Fetched ${files.length} files.`);

    for (const file of files) {
      if (this.ignoreFilter.ignores(file.path)) continue;

      docs.push({
        pageContent: file.content,
        metadata: {
          source: file.path,
          url: `${this.repo}/src/branch/${this.branch}/${file.path}`,
        },
      });
    }

    return docs;
  }

  // Sort branches to always show either main or master at the top of the result.
  #branchPrefSort(branches = []) {
    const preferredSort = ["main", "master"];
    return branches.reduce((acc, branch) => {
      if (preferredSort.includes(branch)) return [branch, ...acc];
      return [...acc, branch];
    }, []);
  }

  /**
   * Retrieves the default branch of the repository from its metadata.
   * @returns {Promise<string|null>} The default branch name, or null if it could not be resolved.
   */
  async fetchDefaultBranch() {
    const metadata = await this.fetchJson(
      `/repos/${this.author}/${this.project}`
    );
    if (!metadata?.default_branch) return null;
    return metadata.default_branch;
  }

  /**
   * Retrieves all branches for the repository.
   * @returns {Promise<string[]>} An array of branch names.
   */
  async getRepoBranches() {
    if (!this.#validGiteaUrl() || !this.author || !this.project) return [];
    await this.#validateAccessToken(); // Ensure API access token is valid for pre-flight
    this.branches = [];

    const perPage = 50;
    let page = 1;
    let polling = true;

    while (polling) {
      const branchesPage = await this.fetchJson(
        `/repos/${this.author}/${this.project}/branches?page=${page}&limit=${perPage}`
      );
      if (!Array.isArray(branchesPage) || !branchesPage.length) break;

      this.branches.push(...branchesPage.map((branch) => branch.name));
      polling = branchesPage.length >= perPage;
      page++;
    }

    this.branches = [...new Set(this.branches)];
    return this.#branchPrefSort(this.branches);
  }

  /**
   * Fetches a single page of the recursive tree for the current branch.
   * @param {number} page - the page of the tree to fetch.
   * @param {number} perPage - how many tree objects to fetch per page.
   * @returns {Promise<{tree: FileTreeObject[], truncated: boolean, total_count: number}|null>}
   */
  async fetchTreePage(page = 1, perPage = 1000) {
    return await this.fetchJson(
      `/repos/${this.author}/${this.project}/git/trees/${encodeURIComponent(
        this.branch
      )}?recursive=true&per_page=${perPage}&page=${page}`
    );
  }

  /**
   * Returns the path + content of every non-ignored file in the repository tree.
   * @returns {Promise<{path: string, content: string}[]>}
   */
  async fetchFilesRecursive() {
    const files = [];
    const perPage = 1000;
    let page = 1;
    let polling = true;

    while (polling) {
      const treePage = await this.fetchTreePage(page, perPage);
      if (!treePage) break;

      const tree = Array.isArray(treePage.tree) ? treePage.tree : [];
      if (!tree.length) break;

      // Fetch all the files that are not ignored in parallel.
      const pagePromises = tree
        .filter((object) => {
          if (object.type !== "blob") return false;
          return !this.ignoreFilter.ignores(object.path);
        })
        .map(async (object) => {
          const content = await this.fetchSingleFile(object.path);
          if (!content) return null;
          return {
            path: object.path,
            content,
          };
        });

      const pageFiles = await Promise.all(pagePromises);
      files.push(...pageFiles.filter((item) => item !== null));
      console.log(`[Gitea Loader]: Fetched ${files.length} files.`);

      if (treePage.truncated)
        console.warn(
          `[Gitea Loader]: Tree response for ${this.branch} was truncated by the server. Fetching the next page.`
        );

      polling = treePage.truncated === true || tree.length >= perPage;
      page++;
    }

    console.log(`[Gitea Loader]: Total files fetched: ${files.length}`);
    return files;
  }

  /**
   * Fetches the content of a single file from the repository.
   * @param {string} sourceFilePath - The path to the file in the repository.
   * @param {number} [retries] - The current retry count for rate limited requests.
   * @returns {Promise<string|null>} The content of the file, or null if fetching fails.
   */
  async fetchSingleFile(sourceFilePath, retries = 0) {
    try {
      // Each segment is encoded on its own so the path separators survive.
      const encodedFilePath = String(sourceFilePath)
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/");
      const url = `${this.apiBase}/api/v1/repos/${this.author}/${
        this.project
      }/raw/${encodedFilePath}?ref=${encodeURIComponent(this.branch)}`;
      const response = await fetch(url, {
        method: "GET",
        headers: this.#headers(),
      });

      if (response.status === 429) {
        if (retries >= MAX_RETRIES) {
          console.warn(
            `[Gitea Loader]: Rate limit persists for ${sourceFilePath} after ${retries} retries. Skipping.`
          );
          return null;
        }
        const retryAfter = Number(response.headers.get("retry-after")) || 60;
        console.warn(
          `[Gitea Loader]: Rate limit hit fetching ${sourceFilePath}. Waiting ${retryAfter}s...`
        );
        await this.#wait(retryAfter * 1000);
        return this.fetchSingleFile(sourceFilePath, retries + 1);
      }

      if (!response.ok)
        throw new Error(
          `Failed to fetch single file ${sourceFilePath} - ${response.status}`
        );

      return await response.text();
    } catch (e) {
      console.error(`GiteaRepoLoader.fetchSingleFile`, e);
      return null;
    }
  }

  /**
   * Fetches and parses a JSON response from the Gitea API.
   * @param {string} endpoint - The endpoint (with query params) relative to `/api/v1`.
   * @param {number} [retries] - The current retry count for rate limited requests.
   * @returns {Promise<Object|Array|null>} The parsed body, or null if the request failed.
   */
  async fetchJson(endpoint, retries = 0) {
    try {
      const response = await fetch(`${this.apiBase}/api/v1${endpoint}`, {
        method: "GET",
        headers: this.#headers(),
      });

      if (response.status === 429) {
        if (retries >= MAX_RETRIES) {
          console.warn(
            `[Gitea Loader]: Rate limit persists for ${endpoint} after ${retries} retries. Skipping.`
          );
          return null;
        }
        const retryAfter = Number(response.headers.get("retry-after")) || 60;
        console.warn(
          `[Gitea Loader]: Rate limit hit for ${endpoint}. Waiting ${retryAfter}s before retrying...`
        );
        await this.#wait(retryAfter * 1000);
        return this.fetchJson(endpoint, retries + 1);
      }

      if (response.status === 401 || response.status === 403) {
        console.warn(
          `[Gitea Loader]: Unauthorized request for ${endpoint}. Skipping.`
        );
        return null;
      }

      if (!response.ok) {
        console.warn(
          `[Gitea Loader]: Unexpected status ${response.status} for ${endpoint}. Skipping.`
        );
        return null;
      }

      return await response.json();
    } catch (e) {
      console.error(`GiteaRepoLoader.fetchJson`, e);
      return null;
    }
  }
}

module.exports = GiteaRepoLoader;
