const { sourceIdentifier } = require("../../chats");
const { safeJsonParse } = require("../../http");
const { TokenManager } = require("../tiktoken");
const { convertToPromptHistory } = require("./responses");

/**
 * Compresses the message array to fit within the prompt window limit via end-truncation.
 * @param {Object} llm - The LLM object.
 * @param {Object[]} messages - The messages to compress.
 * @param {Object[]} rawHistory - The raw history of messages.
 * @returns {Promise<Object[]>} The compressed messages.
 */
async function messageArrayCompressor(llm, messages = [], rawHistory = []) {
  // assume the response will be at least 600 tokens. If the total prompt + reply is over we need to proactively
  // run the compressor to ensure the prompt has enough space to reply.
  // realistically - most users will not be impacted by this.
  const tokenBuffer = 600;
  const tokenManager = new TokenManager(llm.model);
  // If no work needs to be done, just pass through.
  if (tokenManager.statsFrom(messages) + tokenBuffer < llm.promptWindowLimit())
    return messages;

  const system = messages.shift();
  const user = messages.pop();
  const userPromptSize = tokenManager.countFromString(user.content);

  // User prompt is the main focus here - we we prioritize it and allow
  // it to highjack the entire conversation thread. We are going to
  // cannonball the prompt through to ensure the reply has at least 20% of
  // the token supply to reply with.
  if (userPromptSize > llm.limits.user) {
    return [
      {
        role: "user",
        content: truncateContent({
          input: user.content,
          targetTokenSize: llm.promptWindowLimit() * 0.8,
          tiktokenInstance: tokenManager,
        }),
      },
    ];
  }

  const compressedSystem = new Promise(async (resolve) => {
    const count = tokenManager.countFromString(system.content);
    if (count < llm.limits.system) {
      resolve(system);
      return;
    }

    // Split context from system prompt - cannonball since its over the window.
    // We assume the context + user prompt is enough tokens to fit.
    const [prompt, context = ""] = system.content.split("Context:");
    let compressedPrompt;
    let compressedContext;

    // If the user system prompt contribution's to the system prompt is more than
    // 25% of the system limit, we will cannonball it - this favors the context
    // over the instruction from the user.
    if (tokenManager.countFromString(prompt) >= llm.limits.system * 0.25) {
      compressedPrompt = truncateContent({
        input: prompt,
        targetTokenSize: llm.limits.system * 0.25,
        tiktokenInstance: tokenManager,
      });
    } else {
      compressedPrompt = prompt;
    }

    if (tokenManager.countFromString(context) >= llm.limits.system * 0.75) {
      compressedContext = truncateContent({
        input: context,
        targetTokenSize: llm.limits.system * 0.75,
        tiktokenInstance: tokenManager,
      });
    } else {
      compressedContext = context;
    }

    system.content = `${compressedPrompt}${
      compressedContext ? `\nContext: ${compressedContext}` : ""
    }`;
    resolve(system);
  });

  // Prompt is allowed to take up to 70% of window - we know its under
  // if we are here, so passthrough.
  const compressedPrompt = new Promise(async (resolve) => resolve(user));

  // We always aggressively compress history because it is the least
  // important data to retain in full-fidelity.
  const compressedHistory = new Promise((resolve) => {
    const eligibleHistoryItems = [];
    var historyTokenCount = 0;

    for (const [i, history] of rawHistory.reverse().entries()) {
      const [user, assistant] = convertToPromptHistory([history]);
      const [userTokens, assistantTokens] = [
        tokenManager.countFromString(user.content),
        tokenManager.countFromString(assistant.content),
      ];
      const total = userTokens + assistantTokens;

      // If during the loop the token cost of adding this history
      // is small, we can add it to history and move onto next.
      if (historyTokenCount + total < llm.limits.history) {
        eligibleHistoryItems.unshift(user, assistant);
        historyTokenCount += total;
        continue;
      }

      // If we reach here the overhead of adding this history item will
      // be too much of the limit. So now, we are prioritizing
      // the most recent 3 message pairs - if we are already past those - exit loop and stop
      // trying to make history work.
      if (i > 2) break;

      // We are over the limit and we are within the first 3 most recent chats.
      // so now we cannonball them to make them fit into the window.
      // max size = llm.limit.history; Each component of the message, can at most
      // be 50% of the history. We cannonball whichever is the problem.
      // The math isnt perfect for tokens, so we have to add a fudge factor for safety.
      const maxTargetSize = Math.floor(llm.limits.history / 2.2);
      if (userTokens > maxTargetSize) {
        user.content = truncateContent({
          input: user.content,
          targetTokenSize: maxTargetSize,
          tiktokenInstance: tokenManager,
        });
      }

      if (assistantTokens > maxTargetSize) {
        assistant.content = truncateContent({
          input: assistant.content,
          targetTokenSize: maxTargetSize,
          tiktokenInstance: tokenManager,
        });
      }

      const newTotal = tokenManager.statsFrom([user, assistant]);
      if (historyTokenCount + newTotal > llm.limits.history) continue;
      eligibleHistoryItems.unshift(user, assistant);
      historyTokenCount += newTotal;
    }
    resolve(eligibleHistoryItems);
  });

  const [cSystem, cHistory, cPrompt] = await Promise.all([
    compressedSystem,
    compressedHistory,
    compressedPrompt,
  ]);
  return [cSystem, ...cHistory, cPrompt];
}

