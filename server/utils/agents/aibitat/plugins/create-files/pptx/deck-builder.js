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
 * instructions) and each section is then one model call whose job is to
 * fill in SLIDE_SCHEMA, so cost stays small and fixed and small local models
 * never have to plan. The only other tool a section call gets is an optional
 * conversation lookup, so the chat history costs tokens only in the sections
 * that ask for it.
 */

// Search results are injected into a single model call, so they are capped to
// leave room for the prompt, the tool schema and the answer on small local
// models with 4k context windows.
const RESEARCH_CHAR_LIMIT = 2500;
const RESEARCH_RESULT_LIMIT = 6;
// Search engines truncate or reject long queries.
const QUERY_CHAR_LIMIT = 100;
// Most conversation text one lookup returns, for the same reason as above.
const CONVERSATION_CHAR_LIMIT = 3000;
// Room for a conversation lookup, and one refined lookup, before the submit
// call. AIbitat counts calls from zero, so 2 allows three.
const SECTION_TOOL_CALLS = 2;

const SYSTEM_PROMPT = `You write the slides for ONE section of a PowerPoint presentation. You must call the submit-section-slides tool exactly once with all slides for this section. Never reply with plain text or raw JSON.

RULES:
- First slide is a "section" divider with the section title, then 2 content slides (3 only if the section truly needs it)
- Vary the layouts. Never use "bullets" for every slide; pick the layout that fits the content
- Keep text short: slide titles under 7 words, bullets under 12 words, card/step text one sentence
- Be specific. Use numbers from the research notes when they exist; never invent statistics
- Never write placeholders like "(insert %)" or "TBD"; if a figure is unknown, describe it in words instead
- Tables: at most 6 rows and 4 columns, short cell text
- Charts only for real numeric data with at least 3 differing values; never chart concepts or placeholder values
- Every value in one chart must use the same unit; never mix money, counts and percentages in one chart

Layouts and the fields each one uses:
${Object.entries(LAYOUTS)
  .map(([name, { hint }]) => `- "${name}": ${hint}`)
  .join("\n")}`;

// A content layout is closed to the next section once the deck has used it
// this many times, so one favourite layout cannot fill the deck.
const MAX_LAYOUT_USES = 3;
// General-purpose layouts that fit any content. At least one always stays
// open so a section is never forced into a chart, table or quote it has no
// material for.
const TEXT_LAYOUTS = ["bullets", "cards", "steps", "two-column"];
const CONTENT_LAYOUTS = Object.keys(LAYOUTS).filter((l) => l !== "section");

/**
 * The content layouts a section may use: every one except those the previous
 * section used and those already used MAX_LAYOUT_USES times in the deck.
 * @param {Object<string, number>} used - Uses of each layout so far in the deck
 * @param {Set<string>} previous - Layouts the previous section used
 * @returns {string[]}
 */
function openLayouts(used, previous) {
  const open = CONTENT_LAYOUTS.filter(
    (l) => !previous.has(l) && (used[l] || 0) < MAX_LAYOUT_USES
  );
  if (!open.some((l) => TEXT_LAYOUTS.includes(l))) {
    const leastUsed = [...TEXT_LAYOUTS].sort(
      (a, b) => (used[a] || 0) - (used[b] || 0)
    )[0];
    open.push(leastUsed);
  }
  return open;
}

/**
 * The tool a section call submits its slides with. Its layout enum holds
 * only the open layouts, which models follow far more reliably than an
 * instruction in the prompt.
 * @param {string[]} layouts - Open content layouts
 */
function submitTool(layouts) {
  const slide = {
    ...SLIDE_SCHEMA,
    properties: {
      ...SLIDE_SCHEMA.properties,
      layout: { type: "string", enum: ["section", ...layouts] },
    },
  };
  return {
    name: "submit-section-slides",
    description:
      "Submit the finished slides for this section. Call this exactly once.",
    parameters: {
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "object",
      properties: { slides: { type: "array", items: slide } },
      required: ["slides"],
    },
  };
}

/**
 * A child AIbitat on the parent's provider that shares its log and
 * introspection stream but never echoes model text to the chat UI.
 * Call `child.release()` when done with it so the parent session does not
 * keep it alive.
 */
