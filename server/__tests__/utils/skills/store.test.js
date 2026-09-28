/* eslint-env jest, node */
const fs = require("fs");
const os = require("os");
const path = require("path");
const {
  SkillStore,
  isValidName,
  parseFrontmatter,
  serializeSkill,
} = require("../../../utils/skills/store");

/**
 * Build a SkillStore rooted in a throwaway temp directory so tests never
 * touch the real storage folder.
 */
function makeStore() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "aio-skills-test-"));
  return { store: new SkillStore(base), base };
}

function cleanStore({ base }) {
  fs.rmSync(base, { recursive: true, force: true });
}

describe("isValidName", () => {
  it("accepts spec-valid names", () => {
    expect(isValidName("pdf-processing")).toBe(true);
    expect(isValidName("data-analysis-2")).toBe(true);
    expect(isValidName("a")).toBe(true);
  });

  it("rejects uppercase, spaces, and dots", () => {
    expect(isValidName("PDF-Processing")).toBe(false);
    expect(isValidName("my skill")).toBe(false);
    expect(isValidName("my.skill")).toBe(false);
  });

  it("rejects leading/trailing and consecutive hyphens", () => {
    expect(isValidName("-pdf")).toBe(false);
    expect(isValidName("pdf-")).toBe(false);
    expect(isValidName("pdf--processing")).toBe(false);
  });

  it("rejects names over 64 characters", () => {
    expect(isValidName("a".repeat(65))).toBe(false);
    expect(isValidName("a".repeat(64))).toBe(true);
  });

  it("rejects non-strings", () => {
    expect(isValidName(null)).toBe(false);
    expect(isValidName(undefined)).toBe(false);
    expect(isValidName(42)).toBe(false);
  });
});

describe("parseFrontmatter", () => {
  it("parses required fields plus body", () => {
    const raw = [
      "---",
      "name: pdf-processing",
      "description: Extracts text from PDFs. Use when working with PDFs.",
      "---",
      "",
      "# Steps",
      "1. Do the thing",
    ].join("\n");
    const parsed = parseFrontmatter(raw);
    expect(parsed).not.toBeNull();
    expect(parsed.fields.name).toBe("pdf-processing");
    expect(parsed.fields.description).toBe(
      "Extracts text from PDFs. Use when working with PDFs."
    );
    expect(parsed.body).toBe("# Steps\n1. Do the thing");
  });

  it("returns null when there is no frontmatter block", () => {
    expect(parseFrontmatter("# Just a heading\n\nbody")).toBeNull();
    expect(parseFrontmatter("")).toBeNull();
  });

  it("parses quoted description values", () => {
    const raw = '---\nname: quoted\ndescription: "It has: a colon"\n---\nbody';
    expect(parseFrontmatter(raw).fields.description).toBe("It has: a colon");
  });

  it("parses nested metadata maps", () => {
    const raw = [
      "---",
      "name: meta-skill",
      "description: has metadata",
      "metadata:",
      "  author: example-org",
      '  version: "1.0"',
      "---",
      "body",
    ].join("\n");
    const parsed = parseFrontmatter(raw);
    expect(parsed.fields.metadata).toEqual({
      author: "example-org",
      version: "1.0",
    });
  });

  it("parses CRLF line endings", () => {
    const raw = "---\r\nname: crlf\r\ndescription: windows style\r\n---\r\nbody";
    const parsed = parseFrontmatter(raw);
    expect(parsed.fields.name).toBe("crlf");
    expect(parsed.body).toBe("body");
  });

  it("parses a literal (|) block scalar", () => {
    const raw = [
      "---",
      "name: block-literal",
      "description: >",
      "  A multi-line",
      "  folded description.",
      "---",
      "body",
    ].join("\n");
    const parsed = parseFrontmatter(raw);
    expect(parsed.fields.description).toBe("A multi-line folded description.");
  });

  it("parses a literal (|) block scalar preserving newlines", () => {
    const raw = [
      "---",
      "name: block-literal2",
      "description: |",
      "  line one",
      "  line two",
      "---",
      "body",
    ].join("\n");
    const parsed = parseFrontmatter(raw);
    expect(parsed.fields.description).toBe("line one\nline two");
  });

  it("unescapes quotes in double- and single-quoted values", () => {
    const raw = [
      "---",
      'name: quoting',
      'description: "He said \\"hi\\" \\\\ there"',
      "license: 'it''s quoted'",
      "---",
      "body",
    ].join("\n");
    const parsed = parseFrontmatter(raw);
    expect(parsed.fields.description).toBe('He said "hi" \\ there');
    expect(parsed.fields.license).toBe("it's quoted");
  });
});

