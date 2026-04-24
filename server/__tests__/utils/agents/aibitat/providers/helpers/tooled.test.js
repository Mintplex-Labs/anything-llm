jest.mock("uuid", () => ({ v4: jest.fn(() => "test-uuid") }), { virtual: true });
jest.mock("../../../../../../utils/http", () => ({
  safeJsonParse: (value, fallback) => {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  },
}));

const { tooledStream } = require("../../../../../../utils/agents/aibitat/providers/helpers/tooled");

function makeClient(calls) {
  return {
    chat: {
      completions: {
        create: jest.fn(async (payload) => {
          calls.push(payload);
          return (async function* stream() {
            yield {
              choices: [
                {
                  delta: { content: "ok" },
                },
              ],
            };
          })();
        }),
      },
    },
  };
}

describe("tooledStream stream_options", () => {
  it("includes usage reporting by default", async () => {
    const calls = [];
    const client = makeClient(calls);

    await tooledStream(client, "test-model", [{ role: "user", content: "hi" }]);

    expect(calls[0].stream_options).toEqual({ include_usage: true });
  });

  it("omits stream_options when a provider disables them", async () => {
    const calls = [];
    const client = makeClient(calls);

    await tooledStream(client, "test-model", [{ role: "user", content: "hi" }], [], null, {
      streamOptions: false,
    });

    expect(calls[0]).not.toHaveProperty("stream_options");
  });
});
