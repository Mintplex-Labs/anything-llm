const { listenToJob } = require("../src/utils/jobStream.js");
const { isProcessingStatus } = require("../src/utils/documentStatus.js");

jest.useFakeTimers();

describe("listenToJob", () => {
  test("receives status events", () => {
    let instance;
    global.EventSource = class {
      constructor() {
        instance = this;
      }
      close() {}
    };
    const statuses = [];
    listenToJob("123", (s) => statuses.push(s));
    instance.onmessage({ data: JSON.stringify({ status: "downloading" }) });
    instance.onmessage({ data: JSON.stringify({ status: "failed" }) });
    expect(statuses).toEqual(["DOWNLOADING", "FAILED"]);
  });

  test("reconnects after error", () => {
    let instances = 0;
    const handlers = [];
    global.EventSource = class {
      constructor() {
        instances++;
        handlers.push(this);
      }
      close() {}
    };
    listenToJob("abc", () => {});
    expect(instances).toBe(1);
    handlers[0].onerror();
    jest.runOnlyPendingTimers();
    expect(instances).toBe(2);
  });

  test("simulated failures at each stage", () => {
    let instance;
    global.EventSource = class {
      constructor() {
        instance = this;
      }
      close() {}
    };
    const received = [];
    listenToJob("job", (s) => received.push(s));
    const stages = [
      "PENDING",
      "DOWNLOADING",
      "CHUNKING",
      "EMBEDDING",
      "INDEXING",
    ];
    stages.forEach((stage) => {
      instance.onmessage({ data: JSON.stringify({ status: stage }) });
      expect(isProcessingStatus(stage)).toBe(true);
      instance.onmessage({ data: JSON.stringify({ status: "FAILED" }) });
      expect(received[received.length - 1]).toBe("FAILED");
    });
  });
});
