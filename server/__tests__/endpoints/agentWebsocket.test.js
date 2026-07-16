process.env.STORAGE_DIR = __dirname;
process.env.NODE_ENV = "test";

const mockAgentHandler = {
  invocation: { id: 1 },
  aibitat: { abort: jest.fn() },
  closeAlert: jest.fn(),
  createAIbitat: jest.fn(),
  startAgentCluster: jest.fn(),
  init: jest.fn(),
};

jest.mock("../../models/telemetry", () => ({
  Telemetry: { sendTelemetry: jest.fn() },
}));
jest.mock("../../models/workspaceAgentInvocation", () => ({
  WorkspaceAgentInvocation: { close: jest.fn() },
}));
jest.mock("../../utils/agents", () => ({
  AgentHandler: jest.fn(() => mockAgentHandler),
}));

const { WorkspaceAgentInvocation } = require("../../models/workspaceAgentInvocation");
const { agentWebsocket } = require("../../endpoints/agentWebsocket");

describe("agent websocket cancellation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAgentHandler.init.mockResolvedValue(mockAgentHandler);
  });

  it("aborts the active agent when the client disconnects", async () => {
    const listeners = {};
    const socket = {
      on: jest.fn((event, listener) => {
        listeners[event] = listener;
      }),
      close: jest.fn(),
      send: jest.fn(),
    };
    let websocketHandler;
    const app = {
      ws: jest.fn((_path, handler) => {
        websocketHandler = handler;
      }),
    };
    agentWebsocket(app);

    await websocketHandler(socket, { params: { uuid: "invocation-id" } });
    listeners.close();

    expect(mockAgentHandler.aibitat.abort).toHaveBeenCalledTimes(1);
    expect(WorkspaceAgentInvocation.close).toHaveBeenCalledWith(
      "invocation-id"
    );
  });
});
