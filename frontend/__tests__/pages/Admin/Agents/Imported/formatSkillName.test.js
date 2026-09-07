import { formatSkillName } from "../../../../../src/pages/Admin/Agents/Imported/formatSkillName.js";

describe("formatSkillName", () => {
  describe("non-Latin scripts (regression for #6271)", () => {
    it.each([
      ["図面印刷", "図面印刷"],
      ["绘图打印", "绘图打印"],
      ["한국어 스킬", "한국어 스킬"],
      ["Ελληνικά", "Ελληνικά"],
      ["Кириллица", "Кириллица"],
      ["العربية", "العربية"],
      ["ｆｕｌｌｗｉｄｔｈ", "Ｆｕｌｌｗｉｄｔｈ"],
    ])("preserves %s", (input, expected) => {
      expect(formatSkillName(input)).toBe(expected);
    });

    it.each([
      ["日本語 skill", "日本語 skill"],
      ["skill 中文", "Skill 中文"],
      ["日本語Skill", "日本語skill"],
      ["skill日本語", "Skill日本語"],
      ["drawing-印刷_tool", "Drawing 印刷 tool"],
    ])("keeps every script in a mixed-script name: %s", (input, expected) => {
      expect(formatSkillName(input)).toBe(expected);
    });
  });

  describe("accents and combining marks", () => {
    it("keeps precomposed accented letters and casts the first letter", () => {
      expect(formatSkillName("éCLAIR")).toBe("Éclair");
      expect(formatSkillName("café au lait")).toBe("Café au lait");
      expect(formatSkillName("straße")).toBe("Straße");
      expect(formatSkillName("ÜBER cool")).toBe("Über cool");
    });

    it("keeps decomposed combining marks attached to their base letter", () => {
      expect(formatSkillName("cafe\u0301 au lait")).toBe("Cafe\u0301 au lait");
      expect(formatSkillName("e\u0301clair")).toBe("E\u0301clair");
    });
  });

  describe("existing English sentence-case behavior", () => {
    it.each([
      ["hello-world", "Hello world"],
      ["hello_world", "Hello world"],
      ["HELLO_WORLD", "Hello world"],
      ["helloWorld", "Hello world"],
      ["HTMLParser", "Html parser"],
      ["Drawing Printing", "Drawing printing"],
      ["Hello world", "Hello world"],
      ["a", "A"],
      ["A", "A"],
    ])("formats %s as %s", (input, expected) => {
      expect(formatSkillName(input)).toBe(expected);
    });

    it("is idempotent", () => {
      for (const name of [
        "hello-world",
        "図面印刷",
        "日本語 skill",
        "café au lait",
        "Skill 123",
      ]) {
        const once = formatSkillName(name);
        expect(formatSkillName(once)).toBe(once);
      }
    });
  });

  describe("numbers", () => {
    it.each([
      ["skill 123", "Skill 123"],
      ["skill123", "Skill123"],
      ["123skill", "123skill"],
      ["0", "0"],
      ["-1", "1"],
      ["①②③", "①②③"],
      ["x²", "X²"],
    ])("keeps digits in %s", (input, expected) => {
      expect(formatSkillName(input)).toBe(expected);
    });
  });

  describe("separators and punctuation", () => {
    it.each([
      ["hello, world!", "Hello world"],
      ["hello   world", "Hello world"],
      ["hello---world", "Hello world"],
      ["  padded  ", "Padded"],
      ["line\nbreak", "Line break"],
      ["tab\there", "Tab here"],
      ["nul\u0000byte", "Nul byte"],
      ["a.b/c\\d", "A b c d"],
      ["(parens) [brackets] {braces}", "Parens brackets braces"],
      ['quote\'s "name"', "Quote s name"],
    ])(
      "collapses non-word characters in %s to single spaces",
      (input, expected) => {
        expect(formatSkillName(input)).toBe(expected);
      }
    );

    it("strips emoji and other symbols since they are not letters, marks, or numbers", () => {
      expect(formatSkillName("emoji 🚀 skill")).toBe("Emoji skill");
      expect(formatSkillName("🚀")).toBe("");
      expect(formatSkillName("$100 tool")).toBe("100 tool");
    });

    it("returns an empty string when nothing but separators remain", () => {
      expect(formatSkillName("!!!")).toBe("");
      expect(formatSkillName("   ")).toBe("");
      expect(formatSkillName("\n\t")).toBe("");
      expect(formatSkillName("---___")).toBe("");
    });
  });

  describe("absent and non-string input", () => {
    it("returns an empty string for null, undefined, and empty values", () => {
      expect(formatSkillName(null)).toBe("");
      expect(formatSkillName(undefined)).toBe("");
      expect(formatSkillName("")).toBe("");
      expect(formatSkillName()).toBe("");
    });

    it("coerces primitives to strings instead of throwing", () => {
      expect(formatSkillName(0)).toBe("0");
      expect(formatSkillName(42)).toBe("42");
      expect(formatSkillName(-1)).toBe("1");
      expect(formatSkillName(1.5)).toBe("1 5");
      expect(formatSkillName(true)).toBe("True");
      expect(formatSkillName(false)).toBe("False");
    });

    it("coerces arrays and objects to strings instead of throwing", () => {
      expect(formatSkillName([])).toBe("");
      expect(formatSkillName(["a", "b"])).toBe("A b");
      expect(typeof formatSkillName({})).toBe("string");
      expect(typeof formatSkillName(() => {})).toBe("string");
    });
  });

  describe("length", () => {
    it("does not truncate long names", () => {
      const long = "a".repeat(5000);
      const out = formatSkillName(long);
      expect(out).toHaveLength(5000);
      expect(out).toBe("A" + "a".repeat(4999));
    });

    it("does not truncate long CJK names", () => {
      const long = "図".repeat(2000);
      expect(formatSkillName(long)).toBe(long);
    });
  });
});
