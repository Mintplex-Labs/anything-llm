import { Frown } from "react-feather";
import HistoricalMessage from "./HistoricalMessage";
import PromptReply from "./PromptReply";

export default function ChatHistory({ history = [], workspace }) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col h-[89%] md:mt-0 pb-5 w-full justify-center items-center">
        <div className="w-fit flex items-center gap-x-2">
          <Frown className="h-4 w-4 text-slate-400" />
          <p className="text-slate-400">No chat history found.</p>
        </div>
        <p className="text-slate-400 text-xs">
          Send your first message to get started.
        </p>
      </div>
    );
  }

  return (
    <div
      className="h-[89%] pb-[100px] md:pt-[50px] md:pt-0 md:pb-5 mx-2 md:mx-0 overflow-y-scroll flex flex-col justify-start no-scroll"
      id="chat-history"
    >
      {history.map(
        (
          {
            uuid = null,
            content,
            sources = [],
            role,
            closed = true,
            pending = false,
            error = false,
            animate = false,
          },
          index
        ) => {
          const isLastBotReply =
            index === history.length - 1 && role === "assistant";
          if (isLastBotReply && animate) {
            return (
              <PromptReply
                key={uuid}
                uuid={uuid}
                reply={content}
                pending={pending}
                sources={sources}
                error={error}
                workspace={workspace}
                closed={closed}
              />
            );
          }
          return (
            <HistoricalMessage
              key={index}
              message={content}
              role={role}
              workspace={workspace}
              sources={sources}
              error={error}
            />
          );
        }
      )}
    </div>
  );
}
