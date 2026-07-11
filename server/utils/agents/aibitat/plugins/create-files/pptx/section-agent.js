const AIbitat = require("../../../index.js");

const SECTION_BUILDER_PROMPT = `You are a focused presentation section builder. Your ONLY task is to create detailed slides for ONE section of a PowerPoint presentation.

You have access to web search and web scraping tools, but only use them when the topic genuinely requires up-to-date information you don't already know (e.g., current statistics, recent events, specific company data). For general knowledge topics, create slides directly from your existing knowledge.

RULES:
- Create EXACTLY the number of slides the user message asks for, counting the
  opening divider. If asked for 8 slides, submit 8 - do not consolidate several
  points onto one slide to end up with fewer. Split the content so each slide
  covers a distinct aspect.
- Be specific and data-driven when possible
- Include speaker notes with key talking points
- Do NOT add a title slide - only section content

VARY THE SLIDE FORM. A deck of nothing but bullet lists looks amateurish. Match the
form to what the content actually is:
- Numbers that compare over categories or time -> "chart" (a real, editable chart)
- 2-4 headline figures (percentages, totals, counts) -> "stats" tiles, NOT bullets
- 2-4 parallel ideas that each need a name AND a sentence -> "cards"
- A set of short peer labels with no order and no measure -> "chips"
- Two things set against each other (before/after, pros/cons, hiện trạng/đề xuất) -> "comparison"
- A sequence of phases, steps or milestones -> "timeline"
- One striking statement, principle or conclusion -> "quote"
- Precise tabular data with several columns -> "table"
- Only fall back to plain bullets when none of the above fits
Aim for at most ONE plain bullet slide per section. Across a section, do not use
the same content field twice in a row.

When finished, you MUST call the submit-section-slides tool with your slides. Do not respond with raw JSON - always use the tool.

Available slide layouts:
- "section": Divider slide with title + optional subtitle.
- "content": A titled slide. Supply EXACTLY ONE of these content fields:
  - "chart": { "type": "bar"|"line"|"pie"|"doughnut"|"area", "categories": ["Q1","Q2"], "series": [{ "name": "Doanh thu", "values": [10, 20] }] }
    Max 5 series. Values must be plain numbers.
  - "stats": [{ "value": "40%", "label": "Giảm số lỗi" }, ...] (2-4 items; value is short, label explains it)
  - "cards": [{ "title": "Minh bạch", "text": "Một câu giải thích." }, ...] (2-4 items)
  - "chips": ["Y tế", "Giáo dục", "Giao thông", ...] (3-12 short labels, 1-3 words each)
  - "comparison": { "left": { "title": "Hiện trạng", "points": ["..."] }, "right": { "title": "Đề xuất", "points": ["..."] } }
  - "timeline": [{ "label": "Quý I", "text": "Khảo sát" }, ...] (2-5 steps)
  - "table": { "headers": ["Col1","Col2"], "rows": [["a","b"]] }
  - "content": ["bullet 1", "bullet 2"] (3-6 concise points)
  Optionally ALSO add "callout": { "label": "Trọng tâm", "text": "One sentence." }
  to a slide that uses "cards", "chips" or "content" - it renders as a highlighted
  closing statement. Never combine "callout" with chart/stats/comparison/timeline/table.
- "quote": { "quote": "the statement", "attribution": "who said it" }
- "blank": Empty slide

PHOTOS. A slide may carry "imageQuery": a SHORT ENGLISH search phrase for a stock
photo, 2-4 words naming a concrete, photographable subject (e.g. "vietnamese
government office", "data center servers", "football stadium crowd").
- ALWAYS set "imageQuery" on the "section" divider slide. It is not optional
  there: the divider is built around a photo panel and looks unfinished without
  one. Start every section with a divider slide that has an imageQuery.
- Write the query in English even for a Vietnamese deck - the photo index is
  matched on English keywords. An abstract query ("digital transformation",
  "innovation") returns generic filler; name a thing you could point a camera at.
- You MAY also set it on ONE plain-bullet "content" slide per section, where the
  photo sets the scene. A chart, stats, cards, chips, comparison, timeline or
  table slide is already full - never add "imageQuery" to one.`;

/**
 * Spawns a focused child AIbitat agent to build slides for a single presentation section.
 * The child reuses the parent's provider/model/socket so introspection events (tool calls,
 * research progress) flow to the frontend in real-time.
 *
 * @param {Object} options
 * @param {AIbitat} options.parentAibitat - The parent AIbitat instance (provides provider, socket, introspect)
 * @param {Object} options.section - Section definition { title, keyPoints?, instructions? }
 * @param {string} options.presentationTitle - Overall presentation title for context
 * @param {string} [options.conversationContext] - Recent conversation history for context
 * @param {string} [options.sectionPrefix] - Progress indicator like "1/5" for UI display
 * @returns {Promise<{slides: Object[], citations: Object[]}>} Parsed section slides and accumulated citations
 */
