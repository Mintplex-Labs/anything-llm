const pluralize = require("pluralize");
const AIbitat = require("../../../index.js");
const { webBrowsing } = require("../../web-browsing.js");
const { safeJsonParse } = require("../../../../../http");
const {
  SLIDE_SCHEMA,
  normalizeSlides,
  assignLayouts,
  sectionSlide,
} = require("./slides.js");

/**
 * Turns a presentation outline into slides. Research is done by this module
 * (one web search per deck, plus one per section that has its own
 * instructions) and each section is then one model call whose only job is
 * to write content into SLIDE_SCHEMA: titles, points, items, figures. Every
 * visual decision (layouts, dividers, sizes) is made in code, so cost stays
 * small and fixed and small local models never have to plan or design. The
 * only other tool a section call gets is an optional conversation lookup,
 * so the chat history costs tokens only in the sections that ask for it.
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
// Content slides kept per section, whatever the model returns.
const MAX_SECTION_SLIDES = 3;

const SYSTEM_PROMPT = `You write the content for ONE section of a slide deck. Call the submit-section-slides tool exactly once with all slides. Never reply with plain text.

Write 2 slides (3 only if the section truly needs it). Each slide has a title under 7 words and ONE kind of content:
- points: 3-5 statements, each under 12 words
- items: 2-6 ideas, each a title of 1-4 words and one sentence of text. Set "ordered": true when they are steps or a timeline
- figures: 2-6 numbers, each a value like "42%" or "$1.2M" and a short label. Only numbers written in the key points, instructions, research or conversation
- chart: categories and numeric values in one unit, only real data with 3 or more values
- table: headers and up to 6 rows of short cells
- quote: text and who said it, only a real quote from the research or conversation

Never invent statistics, quotes or names. Never write placeholders like "TBD". If a number is unknown, describe the idea in words instead.
Also write "intro": one short line that introduces the section.`;

const SUBMIT_TOOL = {
  name: "submit-section-slides",
  description:
    "Submit the finished slides for this section. Call this exactly once.",
  parameters: {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    properties: {
      intro: { type: "string" },
      slides: { type: "array", items: SLIDE_SCHEMA },
    },
    required: ["slides"],
  },
};

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
 * when there is a conversation, so it costs nothing otherwise. Every result
 * is passed to `onRead`, so figures found this way count as sourced.
 * @param {{from: string, content: string}[]} history
 * @param {(text: string) => void} onRead
 */
function conversationTool(history, onRead) {
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
    handler: ({ query } = {}) => {
      const found = readConversation(history, query);
      onRead(found);
      return found;
    },
  };
}

function sectionPrompt({ section, title, notes }) {
  const parts = [`Presentation: "${title}"`, `Section: ${section.title}`];
  const keyPoints = [].concat(section.keyPoints ?? []);
  if (keyPoints.length)
    parts.push(
      `Key points to cover:\n${keyPoints.map((p) => `- ${p}`).join("\n")}`
    );
  if (section.instructions) parts.push(`Instructions: ${section.instructions}`);
  if (notes) parts.push(`Research:\n${notes}`);
  parts.push("Call submit-section-slides now with the slides.");
  return parts.join("\n\n");
}

/**
 * One model call that writes the content for one section. Falls back to the
 * outline's key points when the model produces nothing usable.
 * @returns {Promise<{intro: string, slides: Object[]}>} Content slides without layouts
 */
async function buildSection(parent, { section, title, notes, history, label }) {
  const child = childOf(parent);
  // Everything the model was given; figures, chart values and quotes not
  // found here are dropped as invented.
  const sources = [
    title,
    section.title,
    [].concat(section.keyPoints ?? []).join("\n"),
    section.instructions ?? "",
    notes,
  ];
  let submitted = null;
  child.function({
    ...SUBMIT_TOOL,
    handler: (args) => {
      submitted = args;
      child.skipHandleExecution = true;
      return "Slides submitted.";
    },
  });
  if (history.length)
    child.function(conversationTool(history, (found) => sources.push(found)));
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: sectionPrompt({ section, title, notes }) },
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
  } finally {
    child.release();
  }

  const usage = child.providerInstance.getCumulativeUsage();
  const output = submitted ?? jsonFromText(text);
  const slides = normalizeSlides(output, {
    fallbackTitle: section.title,
    sources: sources.join("\n"),
  }).slice(0, MAX_SECTION_SLIDES);
  log(
    `[DeckBuilder] "${section.title}" produced ${slides.length} slides, ${usage.prompt_tokens + usage.completion_tokens} tokens`
  );
  const intro = typeof output?.intro === "string" ? output.intro : "";
  if (slides.length) return { intro, slides };
  return {
    intro: "",
    slides: normalizeSlides(
      { title: section.title, points: section.keyPoints },
      { fallbackTitle: section.title }
    ),
  };
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
 *   built holds the titles of the sections that produced at least one slide.
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
  const built = [];
  // Layout history across the whole deck, so sections do not repeat each
  // other's layouts.
  const layouts = { used: {}, previous: null };
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
    const content = await buildSection(parent, {
      section,
      title,
      notes,
      history,
      label,
    });
    if (content.slides.length) {
      built.push(section.title);
      slides.push(
        sectionSlide(section.title, content.intro),
        ...assignLayouts(content.slides, layouts)
      );
    }
    say(
      `[${label}] Section "${section.title}" complete — ${pluralize("slide", content.slides.length, true)}`
    );
  }
  return { slides, citations, built };
}

module.exports = { buildDeck, decodeHtmlEntities, readConversation };
