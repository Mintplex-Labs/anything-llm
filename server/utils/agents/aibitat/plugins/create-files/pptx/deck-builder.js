const pluralize = require("pluralize");
const AIbitat = require("../../../index.js");
const { webBrowsing } = require("../../web-browsing.js");
const { safeJsonParse } = require("../../../../../http");
const {
  LAYOUTS,
  SLIDE_SCHEMA,
  normalizeSlides,
  pruneDividers,
} = require("./slides.js");

/**
 * Turns a presentation outline into slides. Research is done by this module
 * (one web search per deck, plus one per section that has its own
 * instructions) and each section is then exactly one model call whose only
 * job is to fill in SLIDE_SCHEMA, so cost is fixed and small local models
 * never have to plan or call tools themselves.
 */

// Search results are injected into a single model call, so they are capped to
// leave room for the prompt, the tool schema and the answer on small local
// models with 4k context windows.
const RESEARCH_CHAR_LIMIT = 2500;
const RESEARCH_RESULT_LIMIT = 6;
// Search engines truncate or reject long queries.
const QUERY_CHAR_LIMIT = 100;

const SYSTEM_PROMPT = `You write the slides for ONE section of a PowerPoint presentation. You must call the submit-section-slides tool exactly once with all slides for this section. Never reply with plain text or raw JSON.

RULES:
- First slide is a "section" divider with the section title, then 2 content slides (3 only if the section truly needs it)
- Vary the layouts. Never use "bullets" for every slide; pick the layout that fits the content
- Keep text short: bullets under 12 words, card/step text one sentence
- Be specific. Use numbers from the research notes when they exist; never invent statistics
- Never write placeholders like "(insert %)" or "TBD"; if a figure is unknown, describe it in words instead
- Tables: at most 6 rows and 4 columns, short cell text
- Charts only for real numeric data with at least 3 differing values; never chart concepts or placeholder values

Layouts and the fields each one uses:
${Object.entries(LAYOUTS)
  .map(([name, { hint }]) => `- "${name}": ${hint}`)
  .join("\n")}`;

const SUBMIT_TOOL = {
  name: "submit-section-slides",
  description:
    "Submit the finished slides for this section. Call this exactly once.",
  parameters: {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    properties: { slides: { type: "array", items: SLIDE_SCHEMA } },
    required: ["slides"],
  },
};

/**
 * A child AIbitat on the parent's provider that shares its log and
 * introspection stream but never echoes model text to the chat UI.
 */
function childOf(parent) {
  const child = new AIbitat({
    provider: parent.defaultProvider.provider,
    model: parent.defaultProvider.model,
    chats: [],
    handlerProps: parent.handlerProps,
    maxToolCalls: 1,
  });
  child.introspect = parent.introspect;
  child.socket = {
    send: (type, content) => {
      if (type !== "reportStreamEvent") parent.socket?.send(type, content);
    },
  };
  const provider = child.getProviderForConfig(child.defaultProvider);
  provider.attachHandlerProps(child.handlerProps);
  child.providerInstance = provider;
  return child;
}

const NAMED_ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };

/**
 * Decodes named, decimal and hex HTML entities, leaving anything unrecognized
 * as written. Search snippets arrive HTML-escaped and go straight into a
 * prompt, where a literal "&#39;" is noise the model copies into slides.
 * @param {string} str
 * @returns {string}
 */
function decodeHtmlEntities(str) {
  return String(str).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code) => {
    if (code[0] !== "#") return NAMED_ENTITIES[code.toLowerCase()] ?? match;
    const point =
      code[1].toLowerCase() === "x"
        ? parseInt(code.slice(2), 16)
        : Number(code.slice(1));
    return point <= 0x10ffff ? String.fromCodePoint(point) : match;
  });
}

/**
 * Runs one web search through the web-browsing skill without any model call.
 * Only snippets are kept: links reach the user as citations and titles mostly
 * repeat the snippet, so both are tokens the model never needs.
 * @returns {Promise<{notes: string, citations: object[]}>}
 */
async function searchWeb(parent, query) {
  const host = childOf(parent);
  host.use(webBrowsing.plugin());
  const search = host.functions.get("web-browsing");
  search.caller = "@section-builder";
  try {
    const results = safeJsonParse(String(await search.handler({ query })), []);
    const notes = results
      .slice(0, RESEARCH_RESULT_LIMIT)
      .map((r) => `- ${decodeHtmlEntities(r.snippet || r.description || "")}`)
      .join("\n")
      .replace(/\s+/g, " ")
      .slice(0, RESEARCH_CHAR_LIMIT);
    return { notes, citations: host._pendingCitations };
  } catch (error) {
    parent.handlerProps.log(
      `[DeckBuilder] Search failed for "${query}": ${error.message}`
    );
    return { notes: "", citations: [] };
  }
}