async function runSectionAgent({
  parentAibitat,
  section,
  presentationTitle,
  conversationContext = "",
  sectionPrefix = "",
  slideBudget,
}) {
  const log = parentAibitat.handlerProps?.log || console.log;

  const childAibitat = new AIbitat({
    provider: parentAibitat.defaultProvider.provider,
    model: parentAibitat.defaultProvider.model,
    chats: [],
    handlerProps: parentAibitat.handlerProps,
    maxToolCalls: 5,
  });

  // Share introspect so tool activity (web-search status, etc.) streams to the frontend
  childAibitat.introspect = parentAibitat.introspect;

  // Filtered socket: pass through introspection but suppress reportStreamEvent
  // so sub-agent chatter doesn't render in the UI as a chat message.
  childAibitat.socket = {
    send: (type, content) => {
      if (type === "reportStreamEvent") return;
      parentAibitat.socket?.send(type, content);
    },
  };

  // Only load the research tools this sub-agent needs
  const { webBrowsing } = require("../../web-browsing.js");
  const { webScraping } = require("../../web-scraping.js");
  childAibitat.use(webBrowsing.plugin());
  childAibitat.use(webScraping.plugin());

  // Internal tool for structured slide submission - not exposed as a public plugin
  childAibitat.function({
    super: childAibitat,
    name: "submit-section-slides",
    description:
      "Submit the completed slides for this presentation section. Call this tool when you have finished creating all slides.",
    parameters: {
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "object",
      properties: {
        slides: {
          type: "array",
          description: "Array of slide objects for this section",
          items: {
            type: "object",
            properties: {
              layout: {
                type: "string",
                enum: ["section", "content", "quote", "blank"],
                description: "The slide layout type",
              },
              title: {
                type: "string",
                description: "The slide title",
              },
              subtitle: {
                type: "string",
                description: "Optional subtitle (for section layout)",
              },
              content: {
                type: "array",
                items: { type: "string" },
                description: "Bullet points (for content layout)",
              },
              notes: {
                type: "string",
                description: "Speaker notes for this slide",
              },
              quote: {
                type: "string",
                description: "The statement to set large (for the 'quote' layout).",
              },
              attribution: {
                type: "string",
                description: "Who the quote belongs to (for the 'quote' layout).",
              },
              chart: {
                type: "object",
                description:
                  "A native, editable PowerPoint chart. Use whenever the slide compares numbers across categories or time.",
                properties: {
                  type: {
                    type: "string",
                    enum: ["bar", "line", "pie", "doughnut", "area"],
                    description:
                      "'bar' compares categories, 'line'/'area' show trend over time, 'pie'/'doughnut' show composition of a whole.",
                  },
                  categories: {
                    type: "array",
                    items: { type: "string" },
                    description: "X-axis / slice labels, e.g. ['Q1','Q2','Q3'].",
                  },
                  series: {
                    type: "array",
                    description: "Up to 5 data series.",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        values: { type: "array", items: { type: "number" } },
                      },
                      required: ["name", "values"],
                    },
                  },
                },
                required: ["type", "categories", "series"],
              },
              stats: {
                type: "array",
                description:
                  "2-4 headline figures shown as large KPI tiles. Use instead of bullets when the point IS the number.",
                items: {
                  type: "object",
                  properties: {
                    value: {
                      type: "string",
                      description: "The figure itself, kept short: '40%', '2,5 tỷ', '128'.",
                    },
                    label: {
                      type: "string",
                      description: "Short caption explaining the figure.",
                    },
                  },
                  required: ["value", "label"],
                },
              },
              imageQuery: {
                type: "string",
                description:
                  "Short ENGLISH stock-photo search phrase naming a concrete subject, e.g. 'vietnamese government office'. REQUIRED on every 'section' divider slide. Optional on at most one plain-bullet 'content' slide per section. Never on chart/stats/cards/chips/comparison/timeline/table slides.",
              },
              cards: {
                type: "array",
                description:
                  "2-4 parallel ideas, each with a short name and one explanatory sentence. Use instead of bullets when each point has a heading.",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string", description: "Short card heading, 1-4 words." },
                    text: { type: "string", description: "One sentence explaining the card." },
                  },
                  required: ["title"],
                },
              },
              chips: {
                type: "array",
                items: { type: "string" },
                description:
                  "3-12 short peer labels with no order and no measure (e.g. sectors, tools, criteria). 1-3 words each.",
              },
              callout: {
                type: "object",
                description:
                  "A highlighted closing statement beneath 'cards', 'chips' or 'content'. Never use with chart/stats/comparison/timeline/table.",
                properties: {
                  label: { type: "string", description: "Optional short kicker, e.g. 'Trọng tâm'." },
                  text: { type: "string", description: "The single sentence to highlight." },
                },
                required: ["text"],
              },
              comparison: {
                type: "object",
                description: "Two things set side by side (before/after, pros/cons).",
                properties: {
                  left: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      points: { type: "array", items: { type: "string" } },
                    },
                    required: ["title", "points"],
                  },
                  right: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      points: { type: "array", items: { type: "string" } },
                    },
                    required: ["title", "points"],
                  },
                },
                required: ["left", "right"],
              },
              timeline: {
                type: "array",
                description: "2-5 sequential phases, steps or milestones.",
                items: {
                  type: "object",
                  properties: {
                    label: { type: "string", description: "Short step name, e.g. 'Quý I'." },
                    text: { type: "string", description: "One-line detail for the step." },
                  },
                  required: ["label"],
                },
              },
              table: {
                type: "object",
                description: "Optional table data",
                properties: {
                  headers: {
                    type: "array",
                    items: { type: "string" },
                  },
                  rows: {
                    type: "array",
                    items: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                },
              },
            },
            required: ["layout", "title"],
          },
        },
      },
      required: ["slides"],
      additionalProperties: false,
    },
    handler: function ({ slides }) {
      this.super._submittedSlides = slides;
      return "Slides submitted successfully. Section complete.";
    },
  });

  const functions = Array.from(childAibitat.functions.values());
  const messages = [
    { role: "system", content: SECTION_BUILDER_PROMPT },
    {
      role: "user",
      content: buildSectionPrompt({
        section,
        presentationTitle,
        conversationContext,
        slideBudget,
      }),
    },
  ];

  const provider = childAibitat.getProviderForConfig(
    childAibitat.defaultProvider
  );
  provider.attachHandlerProps(childAibitat.handlerProps);

  log(
    `[SectionAgent] Running sub-agent for section: "${section.title}" with ${functions.length} tools`
  );

  let agentName = `@section-builder`;
  if (sectionPrefix) agentName = `[${sectionPrefix}] ${agentName}`;
  try {
    if (provider.supportsAgentStreaming) {
      await childAibitat.handleAsyncExecution(
        provider,
        messages,
        functions,
        agentName
      );
    } else {
      await childAibitat.handleExecution(
        provider,
        messages,
        functions,
        agentName
      );
    }
  } catch (error) {
    log(`[SectionAgent] Error in section "${section.title}": ${error.message}`);
    return { ...buildFallbackSlides(section), citations: [] };
  }

  // Collect any citations the child accumulated (from web-search, web-scrape, etc.)
  const citations = childAibitat._pendingCitations || [];

  // Retrieve slides from the tool call (structured data, no parsing needed)
  const slides = childAibitat._submittedSlides;
  if (!Array.isArray(slides) || slides.length === 0) {
    log(
      `[SectionAgent] No slides submitted for "${section.title}", using fallback`
    );
    return { ...buildFallbackSlides(section), citations };
  }

  log(
    `[SectionAgent] Section "${section.title}" produced ${slides.length} slides, ${citations.length} citations`
  );
  return { slides, citations };
}

