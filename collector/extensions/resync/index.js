const { getLinkText } = require("../../processLink");

/**
 * Fetches the content of a raw link. Returns the content as a text string of the link in question.
 * @param {object} data - metadata from document (eg: link) 
 * @param {import("../../middleware/setDataSigner").ResponseWithSigner} response
 */
async function resyncLink({ link }, response) {
  if (!link) throw new Error('Invalid link provided');
  try {
    const { success, content = null } = await getLinkText(link);
    if (!success) throw new Error(`Failed to sync link content. ${reason}`);
    response.status(200).json({ success, content });
  } catch (e) {
    console.error(e);
    response.status(200).json({
      success: false,
      content: null,
    });
  }
}

/**
 * Fetches the content of a YouTube link. Returns the content as a text string of the video in question.
 * We offer this as there may be some videos where a transcription could be manually edited after initial scraping
 * but in general - transcriptions often never change.
 * @param {object} data - metadata from document (eg: link) 
 * @param {import("../../middleware/setDataSigner").ResponseWithSigner} response
 */
async function resyncYouTube({ link }, response) {
  if (!link) throw new Error('Invalid link provided');
  try {
    const { fetchVideoTranscriptContent } = require("../../utils/extensions/YoutubeTranscript");
    const { success, reason, content } = await fetchVideoTranscriptContent({ url: link });
    if (!success) throw new Error(`Failed to sync YouTube video transcript. ${reason}`);
    response.status(200).json({ success, content });
  } catch (e) {
    console.error(e);
    response.status(200).json({
      success: false,
      content: null,
    });
  }
}

/**
 * Fetches the content of a specific confluence page via its chunkSource. 
 * Returns the content as a text string of the page in question and only that page.
 * @param {object} data - metadata from document (eg: chunkSource) 
 * @param {import("../../middleware/setDataSigner").ResponseWithSigner} response
 */
async function resyncConfluence({ chunkSource }, response) {
  if (!chunkSource) throw new Error('Invalid source property provided');
  try {
    // Confluence data is `payload` encrypted. So we need to expand its
    // encrypted payload back into query params so we can reFetch the page with same access token/params.
    const source = response.locals.encryptionWorker.expandPayload(chunkSource);
    const { fetchConfluencePage } = require("../../utils/extensions/Confluence");
    const { success, reason, content } = await fetchConfluencePage({
      pageUrl: `https:${source.pathname}`, // need to add back the real protocol
      baseUrl: source.searchParams.get('baseUrl'),
      accessToken: source.searchParams.get('token'),
      username: source.searchParams.get('username'),
    });

    if (!success) throw new Error(`Failed to sync Confluence page content. ${reason}`);
    response.status(200).json({ success, content });
  } catch (e) {
    console.error(e);
    response.status(200).json({
      success: false,
      content: null,
    });
  }
}

/**
 * Fetches the content of a specific confluence page via its chunkSource. 
 * Returns the content as a text string of the page in question and only that page.
 * @param {object} data - metadata from document (eg: chunkSource) 
 * @param {import("../../middleware/setDataSigner").ResponseWithSigner} response
 */
async function resyncGithub({ chunkSource }, response) {
  if (!chunkSource) throw new Error('Invalid source property provided');
  try {
    // Github file data is `payload` encrypted (might contain PAT). So we need to expand its
    // encrypted payload back into query params so we can reFetch the page with same access token/params.
    const source = response.locals.encryptionWorker.expandPayload(chunkSource);
    const { fetchGithubFile } = require("../../utils/extensions/GithubRepo");
    const { success, reason, content } = await fetchGithubFile({
      repoUrl: `https:${source.pathname}`, // need to add back the real protocol
      branch: source.searchParams.get('branch'),
      accessToken: source.searchParams.get('pat'),
      sourceFilePath: source.searchParams.get('path'),
    });

    if (!success) throw new Error(`Failed to sync Github file content. ${reason}`);
    response.status(200).json({ success, content });
  } catch (e) {
    console.error(e);
    response.status(200).json({
      success: false,
      content: null,
    });
  }
}

module.exports = {
  link: resyncLink,
  youtube: resyncYouTube,
  confluence: resyncConfluence,
  github: resyncGithub,
}