import React, { memo, forwardRef } from "react";
import { Warning } from "@phosphor-icons/react";
// import Actions from "./Actions";
import renderMarkdown from "@/utils/chat/markdown";
import { embedderSettings } from "@/main";
import { v4 } from "uuid";
import createDOMPurify from "dompurify";

const DOMPurify = createDOMPurify(window);
const HistoricalMessage = forwardRef(
  ({ uuid = v4(), message, role, sources = [], error = false }, ref) => {
    return (
      <div
        key={uuid}
        ref={ref}
        className={`flex rounded-lg justify-center items-end w-full h-fit ${
          error
            ? "bg-red-200"
            : role === "user"
              ? embedderSettings.USER_BACKGROUND_COLOR
              : embedderSettings.AI_BACKGROUND_COLOR
        }`}
      >
        <div
          style={{ wordBreak: "break-word" }}
          className={`py-2 px-2 w-full flex flex-col`}
        >
          <div className="flex">
            {error ? (
              <div className="p-2 rounded-lg bg-red-50 text-red-500">
                <span className={`inline-block `}>
                  <Warning className="h-4 w-4 mb-1 inline-block" /> Could not
                  respond to message.
                </span>
                <p className="text-xs font-mono mt-2 border-l-2 border-red-500 pl-2 bg-red-300 p-2 rounded-sm">
                  {error}
                </p>
              </div>
            ) : (
              <span
                className={`whitespace-pre-line text-white font-normal text-sm md:text-sm flex flex-col gap-y-1 mt-2`}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(renderMarkdown(message)),
                }}
              />
            )}
          </div>
          {/* {role === "assistant" && !error && (
            <div className="flex gap-x-5">
              <div className="relative w-[35px] h-[35px] rounded-full flex-shrink-0 overflow-hidden" />
              <Actions message={DOMPurify.sanitize(message)} />
            </div>
          )} */}
        </div>
      </div>
    );
  }
);

export default memo(HistoricalMessage);
