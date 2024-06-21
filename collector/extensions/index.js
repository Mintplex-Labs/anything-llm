const { setDataSigner } = require("../middleware/setDataSigner");
const { verifyPayloadIntegrity } = require("../middleware/verifyIntegrity");
const { reqBody } = require("../utils/http");
const { validURL } = require("../utils/url");
const RESYNC_METHODS = require("./resync");

function extensions(app) {
  if (!app) return;

  app.post(
    "/ext/resync-source-document",
    [verifyPayloadIntegrity, setDataSigner],
    async function (request, response) {
      try {
        const { type, options } = reqBody(request);
        if (!RESYNC_METHODS.hasOwnProperty(type)) throw new Error(`Type "${type}" is not a valid type to sync.`);
        return await RESYNC_METHODS[type](options, response);
      } catch (e) {
        console.error(e);
        response.status(200).json({
          success: false,
          content: null,
          reason: e.message || "A processing error occurred.",
        });
      }
      return;
    }
  )

  app.post(
    "/ext/github-repo",
    [verifyPayloadIntegrity, setDataSigner],
    async function (request, response) {
      try {
        const { loadGithubRepo } = require("../utils/extensions/GithubRepo");
        const { success, reason, data } = await loadGithubRepo(
          reqBody(request),
          response,
        );
        response.status(200).json({
          success,
          reason,
          data,
        });
      } catch (e) {
        console.error(e);
        response.status(200).json({
          success: false,
          reason: e.message || "A processing error occurred.",
          data: {},
        });
      }
      return;
    }
  );

  // gets all branches for a specific repo
  app.post(
    "/ext/github-repo/branches",
    [verifyPayloadIntegrity],
    async function (request, response) {
      try {
        const GithubRepoLoader = require("../utils/extensions/GithubRepo/RepoLoader");
        const allBranches = await new GithubRepoLoader(
          reqBody(request)
        ).getRepoBranches();
        response.status(200).json({
          success: true,
          reason: null,
          data: {
            branches: allBranches,
          },
        });
      } catch (e) {
        console.error(e);
        response.status(400).json({
          success: false,
          reason: e.message,
          data: {
            branches: [],
          },
        });
      }
      return;
    }
  );

  app.post(
    "/ext/youtube-transcript",
    [verifyPayloadIntegrity],
    async function (request, response) {
      try {
        const { loadYouTubeTranscript } = require("../utils/extensions/YoutubeTranscript");
        const { success, reason, data } = await loadYouTubeTranscript(
          reqBody(request)
        );
        response.status(200).json({ success, reason, data });
      } catch (e) {
        console.error(e);
        response.status(400).json({
          success: false,
          reason: e.message,
          data: {
            title: null,
            author: null,
          },
        });
      }
      return;
    }
  );

  app.post(
    "/ext/website-depth",
    [verifyPayloadIntegrity],
    async function (request, response) {
      try {
        const websiteDepth = require("../utils/extensions/WebsiteDepth");
        const { url, depth = 1, maxLinks = 20 } = reqBody(request);
        if (!validURL(url)) return { success: false, reason: "Not a valid URL." };

        const scrapedData = await websiteDepth(url, depth, maxLinks);
        response.status(200).json({ success: true, data: scrapedData });
      } catch (e) {
        console.error(e);
        response.status(400).json({ success: false, reason: e.message });
      }
      return;
    }
  );

  app.post(
    "/ext/confluence",
    [verifyPayloadIntegrity, setDataSigner],
    async function (request, response) {
      try {
        const { loadConfluence } = require("../utils/extensions/Confluence");
        const { success, reason, data } = await loadConfluence(
          reqBody(request),
          response
        );
        response.status(200).json({ success, reason, data });
      } catch (e) {
        console.error(e);
        response.status(400).json({
          success: false,
          reason: e.message,
          data: {
            title: null,
            author: null,
          },
        });
      }
      return;
    }
  );
}

module.exports = extensions;
