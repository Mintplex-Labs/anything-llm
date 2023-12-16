const { reqBody } = require("../utils/http");

function extensions(app) {
  if (!app) return;

  app.post("/ext/github-repo", async function (request, response) {
    const { repo, branch = null } = reqBody(request);
    try {
      const loadGithubRepo = require("../utils/extensions/GithubRepo");
      const { success, reason } = await loadGithubRepo(reqBody(request));
      response.status(200).json({ filename: `${repo}:${branch || 'main'}`, success, reason });
    } catch (e) {
      console.error(e);
      response.status(200).json({
        filename: `${repo}:${branch || 'main'}`,
        success: false,
        reason: "A processing error occurred.",
      });
    }
    return;
  });

  // gets information about specific repo
  app.get("/ext/github-repo", async function (request, response) {
    try {
      const GithubRepoLoader = require("../utils/extensions/GithubRepo/RepoLoader");
      const allBranches = await (new GithubRepoLoader(reqBody(request))).getRepoBranches()
      response.status(200).json({ branches: allBranches });
    } catch (e) {
      console.error(e);
      response.status(400).json({ branches: [] });
    }
    return;
  });
}

module.exports = extensions;
