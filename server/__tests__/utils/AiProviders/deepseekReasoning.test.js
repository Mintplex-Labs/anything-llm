/* eslint-env jest */
jest.mock("../../../utils/AiProviders/modelMap", () => ({
  MODEL_MAP: new Map([["deepseek", 8192]]),
}));
const { DeepSeekLLM } = require("../../../utils/AiProviders/deepseek");

describe("DeepSeekLLM reasoning stream", () => {
  beforeEach(() => {
    process.env.DEEPSEEK_API_KEY = "test";
  });

  test("streams reasoning content before final answer", async () => {
    const mockResponse = {
      write: jest.fn(),
      on: jest.fn(),
      removeListener: jest.fn(),
    };

    async function* generator() {
      yield { choices: [{ delta: { reasoning_content: "because" } }] };
      yield { choices: [{ delta: { reasoning_content: " why" } }] };
      yield { choices: [{ delta: { content: "answer" } }] };
      yield { choices: [{ finish_reason: "stop" }] };
    }
    const stream = generator();
    stream.endMeasurement = jest.fn();

    const llm = new DeepSeekLLM({
      embedTextInput: jest.fn(),
      embedChunks: jest.fn(),
    });

    const result = await llm.handleStream(mockResponse, stream, {
      uuid: "1",
      sources: [],
    });

    const writes = mockResponse.write.mock.calls.map(([data]) =>
      JSON.parse(data.replace(/^data: /, "").trim())
    );

    expect(writes[0].textResponse).toBe("<think>because");
    expect(writes[1].textResponse).toBe(" why");
    expect(writes[2].textResponse).toBe("</think>");
    expect(writes[3].textResponse).toBe("answer");
    expect(result).toBe("<think>because why</think>answer");
  });
});
