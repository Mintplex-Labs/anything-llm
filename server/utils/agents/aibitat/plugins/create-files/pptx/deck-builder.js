const pluralize = require("pluralize");
const AIbitat = require("../../../index.js");
const { webBrowsing } = require("../../web-browsing.js");
const { safeJsonParse } = require("../../../../../http");
const {
  SLIDE_SCHEMA,
  normalizeSlides,
  assignLayouts,
  sectionSlide,
  fitsImage,
  pictureSlide,
} = require("./slides.js");

/**
 * Turns a presentation outline into slides. Research is done by this module
 * (one web search per deck, plus one per section that has its own
 * instructions) and each section is then written by a sub-agent whose only
 * job is to fill in SLIDE_SCHEMA through the add-slides tool. Most sections
 * take one call; a section that needs more can keep adding slides, and can
 * look up the conversation for details the outline left out. Code still
 * makes every decision that keeps the deck sound (dividers, fit, variety,
 * sourcing), so small local models never have to plan the deck.
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
// Tool calls one section may make: lookups and several add-slides calls.
const SECTION_TOOL_CALLS = 8;
// Content slides kept per section, whatever the model sends.
const MAX_SECTION_SLIDES = 6;

const SYSTEM_PROMPT = `You write the content for ONE section of a slide deck by calling the add-slides tool. Never reply with plain text.

Most sections need 2-3 slides: send them in one add-slides call with "last": true. A section that truly needs more can call add-slides again with the next slides, up to ${MAX_SECTION_SLIDES} in all, and sets "last": true on its final call.

Each slide has a title under 7 words and ONE kind of content:
- points: 3-5 statements, each under 12 words
- items: 2-6 ideas, each a title of 1-4 words and one sentence of text. Set "ordered": true when they are steps or a timeline
- figures: 2-6 numbers, each a value like "42%" or "$1.2M" and a short label. Only numbers written in the key points, instructions, research or conversation
- chart: categories and numeric values in one unit, only real data with 3 or more values
- table: headers and up to 6 rows of short cells
- quote: text and who said it, only a real quote from the research or conversation

Optionally set "layout": bullets, split (title on a panel beside a short list), cards, steps (ordered items), comparison (exactly 2 items), stats (figures), chart, table or quote. It is used when the content fits it; otherwise a fitting layout is chosen.

Never invent statistics, quotes or names. Never write placeholders like "TBD". If a number is unknown, describe the idea in words instead.
On your first call also write "intro": one short line that introduces the section.`;

const ADD_SLIDES_TOOL = {
  name: "add-slides",
  description:
    'Add slides to this section. Set "last" to true on the call that completes the section.',
  parameters: {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    properties: {
      intro: { type: "string" },
      slides: { type: "array", items: SLIDE_SCHEMA },
      last: { type: "boolean" },
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
 * @returns {Promise<{notes: string, citations: object[], links: string[]}>}
 *   links are the result pages, best first
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
    const links = results
      .map((r) => r.link || r.url)
      .filter((link) => typeof link === "string" && /^https?:\/\//.test(link));
    return { notes, citations: host._pendingCitations, links };
  } catch (error) {
    parent.handlerProps.log(
      `[DeckBuilder] Search failed for "${query}": ${error.message}`
    );
    return { notes: "", citations: [], links: [] };
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
      "Look up details from the user's conversation (figures, names, pasted data) that the key points refer to but do not include. Only call it when you need such a detail, then call add-slides.",
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
  parts.push("Call add-slides now.");
  return parts.join("\n\n");
}

/**
 * The sub-agent that writes one section. Every add-slides call is
 * normalized, checked against the sources, given layouts and handed to
 * `onSlides` right away (the first batch behind the section's divider), so
 * progress can be shown while the section is still being written. Falls
 * back to the outline's key points when the model adds nothing usable.
 *
 * A section's picture goes beside the first slide whose content leaves room
 * for one, or on a slide of its own at the end of the section when none
 * does. A generated divider picture goes on the divider.
 * @param {AIbitat} parent
 * @param {Object} options
 * @param {{used: Object<string, number>, previous: string|null}} options.layouts - The deck's layout history, updated in place
 * @param {(slides: import("./slides.js").Slide[]) => void} options.onSlides
 * @param {import("./images.js").SectionImages|null} [options.images]
 * @returns {Promise<number>} Content slides added
 */
