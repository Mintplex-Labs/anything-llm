const AIbitat = require("../../../index.js");

const SECTION_BUILDER_PROMPT = `You are a focused presentation section builder. Your ONLY task is to create detailed slides for ONE section of a PowerPoint presentation.

You have access to web search and web scraping tools, but only use them when the topic genuinely requires up-to-date information you don't already know (e.g., current statistics, recent events, specific company data). For general knowledge topics, create slides directly from your existing knowledge.

RULES:
- Create 2-5 slides for this section (no more)
- Each content slide should have 3-6 concise bullet points
- Be specific and data-driven when possible
- Include speaker notes with key talking points
- Do NOT add a title slide - only section content

When finished, you MUST call the submit-section-slides tool with your slides. Do not respond with raw JSON - always use the tool.

Available slide layouts:
- "section": Divider slide with title + optional subtitle
- "content": Bullet points with title + content array + optional notes
  - May include "table": { "headers": ["Col1", "Col2"], "rows": [["a", "b"]] }
- "blank": Empty slide`;

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
                enum: ["section", "content", "blank"],
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

  parts.push(
    `\nCreate 2-5 detailed slides and submit them using the submit-section-slides tool. Only use web search/scraping if you genuinely lack the information needed.`
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
