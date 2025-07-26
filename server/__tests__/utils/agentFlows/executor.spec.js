const { FlowExecutor } = require("../../../utils/agentFlows/executor");
const { FLOW_TYPES } = require("../../../utils/agentFlows/flowTypes");

// Mock the executors
jest.mock("../../../utils/agentFlows/executors/api-call", () => jest.fn());
jest.mock("../../../utils/agentFlows/executors/llm-instruction", () => jest.fn());
jest.mock("../../../utils/agentFlows/executors/web-scraping", () => jest.fn());

describe("FlowExecutor", () => {
  let executor;
  let mockIntrospect;
  let mockLogger;
  let mockApiCall;
  let mockLLMInstruction;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Get fresh references to mocked functions
    mockApiCall = require("../../../utils/agentFlows/executors/api-call");
    mockLLMInstruction = require("../../../utils/agentFlows/executors/llm-instruction");

    mockIntrospect = jest.fn();
    mockLogger = jest.fn();
    executor = new FlowExecutor();
    executor.attachLogging(mockIntrospect, mockLogger);
  });

  describe("Variable Handling", () => {
    const mockFlow = {
      config: {
        steps: [
          {
            type: FLOW_TYPES.START.type,
            config: {
              variables: [
                { name: "instructions1", value: "Original instruction value" },
                { name: "userInput", value: "Initial user input" }
              ]
            }
          },
          {
            type: FLOW_TYPES.API_CALL.type,
            config: {
              url: "http://test.com",
              method: "POST",
              bodyType: "json",
              body: JSON.stringify({
                messages: [
                  {
                    role: "user",
                    content: "${instructions1}\n${userInput}"
                  }
                ]
              }),
              resultVariable: "apiResult"
            }
          },
          {
            type: FLOW_TYPES.LLM_INSTRUCTION.type,
            config: {
              instruction: "Process ${apiResult}",
              resultVariable: "processedResult"
            }
          }
        ]
      }
    };

    test("should initialize variables from start block", async () => {
      // Execute flow without runtime variables
      await executor.executeFlow(mockFlow);

      // Variables should be set from start block
      expect(executor.getVariable("userInput")).toBe("Initial user input");
      expect(executor.getVariable("instructions1")).toBe("Original instruction value");
    });

    test("should allow explicit variable updates from step execution", async () => {
      const mockApiResponse = { data: "API response data" };
      mockApiCall.mockResolvedValueOnce(mockApiResponse);

      // Execute just the API call step
      const apiStep = mockFlow.config.steps[1];
      await executor.executeStep(apiStep);

      // Verify API result was stored
      expect(executor.getVariable("apiResult")).toEqual(mockApiResponse);
      expect(mockLogger).toHaveBeenCalledWith(
        expect.stringContaining("[FlowExecutor] Variable \"apiResult\" updated")
      );
    });

    test("should prevent direct variable modifications from model responses", async () => {
      // Simulate a model trying to modify a flow variable through its response
      mockLLMInstruction.mockImplementation(async (config, context) => {
        // Model can only read variables through getVariable
        const currentValue = context.getVariable("instructions1");
        expect(currentValue).toBe("Original instruction value");

        // Model shouldn't have direct write access to variables
        expect(context.setVariable).toBeUndefined();
        return "LLM response";
      });

      await executor.executeFlow(mockFlow);

      // The original instruction value should be preserved
      expect(executor.getVariable("instructions1")).toBe("Original instruction value");
    });

    test("should maintain variable updates between steps", async () => {
      const stepOneResult = { step: "one", data: "First step data" };
      mockApiCall.mockResolvedValueOnce(stepOneResult);

      const modifiedFlow = {
        config: {
          steps: [
            // Start block with initial variables
            mockFlow.config.steps[0],
            // First step stores result
            {
              type: FLOW_TYPES.API_CALL.type,
              config: {
                url: "http://test.com",
                method: "GET",
                resultVariable: "stepResult"
              }
            },
            // Second step uses the stored result
            {
              type: FLOW_TYPES.LLM_INSTRUCTION.type,
              config: {
                instruction: "Process ${stepResult}",
                resultVariable: "finalResult"
              }
            }
          ]
        }
      };

      // Execute just the API call step
      const apiStep = modifiedFlow.config.steps[1];
      await executor.executeStep(apiStep);

      // Verify the step result was stored and maintained
      expect(executor.getVariable("stepResult")).toEqual(stepOneResult);
      expect(mockLogger).toHaveBeenCalledWith(
        expect.stringContaining("[FlowExecutor] Variable \"stepResult\" updated")
      );
    });

    test("should handle nested variable references correctly", async () => {
      const nestedFlow = {
        config: {
          steps: [
            {
              type: FLOW_TYPES.START.type,
              config: {
                variables: [
                  { name: "data", value: { key: "value" } },
                  { name: "path", value: "data.key" }
                ]
              }
            },
            {
              type: FLOW_TYPES.LLM_INSTRUCTION.type,
              config: {
                instruction: "Value is ${path}",
                resultVariable: "result"
              }
            }
          ]
        }
      };

      await executor.executeFlow(nestedFlow);

      // Should correctly resolve nested variable references
      expect(executor.getValueFromPath(executor.variables, "data.key")).toBe("value");
    });

    test("should handle array indexing in variable paths", async () => {
      const arrayFlow = {
        config: {
          steps: [
            {
              type: FLOW_TYPES.START.type,
              config: {
                variables: [
                  {
                    name: "items",
                    value: ["first", "second", "third"]
                  }
                ]
              }
            },
            {
              type: FLOW_TYPES.LLM_INSTRUCTION.type,
              config: {
                instruction: "Item is ${items[1]}",
                resultVariable: "result"
              }
            }
          ]
        }
      };

      await executor.executeFlow(arrayFlow);

      // Should correctly handle array indexing
      expect(executor.getValueFromPath(executor.variables, "items[1]")).toBe("second");
    });

    test("should log variable updates", async () => {
      await executor.executeFlow(mockFlow);

      // Should log variable updates
      expect(mockLogger).toHaveBeenCalledWith(
        expect.stringContaining("[FlowExecutor] Variable \"userInput\" updated")
      );
      expect(mockLogger).toHaveBeenCalledWith(
        expect.stringContaining("[FlowExecutor] Variable \"instructions1\" updated")
      );
    });
  });
});