async function buildSection(
  parent,
  { section, title, notes, history, label, layouts, onSlides, images }
) {
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
  let intro = "";
  let added = 0;
  let picture = images?.inline ?? null;
  const titles = new Set();
  const place = (slide) => {
    Object.assign(slide, {
      image: picture.image,
      fit: picture.fit,
      credit: picture.credit ?? "",
    });
    if (picture.url)
      slide.notes = [slide.notes, `Image source: ${picture.url}`]
        .filter(Boolean)
        .join("\n");
    picture = null;
  };
  const add = (raw, { checked = true } = {}) => {
    const fresh = normalizeSlides(raw, {
      fallbackTitle: section.title,
      sources: checked ? sources.join("\n") : undefined,
    })
      // Small models often resend slides they already added.
      .filter((slide) => !titles.has(slide.title.toLowerCase()))
      .slice(0, MAX_SECTION_SLIDES - added);
    if (!fresh.length) return 0;
    fresh.forEach((slide) => titles.add(slide.title.toLowerCase()));
    const host = picture && fresh.find(fitsImage);
    if (host) place(host);
    const placed = assignLayouts(fresh, layouts);
    const divider = () => {
      const slide = sectionSlide(section.title, intro);
      if (images?.hero) slide.image = images.hero;
      return slide;
    };
    onSlides(added ? placed : [divider(), ...placed]);
    added += placed.length;
    return placed.length;
  };

  child.function({
    ...ADD_SLIDES_TOOL,
    handler: ({ intro: line, slides, last } = {}) => {
      if (!intro && typeof line === "string") intro = line;
      const count = add(slides);
      if (last === true || last === "true" || added >= MAX_SECTION_SLIDES) {
        child.skipHandleExecution = true;
        return "Section complete.";
      }
      return count
        ? `Added ${pluralize("slide", count, true)}, ${added} in this section. Call add-slides with "last": true when the section is complete.`
        : 'No slides were added: each slide needs a title and content, and numbers must come from the sources. Call add-slides again, or with "last": true if the section is complete.';
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

  // A model that wrote its slides as text instead of a tool call.
  if (!added && !parent._aborted) {
    const output = jsonFromText(text);
    if (typeof output?.intro === "string") intro = output.intro;
    add(output);
  }
  // The outline's own key points, which need no sourcing.
  if (!added && !parent._aborted)
    add(
      { title: section.title, points: section.keyPoints },
      { checked: false }
    );

  // No slide had room for the section's picture, so it gets its own.
  if (picture && added && !parent._aborted) {
    const [slide] = assignLayouts(
      [pictureSlide(picture.caption || section.title, picture)],
      layouts
    );
    if (picture.url) slide.notes = `Image source: ${picture.url}`;
    onSlides([slide]);
    added++;
  }

  const usage = child.providerInstance.getCumulativeUsage();
  log(
    `[DeckBuilder] "${section.title}" produced ${added} slides, ${usage.prompt_tokens + usage.completion_tokens} tokens`
  );
  return added;
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
 * @param {(slides: import("./slides.js").Slide[]) => void} [deck.onSlides] - Called with each batch of finished slides, in deck order
 * @param {(found: {links: string[]}) => Promise<{sections: import("./images.js").SectionImages[]}>} [deck.planImages]
 *   Called once after the deck-level search, with the pages it found,
 *   to choose each section's pictures
 * @returns {Promise<{slides: import("./slides.js").Slide[], citations: object[], built: string[]}>}
 *   built holds the titles of the sections that produced at least one slide.
 */
async function buildDeck(
  parent,
  {
    say,
    title,
    subtitle,
    sections,
    research,
    history = [],
    onSlides,
    planImages,
  }
) {
  const citations = [];

  const search = async (query) => {
    const found = await searchWeb(parent, query.slice(0, QUERY_CHAR_LIMIT));
    citations.push(...found.citations);
    return found;
  };

  const deckSearch = research
    ? await search(`${title} ${subtitle}`.trim())
    : null;
  const deckNotes = deckSearch?.notes ?? "";
  const links = deckSearch?.links ?? [];
  const pictures = (await planImages?.({ links }))?.sections ?? [];
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
        ? (await search(`${section.title} ${title}`)).notes
        : deckNotes;
    const count = await buildSection(parent, {
      section,
      title,
      notes,
      history,
      label,
      layouts,
      images: pictures[i] ?? null,
      onSlides: (batch) => {
        slides.push(...batch);
        onSlides?.(batch);
      },
    });
    if (count) built.push(section.title);
    say(
      `[${label}] Section "${section.title}" complete — ${pluralize("slide", count, true)}`
    );
  }
  return { slides, citations, built };
}

module.exports = { buildDeck, decodeHtmlEntities, readConversation };
