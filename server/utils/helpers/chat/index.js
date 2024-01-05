const { convertToPromptHistory } = require("../../chats");
const { TokenManager } = require("../tiktoken");

/*
What is the message Array compressor?
TLDR: So anyway, i started blasting (your prompts & stuff)

messageArrayCompressor arose out of a need for users to be able to insert unlimited token prompts
and also maintain coherent history, system instructions and context, if applicable.

We took an opinionated approach that after much back-testing we have found retained a highly coherent answer
under most user conditions that a user would take while using this specific system. While other systems may
use a more advanced model for compressing message history or simplify text through a recursive approach - our is much more simple.

We "cannonball" the input.
Cannonball (verb): To ensure a prompt fits through a model window we blast a hole in the center of any inputs blocking our path to doing so.
This starts by dissecting the input as tokens and delete from the middle-out bi-directionally until the prompt window is satisfied.
You may think: "Doesn't this result in massive data loss?" - yes & no.
Under the use cases we expect the tool to be used, which is mostly chatting with documents, we are able to use this approach with minimal blowback
on the quality of responses.

We accomplish this by taking a rate-limit approach that is proportional to the model capacity. Since we support more than openAI models, this needs to 
be generic and reliance on a "better summary" model just is not a luxury we can afford. The added latency overhead during prompting is also unacceptable.
In general:
  system: at best 15% of token capacity
  history: at best 15% of token capacity
  prompt: at best 70% of token capacity.

we handle overflows by taking an aggressive path for two main cases.

1. Very large user prompt
- Likely uninterested in context, history, or even system prompt. This is a "standalone" prompt that highjacks the whole thread.
- We run this prompt on its own since a prompt that is over 70% of context window certainly is standalone.

2. Context window is exceeded in regular use.
- We do not touch prompt since it is very likely to be <70% of window.
- We check system prompt is not outrageous - if it is we cannonball it and keep context if present.
- We check a sliding window of history, only allowing up to 15% of the history to pass through if it fits, with a 
preference for recent history if we can cannonball to fit it, otherwise it is omitted.

We end up with a rather large prompt that fits through a given window with a lot of room for response in most use-cases.
We also take the approach that history is the least important and most flexible of the items in this array of responses.

There is a supplemental version of this function that also returns a formatted string for models like Claude-2
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
        content: cannonball({
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
    system.content = `${cannonball({
      input: prompt,
      targetTokenSize: llm.limits.system,
      tiktokenInstance: tokenManager,
    })}${context ? `\nContext: ${context}` : ""}`;
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
        user.content = cannonball({
          input: user.content,
          targetTokenSize: maxTargetSize,
          tiktokenInstance: tokenManager,
        });
      }

      if (assistantTokens > maxTargetSize) {
        assistant.content = cannonball({
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
      userPrompt: cannonball({
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
      cannonball({
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
        user.content = cannonball({
          input: user.content,
          targetTokenSize: maxTargetSize,
          tiktokenInstance: tokenManager,
        });
      }

      if (assistantTokens > maxTargetSize) {
        assistant.content = cannonball({
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

// Cannonball prompting: aka where we shoot a proportionally big cannonball through a proportional large prompt
// Nobody should be sending prompts this big, but there is no reason we shouldn't allow it if results are good even by doing it.
function cannonball({
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

  // if the delta is the token difference between where our prompt is in size
  // and where we ideally need to land.
  const delta = initialInputSize - targetTokenSize;
  const tokenChunks = tokenManager.countFromString(input);
  const middleIdx = Math.floor(tokenChunks.length / 2);

  // middle truncate the text going left and right of midpoint
  const leftChunks = tokenChunks.slice(0, middleIdx - Math.round(delta / 2));
  const rightChunks = tokenChunks.slice(middleIdx + Math.round(delta / 2));
  const truncatedText =
    tokenManager.bytesFromTokens(leftChunks) +
    truncText +
    tokenManager.bytesFromTokens(rightChunks);

  console.log(
    `Cannonball results ${initialInputSize} -> ${tokenManager.countFromString(
      truncatedText
    )} tokens.`
  );
  return truncatedText;
}

module.exports = {
  messageArrayCompressor,
  messageStringCompressor,
};