/**
 * Small models sometimes answer with the tool arguments as text instead of a
 * tool call. Recover the JSON object from that text when possible.
 */
function jsonFromText(text) {
  const start = String(text).indexOf("{");
  if (start === -1) return null;
  return safeJsonParse(text.slice(start, text.lastIndexOf("}") + 1), null);
}

function sectionPrompt({ section, title, notes, context, used }) {
  const parts = [`Presentation: "${title}"`, `Section: ${section.title}`];
  const keyPoints = [].concat(section.keyPoints ?? []);
  if (keyPoints.length)
    parts.push(
      `Key points to cover:\n${keyPoints.map((p) => `- ${p}`).join("\n")}`
    );
  if (section.instructions) parts.push(`Instructions: ${section.instructions}`);
  if (notes) parts.push(`Research:\n${notes}`);
  if (context) parts.push(`Conversation context:\n${context}`);
  const tally = Object.entries(used)
    .sort((a, b) => b[1] - a[1])
    .map(([layout, count]) => `${layout} x${count}`);
  if (tally.length)
    parts.push(
      `Layouts already used by earlier sections: ${tally.join(", ")}. Prefer layouts not on this list.`
    );
  parts.push("Call submit-section-slides now with the slides.");
  return parts.join("\n\n");
}

/**
 * One model call that writes the slides for one section. Falls back to a
 * divider plus the outline's key points when the model produces nothing.
 * @returns {Promise<import("./slides.js").Slide[]>}
 */
async function buildSection(
  parent,
  { section, title, notes, context, used, label }
) {
  const child = childOf(parent);
  let submitted = null;
  child.function({
    ...SUBMIT_TOOL,
    handler: ({ slides }) => {
      submitted = slides;
      child.skipHandleExecution = true;
      return "Slides submitted.";
    },
  });
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: sectionPrompt({ section, title, notes, context, used }),
    },
  ];
  const functions = [...child.functions.values()];
  const agent = `[${label}] @section-builder`;
  const { log } = parent.handlerProps;

  let text = "";
  try {
    text = child.providerInstance.supportsAgentStreaming
      ? await child.handleAsyncExecution(messages, functions, agent)
      : await child.handleExecution(messages, functions, agent);
  } catch (error) {
    log(`[DeckBuilder] "${section.title}" failed: ${error.message}`);
  }

  const usage = child.providerInstance.getCumulativeUsage();
  const slides = normalizeSlides(
    submitted ?? jsonFromText(text),
    section.title
  );
  log(
    `[DeckBuilder] "${section.title}" produced ${slides.length} slides, ${usage.prompt_tokens + usage.completion_tokens} tokens`
  );
  if (slides.length) return slides;
  return normalizeSlides(
    [
      { layout: "section", title: section.title },
      { layout: "bullets", title: section.title, bullets: section.keyPoints },
    ],
    section.title
  );
}

/**
 * Builds every slide of a deck, section by section. Sections run sequentially
 * on purpose: local models serve one request at a time and it keeps the
 * introspection stream in order.
 * @param {AIbitat} parent - The agent that owns the tool call
 * @param {Object} deck
 * @param {(msg: string) => void} deck.say - Progress reporter for the chat UI
 * @param {string} deck.title
 * @param {string} deck.subtitle
 * @param {{title: string, keyPoints?: string[], instructions?: string}[]} deck.sections
 * @param {boolean} deck.research - Search the web before writing
 * @param {string} deck.context - Recent conversation, for facts the outline left out
 * @returns {Promise<{slides: import("./slides.js").Slide[], citations: object[]}>}
 */
async function buildDeck(
  parent,
  { say, title, subtitle, sections, research, context }
) {
  const citations = [];
  const search = async (query) => {
    const found = await searchWeb(parent, query.slice(0, QUERY_CHAR_LIMIT));
    citations.push(...found.citations);
    return found.notes;
  };

  const deckNotes = research ? await search(`${title} ${subtitle}`.trim()) : "";
  const slides = [];
  const used = {};
  for (const [i, section] of sections.entries()) {
    const label = `${i + 1}/${sections.length}`;
    say(`[${label}] Building section "${section.title}"…`);
    // A section with its own instructions asks for facts the deck-level
    // search will not have, so it gets one search of its own.
    const notes =
      research && (section.instructions || !deckNotes)
        ? await search(`${section.title} ${title}`)
        : deckNotes;
    const sectionSlides = await buildSection(parent, {
      section,
      title,
      notes,
      context,
      used,
      label,
    });
    for (const slide of sectionSlides)
      if (slide.layout !== "section")
        used[slide.layout] = (used[slide.layout] || 0) + 1;
    slides.push(...sectionSlides);
    say(
      `[${label}] Section "${section.title}" complete — ${pluralize("slide", sectionSlides.length, true)}`
    );
  }
  return { slides: pruneDividers(slides), citations };
}

module.exports = { buildDeck, decodeHtmlEntities };
