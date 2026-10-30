const AIbitat = require("../../../../../../../utils/agents/aibitat");
const {
  runSectionAgent,
} = require("../../../../../../../utils/agents/aibitat/plugins/create-files/pptx/section-agent");

const SUBMITTED_SLIDES = [
  {
    layout: "content",
    title: "Section title",
    content: ["Real bullet from the sub-agent"],
    notes: "Speaker notes",
  },
];

function makeParent() {
  const parent = new AIbitat({
    provider: "openai",
    model: "gpt-4o",
    handlerProps: { log: jest.fn() },
  });
  parent.socket = { send: jest.fn() };
  parent.introspect = jest.fn();
  return parent;
}

function makeFakeProvider({ streaming }) {
  return {
    supportsAgentStreaming: streaming,
    attachHandlerProps: jest.fn(),
    isModelLoaded: jest.fn().mockResolvedValue(true),
    resetCumulativeUsage: jest.fn(),
    getCumulativeUsage: jest.fn().mockReturnValue({}),
    stream: jest
      .fn()
      .mockResolvedValueOnce({
        functionCall: {
          name: "submit-section-slides",
          arguments: { slides: SUBMITTED_SLIDES },
        },
      })
      .mockResolvedValueOnce({ textResponse: "done" }),
    complete: jest
      .fn()
      .mockResolvedValueOnce({
        functionCall: {
          name: "submit-section-slides",
          arguments: { slides: SUBMITTED_SLIDES },
        },
      })
      .mockResolvedValueOnce({ textResponse: "done" }),
  };
}

describe("runSectionAgent provider wiring (issue #6897)", () => {
  afterEach(() => jest.restoreAllMocks());

  test("streaming provider: sub-agent slides are returned, not fallback slides", async () => {
    const fake = makeFakeProvider({ streaming: true });
    jest.spyOn(AIbitat.prototype, "getProviderForConfig").mockReturnValue(fake);

    const { slides } = await runSectionAgent({
      parentAibitat: makeParent(),
      section: { title: "Section title" },
      presentationTitle: "Demo",
    });

    expect(fake.stream).toHaveBeenCalled();
    // First call must receive the real messages/functions, not the provider
    // object shifted one slot (the pre-fix call passed provider first).
    const [firstMessages, firstFunctions] = fake.stream.mock.calls[0];
    expect(Array.isArray(firstMessages)).toBe(true);
    expect(firstMessages[0].role).toBe("system");
    expect(Array.isArray(firstFunctions)).toBe(true);
    expect(slides).toEqual(SUBMITTED_SLIDES);
  });

  test("non-streaming provider: sub-agent slides are returned, not fallback slides", async () => {
    const fake = makeFakeProvider({ streaming: false });
    jest.spyOn(AIbitat.prototype, "getProviderForConfig").mockReturnValue(fake);

    const { slides } = await runSectionAgent({
      parentAibitat: makeParent(),
      section: { title: "Section title" },
      presentationTitle: "Demo",
    });

    expect(fake.complete).toHaveBeenCalled();
    const [firstMessages, firstFunctions] = fake.complete.mock.calls[0];
    expect(Array.isArray(firstMessages)).toBe(true);
    expect(firstMessages[0].role).toBe("system");
    expect(Array.isArray(firstFunctions)).toBe(true);
    expect(slides).toEqual(SUBMITTED_SLIDES);
  });
});
