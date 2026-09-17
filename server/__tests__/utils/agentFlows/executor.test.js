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

describe("FlowExecutor: replaceVariables", () => {
  const executor = new FlowExecutor();
  executor.variables = {
    plan: 'Step 1: say "hello"\nthen open C:\\temp',
    history: [{ role: "user", content: 'say "hi"' }],
    obj: { a: 1 },
    n: 5,
    token: 'abc"def',
  };

  it("replaces variables in strings, nested objects, and arrays", () => {
    const replaced = executor.replaceVariables({
      url: "https://example.com/${n}",
      headers: [{ key: "Authorization", value: "Bearer ${token}" }],
      nested: { deep: ["${n}", "${missing}"] },
      count: 1,
    });
    expect(replaced.url).toBe("https://example.com/5");
    expect(replaced.headers[0].value).toBe('Bearer abc"def');
    expect(replaced.nested.deep).toEqual(["5", "${missing}"]);
    expect(replaced.count).toBe(1);
  });

  it("stringifies object variables outside of json bodies", () => {
    const replaced = executor.replaceVariables({ instruction: "Use ${obj}" });
    expect(replaced.instruction).toBe('Use {"a":1}');
  });

  it("does not escape values for non-json body types", () => {
    const replaced = executor.replaceVariables({
      bodyType: "text",
      body: "Plan: ${plan}",
    });
    expect(replaced.body).toBe(`Plan: ${executor.variables.plan}`);
  });

  describe("json bodies", () => {
    it("escapes values embedded inside string literals", () => {
      const replaced = executor.replaceVariables({
        bodyType: "json",
        body: '{"prompt":"Implement:\\n${plan}","stream":false}',
        headers: [{ key: "Authorization", value: "Bearer ${token}" }],
      });
      expect(JSON.parse(replaced.body)).toEqual({
        prompt: `Implement:\n${executor.variables.plan}`,
        stream: false,
      });
      expect(replaced.headers[0].value).toBe('Bearer abc"def');
    });

    it("escapes values in nested string literals", () => {
      const replaced = executor.replaceVariables({
        bodyType: "json",
        body: '{"messages":[{"role":"user","content":"${plan}"}]}',
      });
      expect(JSON.parse(replaced.body).messages[0].content).toBe(
        executor.variables.plan
      );
    });

    it("splices bare placeholders raw so objects, arrays, and numbers keep their type", () => {
      const replaced = executor.replaceVariables({
        bodyType: "json",
        body: '{"messages":${history},"meta":${obj},"n":${n},"s":"${n}"}',
      });
      expect(JSON.parse(replaced.body)).toEqual({
        messages: executor.variables.history,
        meta: executor.variables.obj,
        n: 5,
        s: "5",
      });
    });

    it("substitutes a whole-body placeholder raw", () => {
      const replaced = executor.replaceVariables({
        bodyType: "json",
        body: "${history}",
      });
      expect(JSON.parse(replaced.body)).toEqual(executor.variables.history);
    });

    it("leaves unknown placeholders untouched", () => {
      const replaced = executor.replaceVariables({
        bodyType: "json",
        body: '{"x":"${missing}","y":${missing}}',
      });
      expect(replaced.body).toBe('{"x":"${missing}","y":${missing}}');
    });

    it("ignores escaped quotes when deciding if a placeholder is in a string", () => {
      const replaced = executor.replaceVariables({
        bodyType: "json",
        body: '{"title":"say \\"hi\\"","n":${n},"p":"${plan}"}',
      });
      expect(JSON.parse(replaced.body)).toEqual({
        title: 'say "hi"',
        n: 5,
        p: executor.variables.plan,
      });
    });
  });
});
