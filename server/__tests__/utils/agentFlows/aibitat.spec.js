const AIbitat = require("../../../utils/agents/aibitat");

/**
 * Tests the variable handling flow in agent flows:
 *
 * 1. LLM -> returns function call with ${vars}
 * 2. AIbitat -> identifies flow_* function
 * 3. AIbitat -> passes raw ${vars} to flow executor
 * 4. Flow Executor -> replaces ${vars} with real values (tested in executor.spec.js)
 * 5. Flow Executor -> executes step with real values (tested in executor.spec.js)
 * 6. Flow Executor -> stores results in variables (tested in executor.spec.js)
 * 7. Flow Executor -> repeats 4-6 for next step (tested in executor.spec.js)
 *
 * This test focuses on steps 1-3:
 * LLM -> raw ${vars} -> AIbitat -> raw ${vars} -> Flow Executor
 *
 * The rest of the flow (steps 4-7) is tested in executor.spec.js:
 * Flow Executor -> replace vars -> execute step -> store results -> replace vars -> execute step
 */
describe("AIbitat Flow Variable Handling", () => {
  it("preserves raw ${var} references when calling flow functions", async () => {
    const aibitat = new AIbitat();
    let receivedArgs = null;

    // Step 3: Flow function that verifies it gets raw ${vars}
    aibitat.function({
      name: "flow_test",
      handler: (args) => {
        receivedArgs = args;
        return "done";
      }
    });

    // Step 1 & 2: Mock provider that simulates LLM returning function call
    const mockProvider = {
      complete: async () => ({
        functionCall: {
          name: "flow_test", // AIbitat sees flow_* and handles specially
          arguments: {
            input1: "${instructions1}", // Raw variable reference
            input2: "${instructions2}"  // Raw variable reference
          }
        }
      })
    };

    // Run the flow
    await aibitat.handleExecution(
      mockProvider,
      [], // messages not needed
      [], // functions not needed
      "test-agent"
    );

    // Verify Step 3: Flow function got raw ${vars} unchanged
    expect(receivedArgs).toEqual({
      input1: "${instructions1}",  // Still raw references
      input2: "${instructions2}"   // Not replaced yet
    });
  });
});