// Implementation of messageArrayCompressor, but for string only completion models
async function messageStringCompressor(llm, promptArgs = {}, rawHistory = []) {
  const tokenBuffer = 600;
  const tokenManager = new TokenManager(llm.model);
  const initialPrompt = llm.constructPrompt(promptArgs);
  if (
    tokenManager.statsFrom(initialPrompt) + tokenBuffer <
    llm.promptWindowLimit()
  )
    return initialPrompt;

  const system = promptArgs.systemPrompt;
  const user = promptArgs.userPrompt;
  const userPromptSize = tokenManager.countFromString(user);

  // User prompt is the main focus here - we we prioritize it and allow
  // it to highjack the entire conversation thread. We are going to
  // cannonball the prompt through to ensure the reply has at least 20% of
  // the token supply to reply with.
  if (userPromptSize > llm.limits.user) {
    return llm.constructPrompt({
      userPrompt: truncateContent({
        input: user,
        targetTokenSize: llm.promptWindowLimit() * 0.8,
        tiktokenInstance: tokenManager,
      }),
    });
  }

  const compressedSystem = new Promise(async (resolve) => {
    const count = tokenManager.countFromString(system);
    if (count < llm.limits.system) {
      resolve(system);
      return;
    }
    resolve(
      truncateContent({
        input: system,
        targetTokenSize: llm.limits.system,
        tiktokenInstance: tokenManager,
      })
    );
  });

  // Prompt is allowed to take up to 70% of window - we know its under
  // if we are here, so passthrough.
  const compressedPrompt = new Promise(async (resolve) => resolve(user));

  // We always aggressively compress history because it is the least
  // important data to retain in full-fidelity.
  const compressedHistory = new Promise((resolve) => {
    const eligibleHistoryItems = [];
    var historyTokenCount = 0;

    for (const [i, history] of rawHistory.reverse().entries()) {
      const [user, assistant] = convertToPromptHistory([history]);
      const [userTokens, assistantTokens] = [
        tokenManager.countFromString(user.content),
        tokenManager.countFromString(assistant.content),
      ];
      const total = userTokens + assistantTokens;

      // If during the loop the token cost of adding this history
      // is small, we can add it to history and move onto next.
      if (historyTokenCount + total < llm.limits.history) {
        eligibleHistoryItems.unshift(user, assistant);
        historyTokenCount += total;
        continue;
      }

      // If we reach here the overhead of adding this history item will
      // be too much of the limit. So now, we are prioritizing
      // the most recent 3 message pairs - if we are already past those - exit loop and stop
      // trying to make history work.
      if (i > 2) break;

      // We are over the limit and we are within the first 3 most recent chats.
      // so now we cannonball them to make them fit into the window.
      // max size = llm.limit.history; Each component of the message, can at most
      // be 50% of the history. We cannonball whichever is the problem.
      // The math isnt perfect for tokens, so we have to add a fudge factor for safety.
      const maxTargetSize = Math.floor(llm.limits.history / 2.2);
      if (userTokens > maxTargetSize) {
        user.content = truncateContent({
          input: user.content,
          targetTokenSize: maxTargetSize,
          tiktokenInstance: tokenManager,
        });
      }

      if (assistantTokens > maxTargetSize) {
        assistant.content = truncateContent({
          input: assistant.content,
          targetTokenSize: maxTargetSize,
          tiktokenInstance: tokenManager,
        });
      }

      const newTotal = tokenManager.statsFrom([user, assistant]);
      if (historyTokenCount + newTotal > llm.limits.history) continue;
      eligibleHistoryItems.unshift(user, assistant);
      historyTokenCount += newTotal;
    }
    resolve(eligibleHistoryItems);
  });

  const [cSystem, cHistory, cPrompt] = await Promise.all([
    compressedSystem,
    compressedHistory,
    compressedPrompt,
  ]);

  return llm.constructPrompt({
    systemPrompt: cSystem,
    contextTexts: promptArgs?.contextTexts || [],
    chatHistory: cHistory,
    userPrompt: cPrompt,
  });
}

