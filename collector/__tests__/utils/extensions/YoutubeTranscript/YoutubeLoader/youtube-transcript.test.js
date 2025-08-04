const { YoutubeTranscript } = require("../../../../../utils/extensions/YoutubeTranscript/YoutubeLoader/youtube-transcript.js");

describe("YoutubeTranscript", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it("should fetch transcript from YouTube video", async () => {
    const videoId = "BJjsfNO5JTo";

    const mockResponse = {
      actions: [
        {
          updateEngagementPanelAction: {
            content: {
              transcriptRenderer: {
                content: {
                  transcriptSearchPanelRenderer: {
                    body: {
                      transcriptSegmentListRenderer: {
                        initialSegments: [
                          {
                            transcriptSegmentRenderer: {
                              snippet: {
                                runs: [
                                  { text: "Hello" },
                                  { text: " world" },
                                ],
                              },
                            },
                          },
                          {
                            transcriptSegmentRenderer: {
                              snippet: {
                                runs: [
                                  { text: "Another" },
                                  { text: " segment" },
                                ],
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const transcript = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: "en",
    });

    expect(global.fetch).toHaveBeenCalled();
    expect(transcript).toBe("Hello world Another segment");
  });
});
