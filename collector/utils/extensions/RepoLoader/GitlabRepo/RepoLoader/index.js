const ignore = require("ignore");

/**
 * @typedef {Object} RepoLoaderArgs
 * @property {string} repo - The GitLab repository URL.
 * @property {string} [branch] - The branch to load from (optional).
 * @property {string} [accessToken] - GitLab access token for authentication (optional).
 * @property {string[]} [ignorePaths] - Array of paths to ignore when loading (optional).
 * @property {boolean} [fetchIssues] - Should issues be fetched (optional).
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
    this.ignoreFilter = ignore().add(this.ignorePaths);
    this.withIssues = args?.fetchIssues || false;

    this.projectId = null;
    this.apiBase = "https://gitlab.com";
    this.author = null;
    this.project = null;
    this.branches = [];
  }

  #validGitlabUrl() {
    const UrlPattern = require("url-pattern");
    const validPatterns = [
      new UrlPattern("https\\://gitlab.com/(:author*)/(:project(*))", {
        segmentValueCharset: "a-zA-Z0-9-._~%+",
      }),
      // This should even match the regular hosted URL, but we may want to know
      // if this was a hosted GitLab (above) or a self-hosted (below) instance
      // since the API interface could be different.
      new UrlPattern(
        "(:protocol(http|https))\\://(:hostname*)/(:author*)/(:project(*))",
        {
          segmentValueCharset: "a-zA-Z0-9-._~%+",
        }
      ),
    ];

    let match = null;
    for (const pattern of validPatterns) {
      if (match !== null) continue;
      match = pattern.match(this.repo);
    }
    if (!match) return false;
    const { author, project } = match;

    this.projectId = encodeURIComponent(`${author}/${project}`);
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
        `[Gitlab Loader]: Access token set! Recursive loading enabled for ${this.repo}!`
      );

    const docs = [];

    console.log(`[Gitlab Loader]: Fetching files.`);

    const files = await this.fetchFilesRecursive();

    console.log(`[Gitlab Loader]: Fetched ${files.length} files.`);

    for (const file of files) {
      if (this.ignoreFilter.ignores(file.path)) continue;

      docs.push({
        pageContent: file.content,
        metadata: {
          source: file.path,
          url: `${this.repo}/-/blob/${this.branch}/${file.path}`,
        },
      });
    }

    if (this.withIssues) {
      console.log(`[Gitlab Loader]: Fetching issues.`);
      const issues = await this.fetchIssues();
      console.log(
        `[Gitlab Loader]: Fetched ${issues.length} issues with discussions.`
      );
      docs.push(
        ...issues.map((issue) => ({
          issue,
          metadata: {
            source: `issue-${this.repo}-${issue.iid}`,
            url: issue.web_url,
          },
        }))
      );
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
    this.branches = [];

    const branchesRequestData = {
      endpoint: `/api/v4/projects/${this.projectId}/repository/branches`,
    };

    let branchesPage = [];
    while ((branchesPage = await this.fetchNextPage(branchesRequestData))) {
      this.branches.push(...branchesPage.map((branch) => branch.name));
    }
    return this.#branchPrefSort(this.branches);
  }

  /**
   * Returns list of all file objects from tree API for GitLab
   * @returns {Promise<FileTreeObject[]>}
   */
  async fetchFilesRecursive() {
    const files = [];
    const filesRequestData = {
      endpoint: `/api/v4/projects/${this.projectId}/repository/tree`,
      queryParams: {
        ref: this.branch,
        recursive: true,
      },
    };

    let filesPage = null;
    let pagePromises = [];
    while ((filesPage = await this.fetchNextPage(filesRequestData))) {
      // Fetch all the files that are not ignored in parallel.
      pagePromises = filesPage
        .filter((file) => {
          if (file.type !== "blob") return false;
          return !this.ignoreFilter.ignores(file.path);
        })
        .map(async (file) => {
          const content = await this.fetchSingleFileContents(file.path);
          if (!content) return null;
          return {
            path: file.path,
            content,
          };
        });

      const pageFiles = await Promise.all(pagePromises);

      files.push(...pageFiles.filter((item) => item !== null));
      console.log(`Fetched ${files.length} files.`);
    }
    console.log(`Total files fetched: ${files.length}`);
    return files;
  }

  /**
   * Fetches all issues from the repository.
   * @returns {Promise<Issue[]>} An array of issue objects.
   */
  async fetchIssues() {
    const issues = [];
    const issuesRequestData = {
      endpoint: `/api/v4/projects/${this.projectId}/issues`,
    };

    let issuesPage = null;
    let pagePromises = [];
    while ((issuesPage = await this.fetchNextPage(issuesRequestData))) {
      // Fetch all the issues in parallel.
      pagePromises = issuesPage.map(async (issue) => {
        const discussionsRequestData = {
          endpoint: `/api/v4/projects/${this.projectId}/issues/${issue.iid}/discussions`,
        };
        let discussionPage = null;
        const discussions = [];

        while (
          (discussionPage = await this.fetchNextPage(discussionsRequestData))
        ) {
          discussions.push(
            ...discussionPage.map(({ notes }) =>
              notes.map(
                ({ body, author, created_at }) =>
                  `${author.username} at ${created_at}:
${body}`
              )
            )
          );
        }
        const result = {
          ...issue,
          discussions,
        };
        return result;
      });

      const pageIssues = await Promise.all(pagePromises);

      issues.push(...pageIssues);
      console.log(`Fetched ${issues.length} issues.`);
    }
    console.log(`Total issues fetched: ${issues.length}`);
    return issues;
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

  /**
   * Fetches the next page of data from the API.
   * @param {Object} requestData - The request data.
   * @returns {Promise<Array<Object>|null>} The next page of data, or null if no more pages.
   */
  async fetchNextPage(requestData) {
    try {
      if (requestData.page === -1) return null;
      if (!requestData.page) requestData.page = 1;

      const { endpoint, perPage = 100, queryParams = {} } = requestData;
      const params = new URLSearchParams({
        ...queryParams,
        per_page: perPage,
        page: requestData.page,
      });
      const url = `${this.apiBase}${endpoint}?${params.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: this.accessToken ? { "PRIVATE-TOKEN": this.accessToken } : {},
      });

      // Rate limits get hit very often if no PAT is provided
      if (response.status === 401) {
        console.warn(`Rate limit hit for ${endpoint}. Skipping.`);
        return null;
      }

      const totalPages = Number(response.headers.get("x-total-pages"));
      const data = await response.json();
      if (!Array.isArray(data)) {
        console.warn(`Unexpected response format for ${endpoint}:`, data);
        return [];
      }

      console.log(
        `Gitlab RepoLoader: fetched ${endpoint} page ${requestData.page}/${totalPages} with ${data.length} records.`
      );

      if (totalPages === requestData.page) {
        requestData.page = -1;
      } else {
        requestData.page = Number(response.headers.get("x-next-page"));
      }

      return data;
    } catch (e) {
      console.error(`RepoLoader.fetchNextPage`, e);
      return null;
    }
  }
}

module.exports = GitLabRepoLoader;
