/* eslint-env jest, node */
jest.mock("../../../utils/EmbeddingRerankers/native/index.js", () => ({
  NativeEmbeddingReranker: jest.fn(),
}));

const {
  NativeEmbeddingReranker,
} = require("../../../utils/EmbeddingRerankers/native/index.js");
const {
  promptWithSkills,
  selectRelevantSkills,
  formatSkillsSection,
  getSkillDetectionStatus,
  MAX_INJECTED_SKILLS,
} = require("../../../utils/skills");

const skill = (name, description, body = `Body for ${name}`) => ({
  name,
  description,
  body,
});

function makeStore(skills) {
  return { list: jest.fn(() => skills) };
}

/** Reranker mock that scores docs by how often query words appear in them. */
function mockRelevanceReranker() {
  NativeEmbeddingReranker.mockImplementation(() => ({
    rerank: jest.fn(async (query, documents, { topK }) => {
      const scored = documents.map((doc, i) => ({
        rerank_corpus_id: i,
        rerank_score: query.split(/\s+/).filter((w) =>
          doc.text.toLowerCase().includes(w.toLowerCase())
        ).length,
      }));
      return scored
        .sort((a, b) => b.rerank_score - a.rerank_score)
        .slice(0, topK);
    }),
  }));
}

describe("promptWithSkills", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns the prompt unchanged when there are no skills", async () => {
    const out = await promptWithSkills({
      systemPrompt: "BASE",
      skillStore: makeStore([]),
    });
    expect(out).toBe("BASE");
  });

  it("appends a Skills section when skills are present", async () => {
    const out = await promptWithSkills({
      systemPrompt: "BASE",
      prompt: "help me write a commit message",
      skillStore: makeStore([
        skill("git-commits", "Writing commit messages. Use for git commits."),
      ]),
    });
    expect(out.startsWith("BASE")).toBe(true);
    expect(out).toContain("## Skills");
    expect(out).toContain("### Skill: git-commits");
    expect(out).toContain("Body for git-commits");
  });

  it("injects every skill without reranking when at or under the limit", async () => {
    const skills = [skill("a"), skill("b")];
    const out = await promptWithSkills({
      systemPrompt: "BASE",
      prompt: "anything",
      skillStore: makeStore(skills),
    });
    expect(NativeEmbeddingReranker).not.toHaveBeenCalled();
    expect((out.match(/### Skill:/g) || []).length).toBe(2);
  });

  it("reranks and keeps only the top N when over the limit", async () => {
    mockRelevanceReranker();
    const skills = [
      skill("sql-queries", "Writing SQL queries for postgres databases"),
      skill("recipe-box", "Cooking recipes and baking"),
      skill("garden-tips", "Gardening advice for tomatoes"),
      skill("travel-plans", "Travel itinerary planning"),
      skill("code-review", "Reviewing pull requests"),
      skill("poem-writer", "Writing poems"),
    ];
    const out = await promptWithSkills({
      systemPrompt: "BASE",
      prompt: "write a SQL query for my postgres database",
      skillStore: makeStore(skills),
    });

    expect(NativeEmbeddingReranker).toHaveBeenCalledTimes(1);
    const injected = (out.match(/### Skill: ([\w-]+)/g) || []).map((s) =>
      s.replace("### Skill: ", "")
    );
    expect(injected).toHaveLength(MAX_INJECTED_SKILLS);
    expect(injected[0]).toBe("sql-queries");
  });

  it("caps each injected body at the max length", async () => {
    const huge = skill("huge-skill", "big body", "x".repeat(20000));
    const out = await promptWithSkills({
      systemPrompt: "BASE",
      prompt: "test",
      skillStore: makeStore([huge]),
    });
    const bodyMatch = out.match(/### Skill: huge-skill\n+([\s\S]*)$/);
    expect(bodyMatch[1].length).toBeLessThanOrEqual(12000 + 10);
  });

  it("returns the original prompt when the store throws", async () => {
    const out = await promptWithSkills({
      systemPrompt: "BASE",
      skillStore: { list: jest.fn(() => { throw new Error("disk on fire"); }) },
    });
    expect(out).toBe("BASE");
  });

  it("ignores broken entries ({ dir, error }) coming from store.list()", async () => {
    const out = await promptWithSkills({
      systemPrompt: "BASE",
      prompt: "anything",
      skillStore: {
        list: jest.fn(() => [
          skill("good-skill", "a description"),
          { dir: "broken-skill", error: "Missing SKILL.md file." },
        ]),
      },
    });
    expect(out).toContain("### Skill: good-skill");
    expect(out).not.toContain("broken-skill");
  });

  it("exercises the boundary: exactly MAX skills skip the reranker", async () => {
    const skills = Array.from(
      { length: MAX_INJECTED_SKILLS },
      (_, i) => skill(`s-${i}`, `desc ${i}`)
    );
    const out = await promptWithSkills({
      systemPrompt: "BASE",
      prompt: "anything",
      skillStore: makeStore(skills),
    });
    expect(NativeEmbeddingReranker).not.toHaveBeenCalled();
    expect((out.match(/### Skill:/g) || []).length).toBe(MAX_INJECTED_SKILLS);
    expect(getSkillDetectionStatus().mode).toBe("all");
  });

  it("uses the reranker with MAX+1 skills", async () => {
    mockRelevanceReranker();
    const skills = Array.from(
      { length: MAX_INJECTED_SKILLS + 1 },
      (_, i) => skill(`s-${i}`, `desc ${i}`)
    );
    await promptWithSkills({
      systemPrompt: "BASE",
      prompt: "anything",
      skillStore: makeStore(skills),
    });
    expect(NativeEmbeddingReranker).toHaveBeenCalledTimes(1);
    expect(getSkillDetectionStatus().mode).toBe("reranked");
  });

  it("records a fallback status when the reranker is unavailable", async () => {
    NativeEmbeddingReranker.mockImplementation(
      () => ({ rerank: jest.fn(async () => { throw new Error("no model"); }) })
    );
    const skills = Array.from(
      { length: MAX_INJECTED_SKILLS + 1 },
      (_, i) => skill(`s-${i}`, `desc ${i}`)
    );
    await promptWithSkills({
      systemPrompt: "BASE",
      prompt: "anything",
      skillStore: makeStore(skills),
    });
    const status = getSkillDetectionStatus();
    expect(status.mode).toBe("fallback");
    expect(status.reason).toBe("no model");
    expect(status.count).toBe(MAX_INJECTED_SKILLS);
  });
});

describe("selectRelevantSkills", () => {
  beforeEach(() => jest.clearAllMocks());

  it("passes recent history into the rerank query", async () => {
    let rerankSpy;
    NativeEmbeddingReranker.mockImplementation(() => ({
      rerank: (rerankSpy = jest.fn(async (q, docs, { topK }) =>
        docs.slice(0, topK).map((_, i) => ({ rerank_corpus_id: i, rerank_score: 1 }))
      )),
    }));
    const skills = Array.from({ length: 7 }, (_, i) => skill(`s-${i}`, `desc ${i}`));
    await selectRelevantSkills(skills, "current message", [
      { prompt: "earlier context about sql" },
    ]);
    expect(rerankSpy).toHaveBeenCalledTimes(1);
    const [query] = rerankSpy.mock.calls[0];
    expect(query).toContain("current message");
    expect(query).toContain("earlier context about sql");
  });

  it("falls back to the first N skills when the reranker fails", async () => {
    NativeEmbeddingReranker.mockImplementation(
      () => ({ rerank: jest.fn(async () => { throw new Error("no model"); }) })
    );
    const skills = Array.from({ length: 8 }, (_, i) => skill(`s-${i}`, `desc ${i}`));
    const selected = await selectRelevantSkills(skills, "anything", []);
    expect(selected.map((s) => s.name)).toEqual(
      skills.slice(0, MAX_INJECTED_SKILLS).map((s) => s.name)
    );
  });

  it("returns all skills unchanged when under the limit", async () => {
    const skills = [skill("a"), skill("b"), skill("c")];
    expect(await selectRelevantSkills(skills, "q", [])).toBe(skills);
    expect(NativeEmbeddingReranker).not.toHaveBeenCalled();
  });
});

describe("formatSkillsSection", () => {
  it("returns an empty string for no skills", () => {
    expect(formatSkillsSection([])).toBe("");
  });

  it("labels each skill with its name and body", () => {
    const section = formatSkillsSection([skill("one", "d", "B1"), skill("two", "d", "B2")]);
    expect(section).toContain("## Skills");
    expect(section).toContain("### Skill: one");
    expect(section).toContain("B1");
    expect(section).toContain("### Skill: two");
    expect(section).toContain("B2");
  });
});
