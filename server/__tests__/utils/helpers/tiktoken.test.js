const { TokenManager } = require("../../../utils/helpers/tiktoken");

const tm = new TokenManager("gpt-4o");
const prompt = "alpha bravo charlie delta ".repeat(500);
const image =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk";

describe("TokenManager.statsFrom", () => {
  it("counts the text parts of an OpenAI-compatible multimodal message", () => {
    const withImage = tm.statsFrom([
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: image, detail: "high" } },
        ],
      },
    ]);

    expect(withImage).toBe(tm.statsFrom([{ role: "user", content: prompt }]));
  });

  it("counts the text parts of an Anthropic-style multimodal message", () => {
    const withImage = tm.statsFrom([
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/png",
              data: image.split("base64,")[1],
            },
          },
        ],
      },
    ]);

    expect(withImage).toBe(tm.statsFrom([{ role: "user", content: prompt }]));
  });

  it("still counts string content", () => {
    expect(tm.statsFrom([{ role: "user", content: "hello world" }])).toBe(10);
  });
});
