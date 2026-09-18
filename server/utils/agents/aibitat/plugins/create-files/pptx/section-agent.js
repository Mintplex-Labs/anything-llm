const AIbitat = require("../../../index.js");
const { safeJsonParse } = require("../../../../../http");
const { LAYOUTS, CHART_TYPES, normalizeSlides } = require("./normalize.js");

// Search results are injected into a single model call, so they are capped to
// leave room for the prompt, the tool schema and the answer on small local
// models with 4k context windows.
const RESEARCH_CHAR_LIMIT = 2500;
const RESEARCH_RESULT_LIMIT = 6;

const SECTION_BUILDER_PROMPT = `You write the slides for ONE section of a PowerPoint presentation. You must call the submit-section-slides tool exactly once with all slides for this section. Never reply with plain text or raw JSON.

RULES:
- First slide is a "section" divider with the section title, then 2 content slides (3 only if the section truly needs it)
- Vary the layouts. Never use "bullets" for every slide; pick the layout that fits the content
- Keep text short: bullets under 12 words, card/step text one sentence
- Be specific. Use numbers from the research notes when they exist; never invent statistics
- Never write placeholders like "(insert %)" or "TBD"; if a figure is unknown, describe it in words instead
- Tables: at most 6 rows and 4 columns, short cell text
- Charts only for real numeric data with at least 3 differing values; never chart concepts or placeholder values

Layouts and the fields each one uses:
- "section": divider. title + subtitle
- "bullets": title + bullets (3-6 short strings)
- "two-column": compare or contrast. title + items (exactly 2, each with title + bullets)
- "stats": real measured figures only (money, percentages, counts with a source), e.g. "42%" or "$1.2B". title + items (2-4, each title is the number, text is the label). Never use it for wordplay like "0", "1 app" or "∞"
- "cards": parallel ideas. title + items (2-6, each with title + one-sentence text)
- "steps": process or timeline. title + items (3-5, each with title + short text)
- "chart": title + chart { type: bar|line|pie|doughnut|area, categories, values } + optional bullets
- "table": title + table { headers, rows }
- "quote": title is the quote text, subtitle is who said it`;

// Field meanings live in SECTION_BUILDER_PROMPT; the schema stays bare so it
// costs as few tokens as possible on every section call.
const SUBMIT_TOOL = {
  name: "submit-section-slides",
  description:
    "Submit the finished slides for this section. Call this exactly once.",
  parameters: {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    properties: {
      slides: {
        type: "array",
        items: {
          type: "object",
          properties: {
            layout: { type: "string", enum: LAYOUTS },
            title: { type: "string" },
            subtitle: { type: "string" },
            bullets: { type: "array", items: { type: "string" } },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  text: { type: "string" },
                  bullets: { type: "array", items: { type: "string" } },
                },
              },
            },
            chart: {
              type: "object",
              properties: {
                type: { type: "string", enum: CHART_TYPES },
                categories: { type: "array", items: { type: "string" } },
                values: { type: "array", items: { type: "number" } },
              },
            },
            table: {
              type: "object",
              properties: {
                headers: { type: "array", items: { type: "string" } },
                rows: {
                  type: "array",
                  items: { type: "array", items: { type: "string" } },
                },
              },
            },
            notes: { type: "string" },
          },
          required: ["layout", "title"],
        },
      },
    },
    required: ["slides"],
  },
};

/**
 * Creates a child AIbitat that shares the parent's provider, log and
 * introspection stream but never echoes model text to the chat UI.
 */
function childOf(parentAibitat) {
  const child = new AIbitat({
    provider: parentAibitat.defaultProvider.provider,
    model: parentAibitat.defaultProvider.model,
    chats: [],
    handlerProps: parentAibitat.handlerProps,
    maxToolCalls: 1,
  });
  child.introspect = parentAibitat.introspect;
  child.socket = {
    send: (type, content) => {
      if (type === "reportStreamEvent") return;
      parentAibitat.socket?.send(type, content);
    },
  };
  return child;
}

/**
 * Runs one web search through the web-browsing skill without any model call
 * and returns compacted notes plus the citations the search produced.
 * @param {AIbitat} parentAibitat
 * @param {string} query
 * @returns {Promise<{notes: string, citations: object[]}>}
 */
async function searchWeb(parentAibitat, query) {
  const host = childOf(parentAibitat);
  const { webBrowsing } = require("../../web-browsing.js");
  host.use(webBrowsing.plugin());
  const search = host.functions.get("web-browsing");
  search.caller = "@section-builder";
  try {
    const result = await search.handler({ query });
    return {
      notes: compactResults(result),
      citations: host._pendingCitations || [],
    };
  } catch (error) {
    parentAibitat.handlerProps?.log?.(
      `[SectionBuilder] Search failed for "${query}": ${error.message}`
    );
    return { notes: "", citations: [] };
  }
}

