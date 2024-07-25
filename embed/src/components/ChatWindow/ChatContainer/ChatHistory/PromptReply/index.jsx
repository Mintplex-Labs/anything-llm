import { forwardRef, memo } from "react";
import { Warning } from "@phosphor-icons/react";
import renderMarkdown from "@/utils/chat/markdown";
import { embedderSettings } from "@/main";
import AnythingLLMIcon from "@/assets/anything-llm-icon.svg";
import { formatDate } from "@/utils/date";

const PromptReply = forwardRef(
  ({ uuid, reply, pending, error, sources = [] }, ref) => {
    if (!reply && sources.length === 0 && !pending && !error) return null;
    if (error) console.error(`ANYTHING_LLM_CHAT_WIDGET_ERROR: ${error}`);

    if (pending) {
      return (
        <div
          className={`allm-flex allm-items-start allm-w-full allm-h-fit allm-justify-start`}
        >
          <img
            src={embedderSettings.settings.assistantIcon || AnythingLLMIcon}
            alt="Anything LLM Icon"
            className="allm-w-9 allm-h-9 allm-flex-shrink-0 allm-ml-2"
          />
          <div
            style={{
              wordBreak: "break-word",
              backgroundColor: embedderSettings.ASSISTANT_STYLES.msgBg,
            }}
            className={`allm-py-[11px] allm-px-4 allm-flex allm-flex-col ${embedderSettings.ASSISTANT_STYLES.base} allm-shadow-[0_4px_14px_rgba(0,0,0,0.25)]`}
          >
            <div className="allm-flex allm-gap-x-5">
              <div className="allm-mx-4 allm-my-1 allm-dot-falling"></div>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div
          className={`allm-flex allm-items-end allm-w-full allm-h-fit allm-justify-start`}
        >
          <img
            src={embedderSettings.settings.assistantIcon || AnythingLLMIcon}
            alt="Anything LLM Icon"
            className="allm-w-9 allm-h-9 allm-flex-shrink-0 allm-ml-2"
          />
          <div
            style={{ wordBreak: "break-word" }}
            className={`allm-py-[11px] allm-px-4 allm-rounded-lg allm-flex allm-flex-col allm-bg-red-200 allm-shadow-[0_4px_14px_rgba(0,0,0,0.25)] allm-mr-[37px] allm-ml-[9px]`}
          >
            <div className="allm-flex allm-gap-x-5">
              <span
                className={`allm-inline-block allm-p-2 allm-rounded-lg allm-bg-red-50 allm-text-red-500`}
              >
                <Warning className="allm-h-4 allm-w-4 allm-mb-1 allm-inline-block" />{" "}
                Could not respond to message.
                <span className="allm-text-xs">Server error</span>
              </span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="allm-py-[5px]">
        <div
          className={`allm-text-[10px] allm-text-gray-400 allm-ml-[54px] allm-mr-6 allm-mb-2 allm-text-left allm-font-sans`}
        >
          {embedderSettings.settings.assistantName ||
            "Anything LLM Chat Assistant"}
        </div>
        <div
          key={uuid}
          ref={ref}
          className={`allm-flex allm-items-start allm-w-full allm-h-fit allm-justify-start`}
        >
          <img
            src={embedderSettings.settings.assistantIcon || AnythingLLMIcon}
            alt="Anything LLM Icon"
            className="allm-w-9 allm-h-9 allm-flex-shrink-0 allm-ml-2"
          />
          <div
            style={{
              wordBreak: "break-word",
              backgroundColor: embedderSettings.ASSISTANT_STYLES.msgBg,
            }}
            className={`allm-py-[11px] allm-px-4 allm-flex allm-flex-col ${
              error ? "allm-bg-red-200" : embedderSettings.ASSISTANT_STYLES.base
            } allm-shadow-[0_4px_14px_rgba(0,0,0,0.25)]`}
          >
            <div className="allm-flex allm-gap-x-5">
              <span
                className={`allm-font-sans allm-reply allm-whitespace-pre-line allm-font-normal allm-text-sm allm-md:text-sm allm-flex allm-flex-col allm-gap-y-1`}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(reply) }}
              />
            </div>
          </div>
        </div>
        <div
          className={`allm-text-[10px] allm-text-gray-400 allm-ml-[54px] allm-mr-6 allm-mt-2 allm-text-left allm-font-sans`}
        >
          {formatDate(Date.now() / 1000)}
        </div>
      </div>
    );
  }
);

export default memo(PromptReply);
