const { v4: uuidv4 } = require("uuid");
const { WorkspaceChats } = require("../../models/workspaceChats");
const { resetMemory } = require("./commands/reset");
const { convertToPromptHistory } = require("../helpers/chat/responses");
const { SlashCommandPresets } = require("../../models/slashCommandsPresets");

const VALID_COMMANDS = {
  "/reset": resetMemory,
};

async function grepCommand(message, user = null) {
  const userPresets = await SlashCommandPresets.getUserPresets(user?.id);
  const availableCommands = Object.keys(VALID_COMMANDS);

  // Check if the message starts with any built-in command
  for (let i = 0; i < availableCommands.length; i++) {
    const cmd = availableCommands[i];
    const re = new RegExp(`^(${cmd})`, "i");
    if (re.test(message)) {
      return cmd;
    }
  }

  // Replace all preset commands with their corresponding prompts
  // Allows multiple commands in one message
  let updatedMessage = message;
  for (const preset of userPresets) {
    const regex = new RegExp(
      `(?:\\b\\s|^)(${preset.command})(?:\\b\\s|$)`,
      "g"
    );
    updatedMessage = updatedMessage.replace(regex, preset.prompt);
  }

  return updatedMessage;
}

async function recentChatHistory({
  user = null,
  workspace,
  thread = null,
  messageLimit = 20,
  apiSessionId = null,
}) {
  const rawHistory = (
    await WorkspaceChats.where(
      {
        workspaceId: workspace.id,
        user_id: user?.id || null,
        thread_id: thread?.id || null,
        api_session_id: apiSessionId || null,
        include: true,
      },
      messageLimit,
      { id: "desc" }
    )
  ).reverse();
  return { rawHistory, chatHistory: convertToPromptHistory(rawHistory) };
}

function chatPrompt(workspace) {
  return (
    workspace?.openAiPrompt ??
    // workspace 생성시 실제로 적용되는 기본 prompt
    //"Given the following conversation, relevant context, and a follow up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the users instructions as needed."
    `Task:
    As a medical doctor and healthcare professional, Your role is to analyze a patient’s medical situation based on provided details and ensure that patients receive only necessary and medically meaningful treatment and surgery.
    We only have limited resources to pay for treatment.
    Your customers are Korean doctors and patients, so use Korean.
    
    Your output language: Korean (한국어, 한글)
    
    Requirements:
    1. Answer the following medical questions, but make your judgment as clear as possible.
    2. For questions related to health insurance, reason as fully as possible to conclude your answer.
    3. Even if you don't have enough information, Infer the missing information and make the clearest judgment you can within the limited information you have.
    4. When asked about the need for surgery and treatment, only answer affirmatively if it is medically necessary, and always deny if the medical evidence of need is lacking or ambiguous.
    5. If the same treatment has been repeated enough times with no effect or little improvement, critically evaluate whether this treatment is necessary.
    6. Must Answer in Korean.
    7. Never create Chinese, only use Korean, Hangul, and English. Useful keyword for your Korean writing: "항체, 만성, 피부, 항핵, 급성, 염좌, 국부적, 침범, 양성, 음성, anti-centromere antibody, 제한적 피부 침습(Limited cutaneous involvement):"`
    );
}

// We use this util function to deduplicate sources from similarity searching
// if the document is already pinned.
// Eg: You pin a csv, if we RAG + full-text that you will get the same data
// points both in the full-text and possibly from RAG - result in bad results
// even if the LLM was not even going to hallucinate.
function sourceIdentifier(sourceDocument) {
  if (!sourceDocument?.title || !sourceDocument?.published) return uuidv4();
  return `title:${sourceDocument.title}-timestamp:${sourceDocument.published}`;
}

module.exports = {
  sourceIdentifier,
  recentChatHistory,
  chatPrompt,
  grepCommand,
  VALID_COMMANDS,
};
