const {
  KeyedSerialExecutor,
} = require("../../../utils/externalChannels/messageQueue");
test("serializes one key while allowing another to proceed and cleans idle keys", async () => {
  const queue = new KeyedSerialExecutor();
  const events = [];
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const first = queue.run("a", async () => {
    events.push("a1");
    await gate;
  });
  const second = queue.run("a", async () => events.push("a2"));
  await queue.run("b", async () => events.push("b"));
  expect(events).toEqual(["a1", "b"]);
  release();
  await Promise.all([first, second]);
  expect(events).toEqual(["a1", "b", "a2"]);
  expect(queue.size).toBe(0);
});
test("rejection and cancellation do not strand subsequent work", async () => {
  const queue = new KeyedSerialExecutor();
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const first = queue.run("a", async () => {
    await gate;
    throw new Error("failed");
  });
  const controller = new AbortController();
  const skipped = jest.fn();
  const second = queue.run("a", skipped, { signal: controller.signal });
  controller.abort();
  const last = queue.run("a", async () => "ok");
  const checks = [
    expect(first).rejects.toThrow("failed"),
    expect(second).rejects.toMatchObject({ name: "AbortError" }),
  ];
  release();
  await Promise.all(checks);
  expect(await last).toBe("ok");
  expect(skipped).not.toHaveBeenCalled();
  expect(queue.size).toBe(0);
});
