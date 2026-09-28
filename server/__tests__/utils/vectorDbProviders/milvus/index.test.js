/* eslint-env jest */
const { Milvus } = require("../../../../utils/vectorDbProviders/milvus");

// Milvus rejects a collection name unless the first character is an underscore
// or a letter and the rest are letters, numbers or underscores.
const VALID_COLLECTION_NAME = /^[A-Za-z_][A-Za-z0-9_]*$/;

describe("Milvus.normalize", () => {
  const milvus = new Milvus();

  test("keeps the current collection name for a slug starting with a letter", () => {
    // Existing collections were created under this name and must still be found.
    expect(milvus.normalize("my-workspace")).toBe("anythingllm_my_workspace");
  });

  test.each([
    // Workspace named "2024 Reports"
    ["2024-reports", "anythingllm_2024_reports"],
    // A name with no Latin characters (eg: Chinese) falls back to a uuid slug
    [
      "2794eac1-66e6-4072-886f-32418c75e130",
      "anythingllm_2794eac1_66e6_4072_886f_32418c75e130",
    ],
  ])("prefixes a slug starting with a digit (%s)", (slug, expected) => {
    const name = milvus.normalize(slug);
    expect(name).toBe(expected);
    expect(name).toMatch(VALID_COLLECTION_NAME);
  });
});
