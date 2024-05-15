const { parse } = require("node-html-parser");
const axios = require('axios');

const RE_YOUTUBE =
  /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;

const API_KEYS = [
  'AIzaSyBA4WDjnqTuypdcQeJHJ7jfSk0ILk9TyuA',
  'AIzaSyDLYrXs73QlcildnloqG7gTF0o1hVdHeZY',
  // Add more API keys as needed
];

class YoutubeTranscriptError extends Error {
  constructor(message) {
    super(`[YoutubeTranscript] ${message}`);
  }
}

/**
 * Class to retrieve transcript if exist
 */
class YoutubeTranscript {
  /**
   * Fetch transcript from YTB Video
   * @param videoId Video url or video identifier
   * @param config Object with lang param (eg: en, es, hk, uk) format.
   * Will just grab the first caption if it can find one, so no special lang caption support.
   */
  static async fetchTranscript(videoId, config = {}) {
    const identifier = this.retrieveVideoId(videoId);
    const lang = config?.lang ?? "en";
    try {
      const transcriptUrl = await this.fetchTranscriptUrl(identifier);

      if (!transcriptUrl)
        throw new Error("Failed to locate a transcript for this video!");

      // Result is hopefully some XML.
      const transcriptXML = await axios.get(transcriptUrl).then(res => res.data);

      let transcript = "";
      const chunks = parse(transcriptXML).querySelectorAll("text");
      for (const chunk of chunks) {
        transcript += chunk.text;
      }

      return transcript;
    } catch (e) {
      throw new YoutubeTranscriptError(e.message);
    }
  }

  static async fetchTranscriptUrl(videoId) {
    try {
      const apiKey = this.getApiKey();
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`);
      
      const captions = response.data.items[0]?.contentDetails?.caption;
      if (!captions) throw new Error('No captions found for this video.');

      await new Promise(resolve => setTimeout(resolve, 60000)); // Add a delay of 1 minute (60000 milliseconds)
      
      return `http://video.google.com/timedtext?lang=en&v=${videoId}`;
    } catch (error) {
      throw new YoutubeTranscriptError(`Error fetching transcript URL: ${error.message}`);
    }
  }

  static getApiKey() {
    if (API_KEYS.length === 0) {
      throw new YoutubeTranscriptError("No API keys available.");
    }
    const keyIndex = Math.floor(Math.random() * API_KEYS.length);
    return API_KEYS[keyIndex];
  }

  /**
   * Retrieve video id from url or string
   * @param videoId video url or video id
   */
  static retrieveVideoId(videoId) {
    if (videoId.length === 11) {
      return videoId;
    }
    const matchId = videoId.match(RE_YOUTUBE);
    if (matchId && matchId.length) {
      return matchId[1];
    }
    throw new YoutubeTranscriptError(
      "Impossible to retrieve Youtube video ID."
    );
  }
}

module.exports = {
  YoutubeTranscript,
  YoutubeTranscriptError,
};