const HTML_ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
// Search snippets arrive HTML-escaped; every `&#x27;` costs several tokens.
const decodeEntities = (text) =>
  String(text).replace(/&(#x([0-9a-f]+)|#(\d+)|[a-z]+);/gi, (m, _, hex, dec) =>
    hex
      ? String.fromCodePoint(parseInt(hex, 16))
      : dec
        ? String.fromCodePoint(+dec)
        : HTML_ENTITIES[m.slice(1, -1).toLowerCase()] ?? m
  );

/**
 * Reduces the search skill's JSON result to one snippet line per result.
 * Links and titles are dropped: links already reach the user as citations and
 * titles mostly repeat the snippet, so both are tokens the model never needs.
 */
function compactResults(result) {
  const parsed = safeJsonParse(String(result || ""), null);
  const lines = Array.isArray(parsed)
    ? parsed
        .slice(0, RESEARCH_RESULT_LIMIT)
        .map((r) => `- ${decodeEntities(r.snippet || r.description || "")}`)
    : [String(result || "")];
  return lines.join("\n").replace(/\s+/g, " ").slice(0, RESEARCH_CHAR_LIMIT);
}

/**
 * Builds the slides for one presentation section with at most one web search
 * and exactly one model call, so cost is fixed and small local models only
 * ever have to fill in the slide schema.
 *
 * @param {Object} options
 * @param {AIbitat} options.parentAibitat - Parent agent (provides provider, socket, introspect)
 * @param {{title: string, keyPoints?: string[], instructions?: string}} options.section
 * @param {string} options.presentationTitle
 * @param {boolean} [options.research] - Run one web search for the section first
 * @param {string} [options.notes] - Research notes already gathered for the whole deck; used instead of searching
 * @param {Object<string, number>} [options.layoutTally] - Layouts used by earlier sections, so this one can vary
 * @param {string} [options.conversationContext] - Recent chat history for context
 * @param {string} [options.sectionPrefix] - Progress label like "1/5" for the UI
 * @returns {Promise<{slides: object[], citations: object[], usage: {prompt_tokens: number, completion_tokens: number}}>}
 */
async function buildSection({
  parentAibitat,
  section,
  presentationTitle,
  research = false,
  notes: deckNotes = "",
  conversationContext = "",
  layoutTally = {},
  sectionPrefix = "",
}) {
  const log = parentAibitat.handlerProps?.log || console.log;
  const agentName = sectionPrefix
    ? `[${sectionPrefix}] @section-builder`
    : "@section-builder";

  let notes = deckNotes;
  let citations = [];
  // A section with its own instructions asks for facts the deck-level search
  // will not have, so it gets one search of its own.
  if (research && (!deckNotes || section.instructions)) {
    const found = await searchWeb(
      parentAibitat,
      `${section.title} ${presentationTitle}`.slice(0, 100)
    );
    notes = found.notes;
    citations = found.citations;
  }

  const child = childOf(parentAibitat);
  child.function({
    ...SUBMIT_TOOL,
    handler: function ({ slides }) {
      child._submittedSlides = slides;
      child.skipHandleExecution = true;
      return "Slides submitted.";
    },
  });
  const functions = Array.from(child.functions.values());
  const messages = [
    { role: "system", content: SECTION_BUILDER_PROMPT },
    {
      role: "user",
      content: buildSectionPrompt({
        section,
        presentationTitle,
        conversationContext,
        notes,
        layoutTally,
      }),
    },
  ];

  const provider = child.getProviderForConfig(child.defaultProvider);
  provider.attachHandlerProps(child.handlerProps);
  child.providerInstance = provider;

  let text = "";
  try {
    text = provider.supportsAgentStreaming
      ? await child.handleAsyncExecution(messages, functions, agentName)
      : await child.handleExecution(messages, functions, agentName);
  } catch (error) {
    log(`[SectionBuilder] "${section.title}" failed: ${error.message}`);
  }

  const usage = provider.getCumulativeUsage();
  const slides = normalizeSlides(
    child._submittedSlides ?? slidesFromText(text),
    section.title
  );
  if (slides.length === 0) {
    log(`[SectionBuilder] No slides for "${section.title}", using fallback`);
    return { ...buildFallbackSlides(section), citations, usage };
  }
  log(
    `[SectionBuilder] "${section.title}" produced ${slides.length} slides, ${citations.length} citations, ${usage.prompt_tokens + usage.completion_tokens} tokens`
  );
  return { slides, citations, usage };
}

function buildSectionPrompt({
  section,
  presentationTitle,
  conversationContext,
  notes,
  layoutTally,
}) {
  const parts = [
    `Presentation: "${presentationTitle}"`,
    `Section: ${section.title}`,
  ];
  if (section.keyPoints?.length > 0)
    parts.push(
      `Key points to cover:\n${section.keyPoints.map((p) => `- ${p}`).join("\n")}`
    );
  if (section.instructions) parts.push(`Instructions: ${section.instructions}`);
  if (notes) parts.push(`Research:\n${notes}`);
  if (conversationContext)
    parts.push(`Conversation context:\n${conversationContext}`);
  const used = Object.entries(layoutTally)
    .sort((a, b) => b[1] - a[1])
    .map(([layout, count]) => `${layout} x${count}`);
  if (used.length)
    parts.push(
      `Layouts already used by earlier sections: ${used.join(", ")}. Prefer layouts not on this list.`
    );
  parts.push("Call submit-section-slides now with the slides.");
  return parts.join("\n\n");
}

/**
 * Small models sometimes answer with the tool arguments as text instead of a
 * tool call. Recover the JSON object from that text when possible.
 */
function slidesFromText(text) {
  if (typeof text !== "string") return null;
  const start = text.indexOf("{");
  if (start === -1) return null;
  return safeJsonParse(text.slice(start, text.lastIndexOf("}") + 1), null);
}

/**
 * Generates basic slides from the section definition when the model fails.
 */
function buildFallbackSlides(section) {
  return {
    slides: normalizeSlides(
      [
        { layout: "section", title: section.title },
        { layout: "bullets", title: section.title, bullets: section.keyPoints },
      ],
      section.title
    ),
  };
}

module.exports = { buildSection, searchWeb };