function childOf(parent) {
  const child = new AIbitat({
    ...parent.defaultProvider,
    chats: [],
    handlerProps: parent.handlerProps,
    maxToolCalls: SECTION_TOOL_CALLS,
  });
  // Stopping the parent session also stops this sub-agent.
  const signal = parent.abortController.signal;
  const onAbort = () => child.abort();
  if (parent._aborted) child.abort();
  else signal.addEventListener("abort", onAbort, { once: true });
  child.release = () => signal.removeEventListener("abort", onAbort);
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
  } finally {
    host.release();
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

/**
 * Lines of the conversation that mention any of the query terms, or the
 * latest lines when there is no query. The newest lines are kept when the
 * matches exceed CONVERSATION_CHAR_LIMIT; the result reads oldest first.
 * @param {{from: string, content: string}[]} history - Oldest first
 * @param {string} [query] - Words to look for
 * @returns {string}
 */
function readConversation(history, query) {
  const terms = String(query ?? "")
    .toLowerCase()
    .split(/[\s,.;:!?()"']+/)
    .filter((term) => term.length > 1);
  const lines = history.flatMap(({ from, content }) =>
    String(content)
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `${from}: ${line}`)
  );
  const matches = terms.length
    ? lines.filter((line) =>
        terms.some((term) => line.toLowerCase().includes(term))
      )
    : lines;
  const kept = [];
  let size = 0;
  for (const line of matches.reverse()) {
    if (size + line.length > CONVERSATION_CHAR_LIMIT) break;
    kept.unshift(line);
    size += line.length + 1;
  }
  if (kept.length) return kept.join("\n");
  return terms.length
    ? `Nothing in the conversation mentions "${query}".`
    : "The conversation is empty.";
}

/**
 * The tool a section call can use to pull details from the user's
 * conversation that its key points refer to but leave out. Registered only
 * when there is a conversation, so it costs nothing otherwise.
 * @param {{from: string, content: string}[]} history
 */
function conversationTool(history) {
  return {
    name: "read-conversation",
    description:
      "Look up details from the user's conversation (figures, names, pasted data) that the key points refer to but do not include. Only call it when you need such a detail, then call submit-section-slides.",
    parameters: {
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "Words to look for, e.g. 'revenue Q3 churn'. Leave empty for the latest messages.",
        },
      },
    },
    handler: ({ query } = {}) => readConversation(history, query),
  };
}

function sectionPrompt({ section, title, notes, layouts }) {
  const parts = [`Presentation: "${title}"`, `Section: ${section.title}`];
  const keyPoints = [].concat(section.keyPoints ?? []);
  if (keyPoints.length)
    parts.push(
      `Key points to cover:\n${keyPoints.map((p) => `- ${p}`).join("\n")}`
    );
  if (section.instructions) parts.push(`Instructions: ${section.instructions}`);
  if (notes) parts.push(`Research:\n${notes}`);
  if (layouts.length < CONTENT_LAYOUTS.length)
    parts.push(
      `Content layouts for this section: ${layouts.join(", ")}. Earlier sections used the others.`
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
  { section, title, notes, history, layouts, label }
) {
  const child = childOf(parent);
  let submitted = null;
  child.function({
    ...submitTool(layouts),
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
      content: sectionPrompt({ section, title, notes, layouts }),
    },
  ];
  if (history.length) child.function(conversationTool(history));
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
  } finally {
    child.release();
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
 * @param {{from: string, content: string}[]} [deck.history] - The conversation, oldest first, which section calls can search for facts the outline left out
 * @returns {Promise<{slides: import("./slides.js").Slide[], citations: object[], built: string[]}>}
 *   built holds the titles of the sections that produced at least one content slide.
 */
async function buildDeck(
  parent,
  { say, title, subtitle, sections, research, history = [] }
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
  const built = [];
  let previous = new Set();
  for (const [i, section] of sections.entries()) {
    if (parent._aborted) break;
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
      history,
      layouts: openLayouts(used, previous),
      label,
    });
    const content = sectionSlides
      .map((slide) => slide.layout)
      .filter((layout) => layout !== "section");
    for (const layout of content) used[layout] = (used[layout] || 0) + 1;
    previous = new Set(content);
    if (content.length) built.push(section.title);
    slides.push(...sectionSlides);
    say(
      `[${label}] Section "${section.title}" complete — ${pluralize("slide", sectionSlides.length, true)}`
    );
  }
  return { slides: pruneDividers(slides), citations, built };
}

module.exports = {
  buildDeck,
  decodeHtmlEntities,
  openLayouts,
  readConversation,
};