describe("serializeSkill", () => {
  it("round-trips through parseFrontmatter", () => {
    const original = {
      name: "round-trip",
      description: "Does the thing. Use when testing.",
      license: "MIT",
      compatibility: "Requires internet",
      body: "# Title\n\nDo stuff.",
      metadata: { author: "me" },
    };
    const parsed = parseFrontmatter(serializeSkill(original));
    expect(parsed.fields.name).toBe(original.name);
    expect(parsed.fields.description).toBe(original.description);
    expect(parsed.fields.license).toBe(original.license);
    expect(parsed.fields.compatibility).toBe(original.compatibility);
    expect(parsed.fields.metadata).toEqual(original.metadata);
    expect(parsed.body).toBe(original.body);
  });

  it("omits optional fields that are not provided", () => {
    const raw = serializeSkill({
      name: "minimal",
      description: "just the required fields",
      body: "body",
    });
    expect(raw).not.toContain("license:");
    expect(raw).not.toContain("metadata:");
    expect(raw).not.toContain("compatibility:");
  });

  it("round-trips descriptions containing quotes and escapes", () => {
    const original = {
      name: "tricky-quotes",
      description: 'He said "hello" to the \'world\' \\ and it worked',
      body: "body",
    };
    const parsed = parseFrontmatter(serializeSkill(original));
    expect(parsed.fields.description).toBe(original.description);
  });

  it("round-trips descriptions with colons and unicode", () => {
    const original = {
      name: "colon-unicode",
      description: "Note: this is a test — café, naïve, 日本語",
      body: "body",
    };
    const parsed = parseFrontmatter(serializeSkill(original));
    expect(parsed.fields.description).toBe(original.description);
  });

  it("round-trips a maximum-length (1024 char) description", () => {
    const original = {
      name: "long-desc",
      description: "x".repeat(1024),
      body: "body",
    };
    const parsed = parseFrontmatter(serializeSkill(original));
    expect(parsed.fields.description).toBe(original.description);
  });

  it("round-trips an empty body", () => {
    const original = { name: "no-body", description: "just meta", body: "" };
    const parsed = parseFrontmatter(serializeSkill(original));
    expect(parsed.fields.name).toBe("no-body");
    expect(parsed.fields.description).toBe("just meta");
  });

  it("round-trips metadata and optional fields with special characters", () => {
    const original = {
      name: "meta-special",
      description: "has special meta",
      license: 'Apache "2.0" style',
      compatibility: "needs: network",
      body: "body",
      metadata: { note: "a: b 'quoted' \\ path" },
    };
    const parsed = parseFrontmatter(serializeSkill(original));
    expect(parsed.fields.license).toBe(original.license);
    expect(parsed.fields.compatibility).toBe(original.compatibility);
    expect(parsed.fields.metadata).toEqual(original.metadata);
  });
});

