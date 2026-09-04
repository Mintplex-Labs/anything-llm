import assert from "node:assert/strict";
import test from "node:test";
import { formatSkillName } from "../src/pages/Admin/Agents/Imported/formatSkillName.js";

test("preserves Japanese and Chinese skill names", () => {
  assert.equal(formatSkillName("図面印刷"), "図面印刷");
  assert.equal(formatSkillName("绘图打印"), "绘图打印");
});

test("preserves CJK characters in mixed-language skill names", () => {
  assert.equal(formatSkillName("日本語 skill"), "日本語 skill");
  assert.equal(formatSkillName("skill 中文"), "Skill 中文");
});

test("preserves precomposed and decomposed accents", () => {
  assert.equal(formatSkillName("éCLAIR"), "Éclair");
  assert.equal(formatSkillName("cafe\u0301 au lait"), "Cafe\u0301 au lait");
});

test("keeps existing English sentence-case behavior", () => {
  assert.equal(formatSkillName("hello-world"), "Hello world");
  assert.equal(formatSkillName("HELLO_WORLD"), "Hello world");
  assert.equal(formatSkillName("helloWorld"), "Hello world");
});

test("handles numbers, punctuation, and empty values", () => {
  assert.equal(formatSkillName("skill 123"), "Skill 123");
  assert.equal(formatSkillName("hello, world!"), "Hello world");
  assert.equal(formatSkillName("!!!"), "");
  assert.equal(formatSkillName(""), "");
  assert.equal(formatSkillName(null), "");
  assert.equal(formatSkillName(undefined), "");
});
