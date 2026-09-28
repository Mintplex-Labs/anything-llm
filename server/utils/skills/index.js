/**
 * Markdown Skill Detection & Injection
 *
 * Detects which markdown skills are relevant to the current prompt and appends
 * their instructions to the system prompt. This mirrors how Cursor / Claude
 * surface skills: each skill's `name` + `description` is the cheap "index", and
 * the full body is injected only when the skill is judged relevant.
 *
 * Detection is two-stage:
 *   1. Relevance ranking. When there are more skills than we want to inject,
 *      the native embedding reranker scores each skill's metadata (name +
 *      description) against the current prompt and recent history, and the top
 *      N are kept. This is the "automatic detection".
 *   2. Thresholding. When the reranker is unavailable or there are few skills,
 *      all skills are injected (they are cheap metadata + a bounded body).
 *
 * The result is appended to the system prompt via `promptWithSkills`, which is
 * called from the shared `promptWithMemories` path so every chat (agent or not)
 * sees the same behavior.
 */
const { store, isValidName } = require("./store");

/** Max skill bodies injected per prompt. Keeps context cost bounded. */
const MAX_INJECTED_SKILLS = 5;
/** Hard cap on a single skill's body so a runaway file cannot blow the context. */
const MAX_SKILL_BODY_CHARS = 12000;

/**
 * Status of the most recent skill detection, for surfacing in the admin UI.
 * `mode` is one of:
 *  - "all"      - every skill was injected (at or under the limit)
 *  - "reranked" - the reranker picked the top N
 *  - "fallback" - reranker unavailable; first N skills were used instead
 * `reason` explains a fallback when present.
 */
let lastDetection = null;

function getSkillDetectionStatus() {
  return lastDetection;
}

/**
 * Rank skills by relevance to the prompt and return the top N.
 * Falls back to alphabetical order when the reranker is unavailable.
 * @param {object[]} skills
 * @param {string} prompt
 * @param {object[]} rawHistory
 * @returns {Promise<object[]>}
 */
async function selectRelevantSkills(skills, prompt, rawHistory) {
  if (skills.length <= MAX_INJECTED_SKILLS) {
    lastDetection = { mode: "all", count: skills.length };
    return skills;
  }

  const recent = (rawHistory || [])
    .slice(-3)
    .map((m) => m.prompt)
    .filter(Boolean)
    .join(" ");
  const query = `${prompt} ${recent}`.trim();

  try {
    const {
      NativeEmbeddingReranker,
    } = require("../EmbeddingRerankers/native/index.js");
    const reranker = new NativeEmbeddingReranker();
    const documents = skills.map((s) => ({
      text: `${s.name}\n${s.description}`,
    }));
    const reranked = await reranker.rerank(query, documents, {
      topK: MAX_INJECTED_SKILLS,
    });
    lastDetection = { mode: "reranked", count: reranked.length };
    return reranked.map((r) => skills[r.rerank_corpus_id]);
  } catch (error) {
    console.error(
      "[Skill Detection] Reranker failed, using first N skills:",
      error.message
    );
    lastDetection = {
      mode: "fallback",
      count: MAX_INJECTED_SKILLS,
      reason: error.message,
    };
    return skills.slice(0, MAX_INJECTED_SKILLS);
  }
}

/**
 * Build the markdown section injected into the system prompt.
 * @param {object[]} skills
 * @returns {string}
 */
function formatSkillsSection(skills) {
  if (!skills.length) return "";
  const blocks = skills.map((s) => {
    const body = String(s.body || "")
      .slice(0, MAX_SKILL_BODY_CHARS)
      .trim();
    return `### Skill: ${s.name}\n\n${body}`;
  });
  const header =
    "## Skills\n\n" +
    "The following skills are relevant to the user's request. Follow their " +
    "instructions when applicable. They are guidance, not tools - do not " +
    "invent tool calls that are not available.";
  return `${header}\n\n${blocks.join("\n\n")}`;
}

/**
 * Detect relevant markdown skills and append them to a system prompt.
 * Returns the original prompt unchanged when there are no skills.
 * @param {Object} opts
 * @param {string} opts.systemPrompt
 * @param {string} [opts.prompt] - Current user message, used for detection.
 * @param {object[]} [opts.rawHistory] - Recent chat history objects with .prompt.
 * @param {object} [opts.skillStore] - Skill store to read from (defaults to the app store).
 * @returns {Promise<string>}
 */
async function promptWithSkills({
  systemPrompt,
  prompt = "",
  rawHistory = [],
  skillStore = store,
}) {
  try {
    // list() also returns broken entries ({ dir, error }) for admin display;
    // only inject records with a usable name and body.
    const all = skillStore
      .list()
      .filter((s) => s && typeof s.name === "string" && s.body);
    if (all.length === 0) {
      lastDetection = { mode: "all", count: 0 };
      return systemPrompt;
    }

    const relevant = await selectRelevantSkills(all, prompt, rawHistory);
    const section = formatSkillsSection(relevant);
    return section ? `${systemPrompt}\n\n${section}` : systemPrompt;
  } catch (error) {
    console.error("[Skill Injection] Error:", error.message);
    return systemPrompt;
  }
}

module.exports = {
  getSkillDetectionStatus,
  promptWithSkills,
  selectRelevantSkills,
  formatSkillsSection,
  store,
  isValidName,
  MAX_INJECTED_SKILLS,
};
