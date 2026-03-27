const AIbitat = require("../../../index.js");
const { safeJsonParse } = require("../../../../../http");

const SECTION_BUILDER_PROMPT = `You are a focused presentation section builder. Your ONLY task is to create detailed, well-researched slides for ONE section of a PowerPoint presentation.

You have access to web search and web scraping tools. Use them when you need current data, statistics, or specific information to strengthen your slides. Only research what is directly relevant.

RULES:
- Create 2-5 slides for this section (no more)
- Each content slide should have 3-6 concise bullet points
- Be specific and data-driven when possible
- Include speaker notes with key talking points
- Do NOT add a title slide - only section content

When finished, respond with ONLY a valid JSON object in this exact format:
{
  "slides": [
    {
      "layout": "section",
      "title": "Section Title",
      "subtitle": "Optional subtitle"
    },
    {
      "layout": "content",
      "title": "Slide Title",
      "content": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
      "notes": "Speaker notes here"
    }
  ]
}

Available slide layouts:
- "section": Divider slide with title + optional subtitle
- "content": Bullet points with title + content array + optional notes
  - May include "table": { "headers": ["Col1", "Col2"], "rows": [["a", "b"]] }
- "blank": Empty slide

Your ENTIRE response must be valid parseable JSON. No markdown fences, no explanation, no text outside the JSON.`;

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
 * @returns {Promise<{slides: Object[], citations: Object[]}>} Parsed section slides and accumulated citations
 */
async function runSectionAgent({
  parentAibitat,
  section,
  presentationTitle,
  conversationContext = "",
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
  // so the raw JSON slide output doesn't render in the UI as a chat message.
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

  let responseText;
  try {
    if (provider.supportsAgentStreaming) {
      responseText = await childAibitat.handleAsyncExecution(
        provider,
        messages,
        functions,
        "@section-builder"
      );
    } else {
      responseText = await childAibitat.handleExecution(
        provider,
        messages,
        functions,
        "@section-builder"
      );
    }
  } catch (error) {
    log(`[SectionAgent] Error in section "${section.title}": ${error.message}`);
    return { ...buildFallbackSlides(section), citations: [] };
  }

  // Collect any citations the child accumulated (from web-search, web-scrape, etc.)
  const citations = childAibitat._pendingCitations || [];

  const parsed = parseSectionResponse(responseText, log);
  if (!parsed || !Array.isArray(parsed.slides) || parsed.slides.length === 0) {
    log(
      `[SectionAgent] Failed to parse structured response for "${section.title}", using fallback`
    );
    return { ...buildFallbackSlides(section), citations };
  }

  log(
    `[SectionAgent] Section "${section.title}" produced ${parsed.slides.length} slides, ${citations.length} citations`
  );
  return { ...parsed, citations };
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
    `\nResearch the topic using your tools if needed, then create 2-5 detailed slides. Respond with ONLY valid JSON.`
  );

  return parts.join("\n");
}

/**
 * Attempts multiple strategies to extract a JSON slides object from the agent response.
 * Local models often wrap JSON in markdown fences or add preamble text.
 */
function parseSectionResponse(text, log) {
  if (!text) return null;

  let parsed = safeJsonParse(text.trim(), null);
  if (parsed?.slides) return parsed;

  // Strip markdown code fences
  const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (fenceMatch) {
    parsed = safeJsonParse(fenceMatch[1].trim(), null);
    if (parsed?.slides) return parsed;
  }

  // Extract the outermost JSON object containing "slides"
  const objectMatch = text.match(/\{[\s\S]*"slides"\s*:\s*\[[\s\S]*\]\s*\}/);
  if (objectMatch) {
    parsed = safeJsonParse(objectMatch[0], null);
    if (parsed?.slides) return parsed;
  }

  log?.(
    `[SectionAgent] Could not parse JSON from response: ${text.substring(0, 300)}...`
  );
  return null;
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
