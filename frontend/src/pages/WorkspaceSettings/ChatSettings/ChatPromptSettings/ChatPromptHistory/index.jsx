const systemPromptHistory = [
  {
    prompt: "Given the following conversation, relevant context, and a follow up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the users instructions as needed.",
    modifiedAt: new Date("2024-01-01"),
  },
  {
    prompt: "Given the following conversation, relevant context, and a follow up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the users instructions as needed.",
    modifiedAt: new Date("2024-01-01"),
  },
  {
    prompt: "Given the following conversation, relevant context, and a follow up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the users instructions as needed.",
    modifiedAt: new Date("2024-01-01"),
  },
  {
    prompt: "Given the following conversation, relevant context, and a follow up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the users instructions as needed.",
    modifiedAt: new Date("2024-01-01"),
  },
];

export default function ChatPromptHistory() {
  return (
    <div className="fixed right-3 top-3 bottom-3 w-[375px] bg-theme-action-menu-bg rounded-xl py-4 px-4 z-[9999]">
      <div className="flex items-center justify-between">
        <div className="text-white text-sm font-medium">
          System Prompt History
        </div>
        <div className="text-sm font-medium text-white">Clear All</div>
      </div>
      <div className="mt-4 flex flex-col gap-y-[14px]">
      {systemPromptHistory.map((prompt) => (
        <PromptHistoryItem key={prompt.id} {...prompt} />
      ))}
      </div>
    </div>
  );
}

function PromptHistoryItem({ prompt, modifiedAt, modifiedBy }) {
  return (
    <div className="text-white">
        <div className="flex items-center justify-between">
        <div className="text-[#B6B7B7] text-xs">{modifiedAt.toLocaleString()}</div>
        <div className="text-xs">Restore</div>
        </div>
    <div className="flex items-center">
      <div className="text-white text-sm font-medium">{prompt}</div>
    </div>
    </div>
  );
}
