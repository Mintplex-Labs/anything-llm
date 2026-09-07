import assert from "node:assert/strict";
import test from "node:test";
import formatTokenUsage from "../src/utils/chat/formatTokenUsage.js";

test("formats input and output token counts", () => {
  assert.equal(
    formatTokenUsage({ prompt_tokens: 1200, completion_tokens: 340 }),
    "Input: 1,200 | Output: 340 tokens"
  );
});

test("preserves zero token counts", () => {
  assert.equal(
    formatTokenUsage({ prompt_tokens: 0, completion_tokens: 0 }),
    "Input: 0 | Output: 0 tokens"
  );
});

test("does not invent counts for missing fields", () => {
  assert.equal(
    formatTokenUsage({ prompt_tokens: 1200 }),
    "Input: 1,200 tokens"
  );
  assert.equal(
    formatTokenUsage({ completion_tokens: 340 }),
    "Output: 340 tokens"
  );
});

test("returns an empty string when token usage is unavailable", () => {
  assert.equal(formatTokenUsage(), "");
  assert.equal(formatTokenUsage(null), "");
  assert.equal(formatTokenUsage({ duration: 2, outputTps: 10 }), "");
});

test("ignores invalid counts while preserving a valid count", () => {
  for (const value of [
    undefined,
    null,
    -1,
    1.5,
    NaN,
    Infinity,
    "1200",
    Number.MAX_SAFE_INTEGER + 1,
  ]) {
    assert.equal(
      formatTokenUsage({ prompt_tokens: value, completion_tokens: 0 }),
      "Output: 0 tokens"
    );
    assert.equal(
      formatTokenUsage({ prompt_tokens: 0, completion_tokens: value }),
      "Input: 0 tokens"
    );
  }
});
