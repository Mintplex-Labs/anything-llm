class RepoLoader {
  constructor(args = {}) {
    this.ready = false;
    this.repo = args?.repo;
    this.branch = args?.branch;
    this.accessToken = args?.accessToken || null;
    this.ignorePaths = args?.ignorePaths || [];

    this.author = null;
    this.project = null;
    this.branches = [];
  }

  #validGithubUrl() {
    const UrlPattern = require("url-pattern");
    const pattern = new UrlPattern("https\\://github.com/(:author)/(:project)");
    const match = pattern.match(this.repo);
    if (!match) return false;

    this.author = match.author;
    this.project = match.project;
    return true;
  }

  // Ensure the branch provided actually exists
  // and if it does not or has not been set auto-assign to primary branch.
  async #validBranch() {
    await this.getRepoBranches();
    if (!!this.branch && this.branches.includes(this.branch)) return;

    console.log(
      "[Github Loader]: Branch not set! Auto-assigning to a default branch."
    );
    this.branch = this.branches.includes("main") ? "main" : "master";
    console.log(`[Github Loader]: Branch auto-assigned to ${this.branch}.`);
    return;
  }

  async #validateAccessToken() {
    if (!this.accessToken) return;
    const valid = await fetch("https://api.github.com/octocat", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.ok;
      })
      .catch((e) => {
        console.error(
          "Invalid Github Access Token provided! Access token will not be used",
          e.message
        );
        return false;
      });

    if (!valid) this.accessToken = null;
    return;
  }

  async init() {
    if (!this.#validGithubUrl()) return;
    await this.#validBranch();
    await this.#validateAccessToken();
    this.ready = true;
    return this;
  }

  async recursiveLoader() {
    if (!this.ready) throw new Error("[Github Loader]: not in ready state!");
    const {
      GithubRepoLoader: LCGithubLoader,
    } = require("langchain/document_loaders/web/github");

    if (this.accessToken)
      console.log(
        `[Github Loader]: Access token set! Recursive loading enabled!`
      );

    const loader = new LCGithubLoader(this.repo, {
      accessToken: this.accessToken,
      branch: this.branch,
      recursive: !!this.accessToken, // Recursive will hit rate limits.
      maxConcurrency: 5,
      unknown: "ignore",
      ignorePaths: this.ignorePaths,
    });

    const docs = [];
    for await (const doc of loader.loadAsStream()) docs.push(doc);
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

  // Get all branches for a given repo.
  async getRepoBranches() {
    if (!this.#validGithubUrl() || !this.author || !this.project) return [];
    await this.#validateAccessToken(); // Ensure API access token is valid for pre-flight

    let page = 0;
    let polling = true;
    const branches = [];

    while (polling) {
      console.log(`Fetching page ${page} of branches for ${this.project}`);
      await fetch(
        `https://api.github.com/repos/${this.author}/${this.project}/branches?per_page=100&page=${page}`,
        {
          method: "GET",
          headers: {
            ...(this.accessToken
              ? { Authorization: `Bearer ${this.accessToken}` }
              : {}),
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      )
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error(`Invalid request to Github API: ${res.statusText}`);
        })
        .then((branchObjects) => {
          polling = branchObjects.length > 0;
          branches.push(branchObjects.map((branch) => branch.name));
          page++;
        })
        .catch((err) => {
          polling = false;
          console.log(`RepoLoader.branches`, err);
        });
    }

    this.branches = [...new Set(branches.flat())];
    return this.#branchPrefSort(this.branches);
  }
}

module.exports = RepoLoader;
