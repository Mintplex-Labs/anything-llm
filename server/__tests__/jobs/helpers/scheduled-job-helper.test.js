/* eslint-env jest */
jest.mock("../../../jobs/helpers/index.js", () => ({}));
const { agentActionCb } = require("../../../jobs/helpers/scheduled-job-helper");

function sendChunk(handler, uuid, content) {
  handler.send(
    JSON.stringify({
      type: "reportStreamEvent",
      content: { type: "textResponseChunk", uuid, content },
    })
  );
}

describe("agentActionCb", () => {
  it("keeps only the final agent round's text", () => {
    const { handler, state } = agentActionCb();
    sendChunk(handler, "round-1", "<think>r1</think>");
    sendChunk(handler, "round-2", "<think>r2");
    sendChunk(handler, "round-2", "</think>");
    sendChunk(handler, "round-2", "answer");
    expect(state.textResponse).toBe("<think>r2</think>answer");
  });
});