function buildSectionPrompt({
  section,
  presentationTitle,
  conversationContext,
  slideBudget,
}) {
  const parts = [
    `Build slides for this section of the presentation "${presentationTitle}":`,
    `\nSection Title: ${section.title}`,
  ];

  if (section.keyPoints?.length > 0) {
    parts.push(
      `\nKey Points to Cover:\n${section.keyPoints.map((p) => `- ${p}`).join("\n")}`
    );
  }

  if (section.instructions) {
    parts.push(`\nSpecial Instructions: ${section.instructions}`);
  }

  if (conversationContext) {
    parts.push(`\nContext from the conversation:\n${conversationContext}`);
  }

  const n = Number.isFinite(slideBudget)
    ? Math.max(1, Math.min(8, Math.round(slideBudget)))
    : null;
  parts.push(
    n
      ? `\nCreate EXACTLY ${n} slide${n > 1 ? "s" : ""} for this section, counting the opening divider slide as one of them (so ${n > 1 ? `1 divider + ${n - 1} content slide${n - 1 !== 1 ? "s" : ""}` : "1 slide"}). Split the key points across those slides - do not merge them onto fewer slides. Submit them using the submit-section-slides tool. Only use web search/scraping if you genuinely lack the information needed.`
      : `\nCreate 2-5 detailed slides and submit them using the submit-section-slides tool. Only use web search/scraping if you genuinely lack the information needed.`
  );

  return parts.join("\n");
}

/**
 * Generates basic slides from the section definition when the sub-agent fails.
 */
function buildFallbackSlides(section) {
  const slides = [
    {
      layout: "section",
      title: section.title,
      subtitle: section.subtitle || "",
    },
  ];

  if (section.keyPoints?.length > 0) {
    slides.push({
      layout: "content",
      title: section.title,
      content: section.keyPoints,
      notes: `Key points for ${section.title}`,
    });
  }

  return { slides };
}

module.exports = { runSectionAgent };
