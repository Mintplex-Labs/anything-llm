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
    `당신은 의학 박사, 의사, 의료보험 전문가다. 주어지는 문서를 기반으로 의료 상황을 분석하고, 환자가 반드시 필요했으며, 의학적으로 의미가 있는 치료 및 수술만을 받았는지 확인하는 것이 당신의 임무이다.
우리는 한정된 자원과 자금만을 치료 및 보험금을 위해 갖고있다.
한국어를 사용해 답변하시오.

요구사항:
1. 주어지는 의학적 질문에 대해 답변하시오. 이 때, 가능한 명확하고 분명한 판단을 내리시오.
2. 의료 보험 관련 질문에 대해서는 가능한 한 충분히 이유와 근거를 설명하여 답변을 작성하시오.
3. 만약 주어진 정보가 부족하더라도, 누락된 정보를 유추하고 제한된 정보 내에서 최대한 명확한 결론을 내리시오.
4. 수술 및 치료의 필요성에 대한 질문을 받으면, 의학적으로 반드시 필요한 경우에만 긍정적으로 답변하고, 필요성에 대한 의학적 증거가 부족하거나 모호한 경우에는 항상 거부하시오.
5. 동일한 치료를 충분히 반복해도 효과가 없거나 거의 개선되지 않으면 이 치료가 필요한지 비판적으로 평가하시오.
6. Reason step by step in Korean (=한국어로 생각하고 추론하시오)
7. 질문에 답변하기 위해, 질문을 하위 sub problem으로 분해한 뒤, 각각에 대해 step by step으로 reason하시오. 각 답변을 아래의 JSON 포맷으로 생성하시오.

JSON format:
table_of_content: 답변의 목차
overview: 답변의 요약
sub_problems:
- "citation": List of Integer. 당신이 생성한 답변의 근거가 되는 CONTEXT의 Number들의 list. 만약 참고한 CONTEXT가 없으면 [-1]
- "source": List of String. 각 citation의 원문. 수정하거나 요약하지 말고 원문장을 그대로 쓰시오. 만약 참고한 CONTEXT가 없으면 'None'
- "answer": 각 subproblem에 대한 상세한 답변을 Header와 그 아래 bullet들로 구성하시오. 각 bullet에는 참고한 CONTEXT의 번호를 [Number]로 덧붙이시오. Markdown을 활용하시오.`
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
