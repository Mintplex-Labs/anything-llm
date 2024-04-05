/*
 * This is just a custom implementation of the Langchain JS YouTubeLoader class
 * as the dependency for YoutubeTranscript is quite fickle and its a rat race to keep it up
 * and instead of waiting for patches we can just bring this simple script in-house and at least
 * be able to patch it since its so flaky. When we have more connectors we can kill this because
 * it will be a pain to maintain over time.
 */
class YoutubeLoader {
  #videoId;
  #language;
  #addVideoInfo;

  constructor({ videoId = null, language = null, addVideoInfo = false } = {}) {
    if (!videoId) throw new Error("Invalid video id!");
    this.#videoId = videoId;
    this.#language = language;
    this.#addVideoInfo = addVideoInfo;
  }

  /**
   * Extracts the videoId from a YouTube video URL.
   * @param url The URL of the YouTube video.
   * @returns The videoId of the YouTube video.
   */
  static getVideoID(url) {
    const match = url.match(
      /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/
    );
    if (match !== null && match[1].length === 11) {
      return match[1];
    } else {
      throw new Error("Failed to get youtube video id from the url");
    }
  }

  /**
   * Creates a new instance of the YoutubeLoader class from a YouTube video
   * URL.
   * @param url The URL of the YouTube video.
   * @param config Optional configuration options for the YoutubeLoader instance, excluding the videoId.
   * @returns A new instance of the YoutubeLoader class.
   */
  static createFromUrl(url, config = {}) {
    const videoId = YoutubeLoader.getVideoID(url);
    return new YoutubeLoader({ ...config, videoId });
  }

  /**
   * Loads the transcript and video metadata from the specified YouTube
   * video. It uses the youtube-transcript library to fetch the transcript
   * and the youtubei.js library to fetch the video metadata.
   * @returns Langchain like doc that is 1 element with PageContent and
   */
  async load() {
    let transcript;
    const metadata = {
      source: this.#videoId,
    };
    try {
      const { YoutubeTranscript } = require("./youtube-transcript");
      transcript = await YoutubeTranscript.fetchTranscript(this.#videoId, {
        lang: this.#language,
      });
      if (!transcript) {
        throw new Error("Transcription not found");
      }
      if (this.#addVideoInfo) {
        const { Innertube } = require("youtubei.js");
        const youtube = await Innertube.create();
        const info = (await youtube.getBasicInfo(this.#videoId)).basic_info;
        metadata.description = info.short_description;
        metadata.title = info.title;
        metadata.view_count = info.view_count;
        metadata.author = info.author;
      }
    } catch (e) {
      throw new Error(
        `Failed to get YouTube video transcription: ${e?.message}`
      );
    }
    return [
      {
        pageContent: transcript,
        metadata,
      },
    ];
  }
}

module.exports.YoutubeLoader = YoutubeLoader;
