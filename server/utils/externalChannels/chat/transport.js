const REQUIRED_TRANSPORT_METHODS = Object.freeze([
  "start",
  "append",
  "status",
  "artifact",
  "complete",
  "fail",
  "requestToolApproval",
]);

function assertChannelTransport(transport) {
  for (const method of REQUIRED_TRANSPORT_METHODS) {
    if (typeof transport?.[method] !== "function")
      throw new Error(`Invalid external channel transport: ${method}`);
  }
  return transport;
}

// In-memory support for contract tests; no transport I/O.
function createBufferedTransport() {
  const events = [];
  const record = (event) => events.push(JSON.parse(JSON.stringify(event)));
  return {
    events,
    async start() {
      record({ type: "start" });
    },
    async append(text) {
      record({ type: "textChunk", text });
    },
    async status(text) {
      record({ type: "status", text });
    },
    async artifact(file) {
      record({ type: "artifact", file });
    },
    async complete(result) {
      record({ type: "complete", result });
    },
    async fail(message) {
      record({ type: "failed", message });
    },
    async requestToolApproval(request) {
      record({ type: "toolApprovalRequest", request });
      return { approved: false, message: "No approval transport configured." };
    },
  };
}

module.exports = {
  REQUIRED_TRANSPORT_METHODS,
  assertChannelTransport,
  createBufferedTransport,
};
