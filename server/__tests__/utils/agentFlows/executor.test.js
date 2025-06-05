const { FlowExecutor } = require("../../../utils/agentFlows/executor");

describe("FlowExecutor: getValueFromPath", () => {
  const executor = new FlowExecutor();

  it("can handle invalid objects", () => {
    expect(executor.getValueFromPath(null, "a.b.c")).toBe("");
    expect(executor.getValueFromPath(undefined, "a.b.c")).toBe("");
    expect(executor.getValueFromPath(1, "a.b.c")).toBe("");
    expect(executor.getValueFromPath("string", "a.b.c")).toBe("");
    expect(executor.getValueFromPath(true, "a.b.c")).toBe("");
  });

  it("can handle invalid paths", () => {
    const obj = { a: { b: { c: "answer" } } };
    expect(executor.getValueFromPath(obj, -1)).toBe("");
    expect(executor.getValueFromPath(obj, undefined)).toBe("");
    expect(executor.getValueFromPath(obj, [1, 2, 3])).toBe("");
    expect(executor.getValueFromPath(obj, () => { })).toBe("");
  });

  it("should be able to resolve a value from a dot path at various levels", () => {
    let obj = {
      a: {
        prop: "top-prop",
        b: {
          c: "answer",
          num: 100,
          arr: [1, 2, 3],
          subarr: [
            { id: 1, name: "answer2" },
            { id: 2, name: "answer3" },
            { id: 3, name: "answer4" },
          ]
        }
      }
    };
    expect(executor.getValueFromPath(obj, "a.prop")).toBe("top-prop");
    expect(executor.getValueFromPath(obj, "a.b.c")).toBe("answer");
    expect(executor.getValueFromPath(obj, "a.b.num")).toBe(100);
    expect(executor.getValueFromPath(obj, "a.b.arr[0]")).toBe(1);
    expect(executor.getValueFromPath(obj, "a.b.arr[1]")).toBe(2);
    expect(executor.getValueFromPath(obj, "a.b.arr[2]")).toBe(3);
    expect(executor.getValueFromPath(obj, "a.b.subarr[0].id")).toBe(1);
    expect(executor.getValueFromPath(obj, "a.b.subarr[0].name")).toBe("answer2");
    expect(executor.getValueFromPath(obj, "a.b.subarr[1].id")).toBe(2);
    expect(executor.getValueFromPath(obj, "a.b.subarr[2].name")).toBe("answer4");
    expect(executor.getValueFromPath(obj, "a.b.subarr[2].id")).toBe(3);
  });

  it("should return empty string if the path is invalid", () => {
    const result = executor.getValueFromPath({}, "a.b.c");
    expect(result).toBe("");
  });

  it("should return empty string if the object is invalid", () => {
    const result = executor.getValueFromPath(null, "a.b.c");
    expect(result).toBe("");
  });

  it("can return a stringified item if the path target is not an object or array", () => {
    const obj = { a: { b: { c: "answer", numbers: [1, 2, 3] } } };
    expect(executor.getValueFromPath(obj, "a.b")).toEqual(JSON.stringify(obj.a.b));
    expect(executor.getValueFromPath(obj, "a.b.numbers")).toEqual(JSON.stringify(obj.a.b.numbers));
    expect(executor.getValueFromPath(obj, "a.b.c")).toBe("answer");
  });

  it("can return a stringified object if the path target is an array", () => {
    const obj = { a: { b: [1, 2, 3] } };
    expect(executor.getValueFromPath(obj, "a.b")).toEqual(JSON.stringify(obj.a.b));
    expect(executor.getValueFromPath(obj, "a.b[0]")).toBe(1);
    expect(executor.getValueFromPath(obj, "a.b[1]")).toBe(2);
    expect(executor.getValueFromPath(obj, "a.b[2]")).toBe(3);
  });

  it("can find a value by string key traversal", () => {
    const obj = {
      a: {
        items: [
          {
            'my-long-key': [
              { id: 1, name: "answer1" },
              { id: 2, name: "answer2" },
              { id: 3, name: "answer3" },
            ]
          },
        ],
      }
    };
    expect(executor.getValueFromPath(obj, "a.items[0]['my-long-key'][1].id")).toBe(2);
    expect(executor.getValueFromPath(obj, "a.items[0]['my-long-key'][1].name")).toBe("answer2");
  });
});