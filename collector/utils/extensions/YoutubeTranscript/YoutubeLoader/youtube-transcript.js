const { validYoutubeVideoUrl } = require("../../../url");

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
   * Calculates a preference score for a caption track to determine the best match
   * @param {Object} track - The caption track object from YouTube
   * @param {string} track.languageCode - ISO language code (e.g., 'zh-HK', 'en', 'es')
   * @param {string} track.kind - Track type ('asr' for auto-generated, "" for human-transcribed)
   * @param {string[]} preferredLanguages - Array of language codes in preference order (e.g., ['zh-HK', 'en'])
   * @returns {number} Preference score (lower is better)
   */
  static #calculatePreferenceScore(track, preferredLanguages) {
    // Language preference: index in preferredLanguages array (0 = most preferred)
    const languagePreference = preferredLanguages.indexOf(track.languageCode);
    const languageScore = languagePreference === -1 ? 9999 : languagePreference;

    // Kind bonus: prefer human-transcribed (undefined) over auto-generated ('asr')
    const kindBonus = track.kind === "asr" ? 0.5 : 0;

    return languageScore + kindBonus;
  }

  /**
   * Finds the most suitable caption track based on preferred languages
   * @param {string} videoBody - The raw HTML response from YouTube
   * @param {string[]} preferredLanguages - Array of language codes in preference order
   * @returns {Object|null} The selected caption track or null if none found
   */
  static #findPreferredCaptionTrack(videoBody, preferredLanguages) {
    const captionsConfigJson = videoBody.match(
      /"captions":(.*?),"videoDetails":/s
    );

    const captionsConfig = captionsConfigJson?.[1]
      ? JSON.parse(captionsConfigJson[1])
      : null;

    const captionTracks = captionsConfig
      ? captionsConfig.playerCaptionsTracklistRenderer.captionTracks
      : null;

    if (!captionTracks || captionTracks.length === 0) {
      return null;
    }

    const sortedTracks = [...captionTracks].sort((a, b) => {
      const scoreA = this.#calculatePreferenceScore(a, preferredLanguages);
      const scoreB = this.#calculatePreferenceScore(b, preferredLanguages);
      return scoreA - scoreB;
    });

    return sortedTracks[0];
  }

  /**
   * Fetches video page content and finds the preferred caption track
   * @param {string} videoId - YouTube video ID
   * @param {string[]} preferredLanguages - Array of preferred language codes
   * @returns {Promise<Object>} The preferred caption track
   * @throws {YoutubeTranscriptError} If no suitable caption track is found
   */
  static async #getPreferredCaptionTrack(videoId, preferredLanguages) {
    const videoResponse = await fetch(
      `https://www.youtube.com/watch?v=${videoId}`,
      { credentials: "omit" }
    );
    const videoBody = await videoResponse.text();

    const preferredCaptionTrack = this.#findPreferredCaptionTrack(
      videoBody,
      preferredLanguages
    );

    if (!preferredCaptionTrack) {
      throw new YoutubeTranscriptError(
        "No suitable caption track found for the video"
      );
    }

    return preferredCaptionTrack;
  }

  /**
   * Fetch transcript from YouTube video
   * @param {string} videoId - Video URL or video identifier
   * @param {Object} config - Configuration options
   * @param {string} [config.lang='en'] - Language code (e.g., 'en', 'es', 'fr')
   * @returns {Promise<string>} Video transcript text
   */
  static async fetchTranscript(videoId, config = {}) {
    const preferredLanguages = config?.lang ? [config?.lang, "en"] : ["en"];
    const identifier = this.retrieveVideoId(videoId);

    try {
      const preferredCaptionTrack = await this.#getPreferredCaptionTrack(
        identifier,
        preferredLanguages
      );

      const innerProto = this.#getBase64Protobuf({
        param1: preferredCaptionTrack.kind || "",
        param2: preferredCaptionTrack.languageCode,
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
    if (videoId.length === 11) return videoId; // already a valid ID most likely
    const matchedId = validYoutubeVideoUrl(videoId, true);
    if (matchedId) return matchedId;
    throw new YoutubeTranscriptError(
      "Impossible to retrieve Youtube video ID."
    );
  }
}

module.exports = {
  YoutubeTranscript,
  YoutubeTranscriptError,
};
