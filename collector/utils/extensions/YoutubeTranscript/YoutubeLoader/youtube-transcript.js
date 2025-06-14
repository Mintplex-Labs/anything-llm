const { parse } = require("node-html-parser");
const RE_YOUTUBE =
  /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36,gzip(gfe)";

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
   * Manually encode protobuf message for simple two-string structure in order to avoid using protobufjs.
   * @param {Object} message - The message object with param1 and param2
   * @returns {string} Base64 encoded protobuf
   */
  static #getBase64Protobuf(message) {
    // Manual protobuf encoding for simple structure:
    // Field 1 (param1): tag 0x0A (field 1, wire type 2 for string)
    // Field 2 (param2): tag 0x12 (field 2, wire type 2 for string)
    
    const encodeString = (fieldNumber, str) => {
      const utf8Bytes = Buffer.from(str, 'utf8');
      const length = utf8Bytes.length;
      const tag = (fieldNumber << 3) | 2; // wire type 2 for string
      
      // Encode varint length
      const lengthBytes = [];
      let len = length;
      while (len >= 0x80) {
        lengthBytes.push((len & 0xFF) | 0x80);
        len >>>= 7;
      }
      lengthBytes.push(len & 0xFF);
      
      return Buffer.concat([
        Buffer.from([tag]),
        Buffer.from(lengthBytes),
        utf8Bytes
      ]);
    };
    
    const field1 = encodeString(1, message.param1);
    const field2 = encodeString(2, message.param2);
    
    const combined = Buffer.concat([field1, field2]);
    return combined.toString('base64');
  }

  /**
   * Fetch transcript from YTB Video using direct API call
   * @param videoId Video url or video identifier
   * @param config Object with lang param (eg: en, es, hk, uk) format.
   */
  static async fetchTranscript(videoId, config = {}) {
    const identifier = this.retrieveVideoId(videoId);
    const lang = config?.lang ?? "en";
    
    try {
      // Create protobuf messages for the API request
      const message1 = {
        param1: 'asr',
        param2: lang,
      };

      const protobufMessage1 = this.#getBase64Protobuf(message1);

      const message2 = {
        param1: identifier,
        param2: protobufMessage1,
      };

      const params = this.#getBase64Protobuf(message2);

      // Use Youtube API https://www.youtube.com/youtubei/v1/get_transcript instead of https://www.youtube.com/ptracking from youtube scripts.
      // Refer to https://github.com/algolia/youtube-captions-scraper/issues/30#issuecomment-2313319115

      // Make direct API call to YouTube's transcript endpoint
      const url = 'https://www.youtube.com/youtubei/v1/get_transcript';
      const headers = { 
        'Content-Type': 'application/json',
        'User-Agent': USER_AGENT
      };
      const data = {
        context: {
          client: {
            clientName: 'WEB',
            clientVersion: '2.20240826.01.00',
          },
        },
        params,
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      // Check if transcript data exists in the response
      if (!responseData.actions || 
          !responseData.actions[0] || 
          !responseData.actions[0].updateEngagementPanelAction ||
          !responseData.actions[0].updateEngagementPanelAction.content ||
          !responseData.actions[0].updateEngagementPanelAction.content.transcriptRenderer) {
        throw new Error("No transcript data found in response");
      }

      const transcriptRenderer = responseData.actions[0].updateEngagementPanelAction.content.transcriptRenderer;
      
      if (!transcriptRenderer.content ||
          !transcriptRenderer.content.transcriptSearchPanelRenderer ||
          !transcriptRenderer.content.transcriptSearchPanelRenderer.body ||
          !transcriptRenderer.content.transcriptSearchPanelRenderer.body.transcriptSegmentListRenderer ||
          !transcriptRenderer.content.transcriptSearchPanelRenderer.body.transcriptSegmentListRenderer.initialSegments) {
        throw new Error("Transcript segments not found in response");
      }

      const segments = transcriptRenderer.content.transcriptSearchPanelRenderer.body.transcriptSegmentListRenderer.initialSegments;

      // Extract and combine all transcript text
      let transcript = "";
      for (const segment of segments) {
        if (segment.transcriptSegmentRenderer && segment.transcriptSegmentRenderer.snippet) {
          const text = segment.transcriptSegmentRenderer.snippet.runs
            .map((run) => run.text)
            .join('');
          transcript += text + " ";
        }
      }

      // Trim extra whitespace
      return transcript.trim().replace(/\s+/g, " ");
    } catch (e) {
      throw new YoutubeTranscriptError(e.message || e);
    }
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
