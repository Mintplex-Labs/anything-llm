const KoboldCPPProvider = require("../../../../../utils/agents/aibitat/providers/koboldcpp");

const ORIGINAL_ENV = process.env;
const messages = [{ role: "user", content: "Look up the weather." }];
const functions = [
  {
    name: "weather",
    description: "Look up the weather",
    parameters: { type: "object", properties: {} },
  },
];

beforeEach(() => {
  process.env = {
    ...ORIGINAL_ENV,
    KOBOLD_CPP_BASE_PATH: "http://localhost:5001/v1",
    KOBOLD_CPP_MODEL_PREF: "local-model",
  };
  delete process.env.PROVIDER_DISABLE_NATIVE_TOOL_CALLING;
  delete process.env.KOBOLD_CPP_MAX_TOKENS;
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
  jest.restoreAllMocks();
});

describe.each(["complete", "stream"])("KoboldCPP native %s", (method) => {
  async function requestBody() {
    const provider = new KoboldCPPProvider();
    const create = jest
      .spyOn(provider.client.chat.completions, "create")
      .mockImplementation(async ({ stream }) => {
        if (stream) {
          return (async function* () {
            yield { choices: [{ delta: { content: "ok" } }] };
          })();
        }
        return {
          choices: [{ message: { content: "ok" } }],
        };
      });

    await provider[method](messages, functions);
    expect(create).toHaveBeenCalledTimes(1);
    return create.mock.calls[0][0];
  }

  it("forwards the configured maximum response tokens", async () => {
    process.env.KOBOLD_CPP_MAX_TOKENS = "2048";

    const body = await requestBody();

    expect(body.max_tokens).toBe(2048);
    expect(body.tools[0].function.name).toBe("weather");
  });

  it.each([undefined, "", "0"])(
    "omits max_tokens when the setting is %j",
    async (setting) => {
      if (setting !== undefined) process.env.KOBOLD_CPP_MAX_TOKENS = setting;

      expect(await requestBody()).not.toHaveProperty("max_tokens");
    }
  );
});
