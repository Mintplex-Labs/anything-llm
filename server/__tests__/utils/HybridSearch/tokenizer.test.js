/* eslint-env jest, node */
const { tokenize } = require("../../../utils/HybridSearch/tokenizers/bm25");

describe("tokenize — smart preservation", () => {
  it("preserves URLs as single tokens", () => {
    const out = tokenize("see https://example.com/docs/api-v2 for details");
    expect(out).toEqual(expect.arrayContaining(["https://example.com/docs/api-v2"]));
  });

  it("preserves snake_case identifiers", () => {
    const out = tokenize("call get_user_by_id with the id");
    expect(out).toEqual(expect.arrayContaining(["get_user_by_id"]));
  });

  it("preserves PascalCase identifiers", () => {
    const out = tokenize("UserAccountManager handles auth");
    expect(out).toEqual(expect.arrayContaining(["useraccountmanager"]));
  });

  it("preserves version strings as a single token", () => {
    const out = tokenize("upgraded to v2.1.0-beta last week");
    expect(out).toEqual(expect.arrayContaining(["v2.1.0-beta"]));
  });

  it("preserves long alphanumeric IDs (UUID, hashes)", () => {
    const id = "f47ac10b58cc4372a567";
    const out = tokenize(`error from ${id} please check`);
    expect(out).toEqual(expect.arrayContaining([id]));
  });
});

describe("tokenize — multilingual stopwords", () => {
  it("strips English stopwords", () => {
    expect(tokenize("the quick brown fox")).toEqual(["quick", "brown", "fox"]);
  });

  it("strips French stopwords", () => {
    expect(tokenize("le renard brun est rapide")).toEqual(
      expect.not.arrayContaining(["le", "est"])
    );
  });

  it("strips German stopwords", () => {
    expect(tokenize("der schnelle braune fuchs")).toEqual(
      expect.not.arrayContaining(["der"])
    );
  });

  it("strips Spanish stopwords", () => {
    expect(tokenize("el zorro marrón rápido")).toEqual(
      expect.not.arrayContaining(["el"])
    );
  });
});

describe("tokenize — robustness", () => {
  it("handles nullish, non-string, empty", () => {
    expect(tokenize(null)).toEqual([]);
    expect(tokenize(undefined)).toEqual([]);
    expect(tokenize(42)).toEqual([]);
    expect(tokenize("")).toEqual([]);
  });

  it("handles unicode letters from non-Latin scripts", () => {
    const out = tokenize("café naïve résumé");
    expect(out).toEqual(expect.arrayContaining(["café", "naïve", "résumé"]));
  });

  it("custom stopwords override defaults", () => {
    const out = tokenize("foo bar baz", { stopwords: new Set(["foo"]) });
    expect(out).toEqual(["bar", "baz"]);
  });
});
