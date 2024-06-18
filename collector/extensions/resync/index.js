const { getLinkText } = require("../../processLink");

/**
 * Fetches the content of a raw link. Returns the content as a text string of the link in question.
 */
async function resyncLink({ link }, response) {
  if (!link) throw new Error('Invalid link provided');
  try {
    const { success, content = null } = await getLinkText(link);
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
 */
async function resyncYouTube({ link }, response) {
  if (!link) throw new Error('Invalid link provided');
  try {
    const { fetchVideoTranscriptContent } = require("../../utils/extensions/YoutubeTranscript");
    const { success, reason, content } = await fetchVideoTranscriptContent({ url: link });
    if (!success) throw new Error(`Failed to get YouTube video transcript. ${reason}`);
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
  resyncLink,
  resyncYouTube
}