describe("SkillStore", () => {
  let harness;
  beforeEach(() => {
    harness = makeStore();
  });
  afterEach(() => cleanStore(harness));

  describe("save()", () => {
    it("writes a SKILL.md that get() can read back", () => {
      const saved = harness.store.save({
        name: "my-skill",
        description: "A skill for tests. Use when testing.",
        body: "# My Skill\n\nInstructions here.",
      });
      expect(saved.name).toBe("my-skill");
      expect(saved.description).toBe("A skill for tests. Use when testing.");
      expect(saved.body).toBe("# My Skill\n\nInstructions here.");

      const file = path.join(harness.base, "my-skill", "SKILL.md");
      expect(fs.existsSync(file)).toBe(true);
      expect(harness.store.get("my-skill")).toEqual(
        expect.objectContaining({ name: "my-skill" })
      );
    });

    it("overwrites an existing skill", () => {
      harness.store.save({
        name: "overwrite-me",
        description: "first version",
        body: "old",
      });
      const updated = harness.store.save({
        name: "overwrite-me",
        description: "second version",
        body: "new",
      });
      expect(updated.description).toBe("second version");
      expect(harness.store.list()).toHaveLength(1);
    });

    it("rejects invalid names with a clear error message", () => {
      expect(() =>
        harness.store.save({ name: "Bad Name!", description: "x" })
      ).toThrow(/1-64 chars/i);
    });

    it("rejects missing or oversized descriptions", () => {
      expect(() => harness.store.save({ name: "no-desc", body: "x" })).toThrow(
        /description/i
      );
      expect(() =>
        harness.store.save({
          name: "long-desc",
          description: "x".repeat(1025),
        })
      ).toThrow(/1024/);
    });
  });

  describe("list()", () => {
    it("returns valid skills sorted by name and marks broken ones", () => {
      harness.store.save({
        name: "zeta",
        description: "last in order",
        body: "z",
      });
      harness.store.save({ name: "alpha", description: "first", body: "a" });

      // A file with no frontmatter must be reported as broken, not crash the
      // listing or silently disappear.
      fs.mkdirSync(path.join(harness.base, "broken-skill"), { recursive: true });
      fs.writeFileSync(
        path.join(harness.base, "broken-skill", "SKILL.md"),
        "just some markdown with no frontmatter"
      );
      // A directory without a SKILL.md must also be reported as broken.
      fs.mkdirSync(path.join(harness.base, "empty-skill"), { recursive: true });

      const list = harness.store.list();
      expect(list.filter((s) => !s.error).map((s) => s.name)).toEqual([
        "alpha",
        "zeta",
      ]);
      const broken = list.filter((s) => s.error);
      expect(broken).toHaveLength(2);
      expect(broken.map((s) => s.dir).sort()).toEqual([
        "broken-skill",
        "empty-skill",
      ]);
      expect(broken.every((s) => typeof s.error === "string")).toBe(true);
    });

    it("returns an empty array when the directory does not exist yet", () => {
      expect(harness.store.list()).toEqual([]);
    });

    it("flags skills whose frontmatter name does not match the folder", () => {
      fs.mkdirSync(path.join(harness.base, "real-folder"), { recursive: true });
      fs.writeFileSync(
        path.join(harness.base, "real-folder", "SKILL.md"),
        "---\nname: frontmatter-name\ndescription: mismatch\n---\nbody",
        "utf8"
      );
      const list = harness.store.list();
      expect(list).toHaveLength(1);
      expect(list[0].name).toBe("frontmatter-name");
      expect(list[0].error).toMatch(/does not match its folder/);
    });

    it("caches results and invalidates on save", () => {
      expect(harness.store.list()).toEqual([]);
      const first = harness.store.list();
      const second = harness.store.list();
      expect(second).toBe(first); // cached

      // A save() must invalidate the cache immediately.
      harness.store.save({ name: "fresh", description: "new", body: "b" });
      expect(harness.store.list().map((s) => s.name)).toEqual(["fresh"]);
    });
  });

  describe("rename()", () => {
    it("renames the directory and rewrites the frontmatter name", () => {
      harness.store.save({
        name: "old-name",
        description: "will be renamed",
        body: "x",
      });
      const record = harness.store.rename("old-name", "new-name");
      expect(record).toEqual(
        expect.objectContaining({ name: "new-name" })
      );
      expect(
        fs.existsSync(path.join(harness.base, "new-name", "SKILL.md"))
      ).toBe(true);
      expect(
        fs.existsSync(path.join(harness.base, "old-name", "SKILL.md"))
      ).toBe(false);
      expect(harness.store.get("new-name").name).toBe("new-name");
      expect(
        harness.store.list().filter((s) => s.error)
      ).toHaveLength(0);
    });

    it("returns null for invalid names or missing skills", () => {
      expect(harness.store.rename("nope", "also-nope")).toBeNull();
      expect(harness.store.rename("old", "Bad Name")).toBeNull();
    });
  });

  describe("get()", () => {
    it("returns null for missing skills", () => {
      expect(harness.store.get("does-not-exist")).toBeNull();
    });

    it("throws on invalid names instead of reading arbitrary paths", () => {
      expect(() => harness.store.get("../secret")).toThrow(/Invalid skill name/);
    });
  });

  describe("delete()", () => {
    it("removes the skill folder and reports success", () => {
      harness.store.save({
        name: "deletable",
        description: "will be removed",
        body: "x",
      });
      expect(harness.store.delete("deletable")).toBe(true);
      expect(fs.existsSync(path.join(harness.base, "deletable"))).toBe(false);
      expect(harness.store.get("deletable")).toBeNull();
    });

    it("reports false when the skill does not exist", () => {
      expect(harness.store.delete("never-existed")).toBe(false);
    });

    it("does not delete paths that escape the store root", () => {
      expect(harness.store.delete("..")).toBe(false);
      expect(fs.existsSync(harness.base)).toBe(true);
    });
  });
});
