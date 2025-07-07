class YoutubeTranscriptError extends Error {
  constructor(message) {
    super(`[YoutubeTranscript] ${message}`);
  }
}

/**
 * Handles fetching and parsing YouTube video transcripts
 */
class YoutubeTranscript {
  /**
   * Encodes a string as a protobuf field
   * @param {number} fieldNumber - The protobuf field number
   * @param {string} str - The string to encode
   * @returns {Buffer} Encoded protobuf field
   */
  static #encodeProtobufString(fieldNumber, str) {
    const utf8Bytes = Buffer.from(str, "utf8");
    const tag = (fieldNumber << 3) | 2; // wire type 2 for string
    const lengthBytes = this.#encodeVarint(utf8Bytes.length);

    return Buffer.concat([
      Buffer.from([tag]),
      Buffer.from(lengthBytes),
      utf8Bytes,
    ]);
  }

  /**
   * Encodes a number as a protobuf varint
   * @param {number} value - The number to encode
   * @returns {number[]} Encoded varint bytes
   */
  static #encodeVarint(value) {
    const bytes = [];
    while (value >= 0x80) {
      bytes.push((value & 0x7f) | 0x80);
      value >>>= 7;
    }
    bytes.push(value);
    return bytes;
  }

  /**
   * Creates a base64 encoded protobuf message
   * @param {Object} param - The parameters to encode
   * @param {string} param.param1 - First parameter
   * @param {string} param.param2 - Second parameter
   * @returns {string} Base64 encoded protobuf
   */
  static #getBase64Protobuf({ param1, param2 }) {
    const field1 = this.#encodeProtobufString(1, param1);
    const field2 = this.#encodeProtobufString(2, param2);
    return Buffer.concat([field1, field2]).toString("base64");
  }

  /**
   * Extracts transcript text from YouTube API response
   * @param {Object} responseData - The YouTube API response
   * @returns {string} Combined transcript text
   */
  static #extractTranscriptFromResponse(responseData) {
    const transcriptRenderer =
      responseData.actions?.[0]?.updateEngagementPanelAction?.content
        ?.transcriptRenderer;
    if (!transcriptRenderer) {
      throw new Error("No transcript data found in response");
    }

    const segments =
      transcriptRenderer.content?.transcriptSearchPanelRenderer?.body
        ?.transcriptSegmentListRenderer?.initialSegments;
    if (!segments) {
      throw new Error("Transcript segments not found in response");
    }

    return segments
      .map((segment) => {
        const runs = segment.transcriptSegmentRenderer?.snippet?.runs;
        return runs ? runs.map((run) => run.text).join("") : "";
      })
      .filter((text) => text)
      .join(" ")
      .trim()
      .replace(/\s+/g, " ");
  }

  /**
   * Fetch transcript from YouTube video
   * @param {string} videoId - Video URL or video identifier
   * @param {Object} config - Configuration options
   * @param {string} [config.lang='en'] - Language code (e.g., 'en', 'es', 'fr')
   * @returns {Promise<string>} Video transcript text
   */
  static async fetchTranscript(videoId, config = {}) {
    const identifier = this.retrieveVideoId(videoId);
    const lang = config?.lang ?? "en";

    try {
      const innerProto = this.#getBase64Protobuf({
        param1: "asr",
        param2: lang,
      });
      const params = this.#getBase64Protobuf({
        param1: identifier,
        param2: innerProto,
      });

      const response = await fetch(
        "https://www.youtube.com/youtubei/v1/get_transcript",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36,gzip(gfe)",
          },
          body: JSON.stringify({
            context: {
              client: {
                clientName: "WEB",
                clientVersion: "2.20240826.01.00",
              },
            },
            params,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      return this.#extractTranscriptFromResponse(responseData);
    } catch (e) {
      throw new YoutubeTranscriptError(e.message || e);
    }
  }

  /**
   * Extract video ID from a YouTube URL or verify an existing ID
   * @param {string} videoId - Video URL or ID
   * @returns {string} YouTube video ID
   */
  static retrieveVideoId(videoId) {
    if (videoId.length === 11) return videoId;

    const RE_YOUTUBE =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const matchId = videoId.match(RE_YOUTUBE);

    if (matchId?.[1]) return matchId[1];
    throw new YoutubeTranscriptError(
      "Impossible to retrieve Youtube video ID."
    );
  }
}

module.exports = {
  YoutubeTranscript,
  YoutubeTranscriptError,
};
