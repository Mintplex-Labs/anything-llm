const {
  formatMessagesForTools,
  tooledComplete,
  tooledStream,
} = require("../../../utils/agents/aibitat/providers/helpers/tooled");

async function* streamChunks(chunks) {
  for (const chunk of chunks) yield chunk;
}

describe("OpenAI-compatible tooled helpers", () => {
  const functions = [
    {
      name: "lookup",
      description: "Look up a value",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string" },
        },
      },
    },
  ];

  test("preserves reasoning_content at the assistant message top level when rebuilding tool calls", () => {
    const reasoningContent = "first reason\nsecond reason";
    const formatted = formatMessagesForTools(
      [
        { role: "user", content: "Use a tool" },
        {
          role: "function",
          name: "lookup",
          content: "tool result",
          originalFunctionCall: {
            id: "call_123",
            name: "lookup",
            arguments: { query: "alpha" },
            reasoning_content: reasoningContent,
          },
        },
      ],
      { injectReasoningContent: true }
    );

    const assistantToolCallMessage = formatted[1];
    expect(assistantToolCallMessage).toEqual(
      expect.objectContaining({
        role: "assistant",
        content: null,
        reasoning_content: reasoningContent,
      })
    );
    expect(assistantToolCallMessage.tool_calls[0]).not.toHaveProperty(
      "reasoning_content"
    );
  });

  test("round-trips reasoning_content from tooledComplete functionCall into the next request messages", async () => {
    const reasoningContent = "DeepSeek reasoning that must come back";
    const client = {
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: null,
                  reasoning_content: reasoningContent,
                  tool_calls: [
                    {
                      id: "call_abc",
                      type: "function",
                      function: {
                        name: "lookup",
                        arguments: JSON.stringify({ query: "alpha" }),
                      },
                    },
                  ],
                },
              },
            ],
            usage: { prompt_tokens: 1, completion_tokens: 1 },
          }),
        },
      },
    };

    const result = await tooledComplete(
      client,
      "deepseek-reasoner",
      [{ role: "user", content: "Use a tool" }],
      functions,
      () => 0,
      { injectReasoningContent: true }
    );

    expect(result.functionCall).toEqual(
      expect.objectContaining({
        id: "call_abc",
        name: "lookup",
        arguments: { query: "alpha" },
        reasoning_content: reasoningContent,
      })
    );

    const nextMessages = formatMessagesForTools(
      [
        {
          role: "function",
          name: "lookup",
          content: "tool result",
          originalFunctionCall: result.functionCall,
        },
      ],
      { injectReasoningContent: true }
    );

    expect(nextMessages[0].reasoning_content).toBe(reasoningContent);
  });

  test("accumulates streaming reasoning_content chunks before returning a functionCall", async () => {
    const client = {
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue(
            streamChunks([
              { choices: [{ delta: { reasoning_content: "part one " } }] },
              { choices: [{ delta: { reasoning_content: "part two " } }] },
              {
                choices: [
                  {
                    delta: {
                      tool_calls: [
                        {
                          index: 0,
                          id: "call_stream",
                          type: "function",
                          function: {
                            name: "lookup",
                            arguments: '{"query":',
                          },
                        },
                      ],
                    },
                  },
                ],
              },
              {
                choices: [
                  {
                    delta: {
                      reasoning_content: "part three",
                      tool_calls: [
                        {
                          index: 0,
                          function: {
                            arguments: '"alpha"}',
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            ])
          ),
        },
      },
    };

    const result = await tooledStream(
      client,
      "deepseek-reasoner",
      [{ role: "user", content: "Use a tool" }],
      functions,
      null,
      { injectReasoningContent: true }
    );

    expect(result.functionCall).toEqual(
      expect.objectContaining({
        id: "call_stream",
        name: "lookup",
        arguments: { query: "alpha" },
        reasoning_content: "part one part two part three",
      })
    );
  });

  test("preserves reasoning_content on retryWithError when tool arguments fail to parse", async () => {
    const reasoningContent = "Reasoning must survive retry path";
    const client = {
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: null,
                  reasoning_content: reasoningContent,
                  tool_calls: [
                    {
                      id: "call_bad_args",
                      type: "function",
                      function: {
                        name: "lookup",
                        arguments: "not json",
                      },
                    },
                  ],
                },
              },
            ],
            usage: { prompt_tokens: 1, completion_tokens: 1 },
          }),
        },
      },
    };

    const result = await tooledComplete(
      client,
      "deepseek-reasoner",
      [{ role: "user", content: "Use a tool" }],
      functions,
      () => 0,
      { injectReasoningContent: true }
    );

    expect(result.retryWithError.originalFunctionCall).toEqual(
      expect.objectContaining({
        id: "call_bad_args",
        name: "lookup",
        arguments: "not json",
        reasoning_content: reasoningContent,
      })
    );
  });

  test("does not inject reasoning_content by default for non-DeepSeek paths", () => {
    const formatted = formatMessagesForTools([
      {
        role: "function",
        name: "lookup",
        content: "tool result",
        originalFunctionCall: {
          id: "call_plain",
          name: "lookup",
          arguments: { query: "alpha" },
        },
      },
    ]);

    expect(formatted[0]).not.toHaveProperty("reasoning_content");
  });
});
