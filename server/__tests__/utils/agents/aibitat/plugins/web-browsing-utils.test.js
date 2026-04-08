/* eslint-env jest, node */
const {
  normalizeBaiduSearchReferences,
} = require("../../../../../utils/agents/aibitat/plugins/web-browsing-utils");

describe("normalizeBaiduSearchReferences", () => {
  test("maps web references into AnythingLLM citation shape", () => {
    const results = normalizeBaiduSearchReferences([
      {
        type: "web",
        title: "AnythingLLM",
        url: "https://anythingllm.com",
        snippet: "Private AI application.",
      },
      {
        type: "web",
        title: "Mintplex Labs",
        url: "https://mintplexlabs.com",
        content: "Build useful AI tools.",
      },
    ]);

    expect(results).toEqual([
      {
        title: "AnythingLLM",
        link: "https://anythingllm.com",
        snippet: "Private AI application.",
      },
      {
        title: "Mintplex Labs",
        link: "https://mintplexlabs.com",
        snippet: "Build useful AI tools.",
      },
    ]);
  });

  test("filters non-web, incomplete, and duplicate references", () => {
    const results = normalizeBaiduSearchReferences([
      {
        type: "web",
        title: "AnythingLLM",
        url: "https://anythingllm.com",
        snippet: "Private AI application.",
      },
      {
        type: "document",
        title: "Spec",
        url: "https://example.com/spec.pdf",
        snippet: "Should be ignored.",
      },
      {
        type: "web",
        title: "",
        url: "https://example.com/missing-title",
      },
      {
        type: "web",
        title: "AnythingLLM",
        url: "https://anythingllm.com",
        snippet: "Duplicate URL should be removed.",
      },
    ]);

    expect(results).toEqual([
      {
        title: "AnythingLLM",
        link: "https://anythingllm.com",
        snippet: "Private AI application.",
      },
    ]);
  });
});
