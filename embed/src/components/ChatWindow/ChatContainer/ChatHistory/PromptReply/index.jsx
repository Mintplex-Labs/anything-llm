import { forwardRef, memo } from "react";
import { Warning } from "@phosphor-icons/react";
import renderMarkdown from "@/utils/chat/markdown";
import { embedderSettings } from "@/main";
import AnythingLLMIcon from "@/assets/anything-llm-icon.svg";
import { formatDate } from "@/utils/date";

const PromptReply = forwardRef(
  ({ uuid, reply, pending, error, sources = [] }, ref) => {
    if (!reply && sources.length === 0 && !pending && !error) return null;

    if (pending) {
      return (
        <div className={`flex items-start w-full h-fit justify-start`}>
          <img
            src={embedderSettings.settings.assistantIcon || AnythingLLMIcon}
            alt="Anything LLM Icon"
            className="w-9 h-9 flex-shrink-0 ml-2"
          />
          <div
            style={{ wordBreak: "break-word" }}
            className={`py-[11px] px-4 flex flex-col ${embedderSettings.ASSISTANT_STYLES} shadow-[0_4px_14px_rgba(0,0,0,0.25)]`}
          >
            <div className="flex gap-x-5">
              <div className="mx-4 my-1 dot-falling"></div>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className={`flex items-end w-full h-fit justify-start`}>
          <img
            src={embedderSettings.settings.assistantIcon || AnythingLLMIcon}
            alt="Anything LLM Icon"
            className="w-9 h-9 flex-shrink-0 ml-2"
          />
          <div
            style={{ wordBreak: "break-word" }}
            className={`py-[11px] px-4 rounded-lg flex flex-col bg-red-200 shadow-[0_4px_14px_rgba(0,0,0,0.25)] mr-[37px] ml-[9px]`}
          >
            <div className="flex gap-x-5">
              <span
                className={`inline-block p-2 rounded-lg bg-red-50 text-red-500`}
              >
                <Warning className="h-4 w-4 mb-1 inline-block" /> Could not
                respond to message.
                <span className="text-xs">Reason: {error || "unknown"}</span>
              </span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="py-[5px]">
        <div
          className={`text-[10px] font-medium text-gray-400 ml-[54px] mr-6 mb-2 text-left`}
        >
          {embedderSettings.settings.assistantName ||
            "Anything LLM Chat Assistant"}
        </div>
        <div
          key={uuid}
          ref={ref}
          className={`flex items-start w-full h-fit justify-start`}
        >
          <img
            src={embedderSettings.settings.assistantIcon || AnythingLLMIcon}
            alt="Anything LLM Icon"
            className="w-9 h-9 flex-shrink-0 ml-2"
          />
          <div
            style={{ wordBreak: "break-word" }}
            className={`py-[11px] px-4 flex flex-col ${
              error ? "bg-red-200" : embedderSettings.ASSISTANT_STYLES
            } shadow-[0_4px_14px_rgba(0,0,0,0.25)]`}
          >
            <div className="flex gap-x-5">
              <span
                className={`reply whitespace-pre-line font-normal text-sm md:text-sm flex flex-col gap-y-1`}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(reply) }}
              />
            </div>
          </div>
        </div>
        <div
          className={`text-[10px] font-medium text-gray-400 ml-[54px] mr-6 mt-2 text-left`}
        >
          {formatDate(Date.now() / 1000)}
        </div>
      </div>
    );
  }
);

export default memo(PromptReply);
