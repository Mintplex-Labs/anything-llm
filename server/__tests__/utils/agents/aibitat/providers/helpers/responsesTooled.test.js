const {
  responsesTooledStream,
  responsesTooledComplete,
} = require("../../../../../../utils/agents/aibitat/providers/helpers/responsesTooled.js");

describe("temperature forwarding on the Responses API", () => {
  const messages = [{ role: "user", content: "hi" }];

  function fakeClient({ stream = false } = {}) {
    const create = jest.fn(async () => {
      if (!stream) return { output: [], usage: null };
      return (async function* () {
        yield { type: "response.output_text.delta", delta: "ok" };
      })();
    });
    return { client: { responses: { create } }, create };
  }

  it("sends the provider temperature on complete and stream", async () => {
    const complete = fakeClient();
    await responsesTooledComplete(complete.client, "m", messages, [], {
      provider: { temperature: 0.3 },
    });
    expect(complete.create.mock.calls[0][0].temperature).toBe(0.3);

    const streamed = fakeClient({ stream: true });
    await responsesTooledStream(streamed.client, "m", messages, [], null, {
      provider: { temperature: 0 },
    });
    expect(streamed.create.mock.calls[0][0].temperature).toBe(0);
  });

  it("omits temperature entirely when the provider has none", async () => {
    const complete = fakeClient();
    await responsesTooledComplete(complete.client, "m", messages, [], {
      provider: {},
    });
    expect(complete.create.mock.calls[0][0]).not.toHaveProperty("temperature");

    const streamed = fakeClient({ stream: true });
    await responsesTooledStream(streamed.client, "m", messages, [], null, {
      provider: {},
    });
    expect(streamed.create.mock.calls[0][0]).not.toHaveProperty("temperature");
  });
});
