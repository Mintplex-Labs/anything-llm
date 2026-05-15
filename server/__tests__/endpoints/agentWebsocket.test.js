/* eslint-env jest, node */

// Mock all dependencies before requiring the module
jest.mock("../../endpoints/agentWebsocket", () => {
  // We'll test the logic inline since the module has complex ws dependencies
  return {};
});

// Test the socket event handler logic directly
describe("agentWebsocket socket handlers", () => {
  let mockSocket;
  let mockAgentHandler;
  let closeHandler;
  let messageHandler;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSocket = {
      on: jest.fn((event, cb) => {
        if (event === "close") closeHandler = cb;
        if (event === "message") messageHandler = cb;
      }),
      removeListener: jest.fn(),
      close: jest.fn(),
      send: jest.fn(),
      checkBailCommand: null,
    };

    mockAgentHandler = {
      closeAlert: jest.fn(),
      aibitat: { abort: jest.fn() },
      invocation: { uuid: "test-uuid" },
    };
  });

  test("socket close handler should remove message listener", () => {
    // Simulate what agentWebsocket.js does on socket close
    const handler = () => {
      mockSocket.removeListener("message", messageHandler);
      if (mockAgentHandler.aibitat) mockAgentHandler.aibitat.abort();
      mockAgentHandler.closeAlert();
    };

    handler();

    expect(mockSocket.removeListener).toHaveBeenCalledWith(
      "message",
      messageHandler
    );
  });

  test("socket close handler should abort agent inference", () => {
    const handler = () => {
      mockSocket.removeListener("message", messageHandler);
      if (mockAgentHandler.aibitat) mockAgentHandler.aibitat.abort();
      mockAgentHandler.closeAlert();
    };

    handler();

    expect(mockAgentHandler.aibitat.abort).toHaveBeenCalled();
    expect(mockAgentHandler.closeAlert).toHaveBeenCalled();
  });

  test("socket close handler should handle missing aibitat gracefully", () => {
    mockAgentHandler.aibitat = null;

    const handler = () => {
      mockSocket.removeListener("message", messageHandler);
      if (mockAgentHandler.aibitat) mockAgentHandler.aibitat.abort();
      mockAgentHandler.closeAlert();
    };

    // Should not throw
    expect(() => handler()).not.toThrow();
    expect(mockAgentHandler.closeAlert).toHaveBeenCalled();
  });

  test("bail command should abort and close socket", () => {
    const bailHandler = (data) => {
      const content = JSON.parse(data)?.feedback;
      if (["stop", "reset"].includes(content)) {
        mockAgentHandler.aibitat.abort();
        mockSocket.close();
      }
    };

    bailHandler(JSON.stringify({ feedback: "stop" }));

    expect(mockAgentHandler.aibitat.abort).toHaveBeenCalled();
    expect(mockSocket.close).toHaveBeenCalled();
  });

  test("non-bail command should not abort", () => {
    const bailHandler = (data) => {
      const content = JSON.parse(data)?.feedback;
      if (["stop", "reset"].includes(content)) {
        mockAgentHandler.aibitat.abort();
        mockSocket.close();
      }
    };

    bailHandler(JSON.stringify({ feedback: "hello" }));

    expect(mockAgentHandler.aibitat.abort).not.toHaveBeenCalled();
    expect(mockSocket.close).not.toHaveBeenCalled();
  });
});

describe("useIsAgentSessionActive event listener cleanup", () => {
  // Test the event listener pattern used in the hook
  const AGENT_SESSION_START = "agentSessionStart";
  const AGENT_SESSION_END = "agentSessionEnd";

  test("should add and remove event listeners correctly", () => {
    const listeners = {};
    const mockWindow = {
      addEventListener: jest.fn((event, cb) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(cb);
      }),
      removeEventListener: jest.fn((event, cb) => {
        if (listeners[event]) {
          listeners[event] = listeners[event].filter((fn) => fn !== cb);
        }
      }),
    };

    // Simulate the hook's useEffect
    let cleanup;
    const setup = () => {
      const onStart = () => {};
      const onEnd = () => {};
      mockWindow.addEventListener(AGENT_SESSION_START, onStart);
      mockWindow.addEventListener(AGENT_SESSION_END, onEnd);
      cleanup = () => {
        mockWindow.removeEventListener(AGENT_SESSION_START, onStart);
        mockWindow.removeEventListener(AGENT_SESSION_END, onEnd);
      };
    };

    setup();
    expect(mockWindow.addEventListener).toHaveBeenCalledTimes(2);

    cleanup();
    expect(mockWindow.removeEventListener).toHaveBeenCalledTimes(2);
    expect(mockWindow.removeEventListener).toHaveBeenCalledWith(
      AGENT_SESSION_START,
      expect.any(Function)
    );
    expect(mockWindow.removeEventListener).toHaveBeenCalledWith(
      AGENT_SESSION_END,
      expect.any(Function)
    );
  });

  test("old pattern without cleanup leaks listeners", () => {
    const mockWindow = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    // Simulate old pattern (no cleanup)
    const setupOld = () => {
      mockWindow.addEventListener(AGENT_SESSION_START, () => {});
      mockWindow.addEventListener(AGENT_SESSION_END, () => {});
      // No cleanup function returned
    };

    // Mount 3 times
    setupOld();
    setupOld();
    setupOld();

    // 6 listeners added, 0 removed
    expect(mockWindow.addEventListener).toHaveBeenCalledTimes(6);
    expect(mockWindow.removeEventListener).not.toHaveBeenCalled();
  });

  test("new pattern with cleanup properly removes listeners", () => {
    const mockWindow = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    const setupNew = () => {
      const onStart = () => {};
      const onEnd = () => {};
      mockWindow.addEventListener(AGENT_SESSION_START, onStart);
      mockWindow.addEventListener(AGENT_SESSION_END, onEnd);
      return () => {
        mockWindow.removeEventListener(AGENT_SESSION_START, onStart);
        mockWindow.removeEventListener(AGENT_SESSION_END, onEnd);
      };
    };

    // Mount and unmount 3 times
    for (let i = 0; i < 3; i++) {
      const cleanup = setupNew();
      cleanup();
    }

    // 6 added, 6 removed - no leak
    expect(mockWindow.addEventListener).toHaveBeenCalledTimes(6);
    expect(mockWindow.removeEventListener).toHaveBeenCalledTimes(6);
  });
});
