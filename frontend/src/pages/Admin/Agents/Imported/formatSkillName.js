import { sentenceCase } from "text-case";

const WORD_SEPARATOR_PATTERN = /[^\p{L}\p{M}\p{N}]+/gu;

export function formatSkillName(name) {
  return sentenceCase(String(name ?? ""), {
    stripRegexp: WORD_SEPARATOR_PATTERN,
  });
}