function truncateContent({
  input = "",
  targetTokenSize = 0,
  tiktokenInstance = null,
  ellipsesStr = null,
}) {
  if (!input || !targetTokenSize) return input;
  const tokenManager = tiktokenInstance || new TokenManager();
  const truncText = ellipsesStr || "\n\n--prompt truncated for brevity--\n\n";
  const initialInputSize = tokenManager.countFromString(input);
  if (initialInputSize < targetTokenSize) return input;

  if (input.length > TokenManager.MAX_STRING_LENGTH) {
    console.log(
      "[truncateContent] input is very large - truncating end of input by estimate"
    );
    const charsToTruncate = targetTokenSize * TokenManager.TOKEN_CHAR_ESTIMATE; // approx number of chars to truncate
    return input.slice(0, input.length - charsToTruncate);
  }

  // if the delta is the token difference between where our prompt is in size
  // and where we ideally need to land.
  const delta = initialInputSize - targetTokenSize;
  const tokenChunks = tokenManager.tokensFromString(input);
  const allowedTokens = tokenChunks.slice(0, delta * -1);
  const truncatedText = tokenManager.bytesFromTokens(allowedTokens) + truncText;
  console.log(
    `[Content Truncated] ${initialInputSize} => ${allowedTokens.length} tokens.`
  );
  return truncatedText;
}

/**
 * Fill the sources window with the priority of
 * 1. Pinned documents (handled prior to function)
 * 2. VectorSearch results
 * 3. prevSources in chat history - starting from most recent.
 *
 * Ensuring the window always has the desired amount of sources so that followup questions
 * in any chat mode have relevant sources, but not infinite sources. This function is used during chatting
 * and allows follow-up questions within a query chat that otherwise would have zero sources and would fail.
 * The added benefit is that during regular RAG chat, we have better coherence of citations that otherwise would
 * also yield no results with no need for a ReRanker to run and take much longer to return a response.
 *
 * The side effect of this is follow-up unrelated questions now have citations that would look totally irrelevant, however
 * we would rather optimize on the correctness of a response vs showing extraneous sources during a response. Given search
 * results always take a priority a good unrelated question that produces RAG results will still function as desired and due to previous
 * history backfill sources "changing context" mid-chat is handled appropriately.
 * example:
 * ---previous implementation---
 * prompt 1: "What is anythingllm?" -> possibly get 4 good sources
 * prompt 2: "Tell me some features" -> possible get 0 - 1 maybe relevant source + previous answer response -> bad response due to bad context mgmt
 * ---next implementation---
 * prompt 1: "What is anythingllm?" -> possibly get 4 good sources
 * prompt 2: "Tell me some features" -> possible get 0 - 1 maybe relevant source + previous answer response -> backfill with 3 good sources from previous -> much better response
 *
 * @param {Object} config - params to call
 * @param {object} config.nDocs = fill size of the window
 * @param {object} config.searchResults = vector `similarityResponse` results for .sources
 * @param {object[]} config.history - rawHistory of chat containing sources
 * @param {string[]} config.filterIdentifiers - Pinned document identifiers to prevent duplicate context
 * @returns {{
 *   contextTexts: string[],
 *   sources: object[],
 * }} - Array of sources that should be added to window
 */
function fillSourceWindow({
  nDocs = 4, // Number of documents
  searchResults = [], // Sources from similarity search
  history = [], // Raw history
  filterIdentifiers = [], // pinned document sources
} = config) {
  const sources = [...searchResults];

  if (sources.length >= nDocs || history.length === 0) {
    return {
      sources,
      contextTexts: sources.map((src) => src.text),
    };
  }

  const log = (text, ...args) => {
    console.log(`\x1b[36m[fillSourceWindow]\x1b[0m ${text}`, ...args);
  };

  log(
    `Need to backfill ${nDocs - searchResults.length} chunks to fill in the source window for RAG!`
  );
  const seenChunks = new Set(searchResults.map((source) => source.id));

  // We need to reverse again because we need to iterate from bottom of array (most recent chats)
  // Looking at this function by itself you may think that this loop could be extreme for long history chats,
  // but this was already handled where `history` we derived. This comes from `recentChatHistory` which
  // includes a limit for history (default: 20). So this loop does not look as extreme as on first glance.
  for (const chat of history.reverse()) {
    if (sources.length >= nDocs) {
      log(
        `Citations backfilled to ${nDocs} references from ${searchResults.length} original citations.`
      );
      break;
    }

    const chatSources =
      safeJsonParse(chat.response, { sources: [] })?.sources || [];
    if (!chatSources?.length || !Array.isArray(chatSources)) continue;

    const validSources = chatSources.filter((source) => {
      return (
        filterIdentifiers.includes(sourceIdentifier(source)) == false && // source cannot be in current pins
        source.hasOwnProperty("score") && // source cannot have come from a pinned document that was previously pinned
        source.hasOwnProperty("text") && // source has a valid text property we can use
        seenChunks.has(source.id) == false // is unique
      );
    });

    for (const validSource of validSources) {
      if (sources.length >= nDocs) break;
      sources.push(validSource);
      seenChunks.add(validSource.id);
    }
  }

  return {
    sources,
    contextTexts: sources.map((src) => src.text),
  };
}

module.exports = {
  messageArrayCompressor,
  messageStringCompressor,
  fillSourceWindow,
};
