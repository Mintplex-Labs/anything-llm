import React, { memo, forwardRef } from "react";
import { Warning } from "@phosphor-icons/react";
import Jazzicon from "../../../../UserIcon";
import Actions from "./Actions";
import renderMarkdown from "@/utils/chat/markdown";
import { userFromStorage } from "@/utils/request";
import Citations from "../Citation";
import { AI_BACKGROUND_COLOR, USER_BACKGROUND_COLOR } from "@/utils/constants";
import { v4 } from "uuid";
import createDOMPurify from "dompurify";

const DOMPurify = createDOMPurify(window);
const HistoricalMessage = forwardRef(
  (
    { uuid = v4(), message, role, workspace, sources = [], error = false },
    ref
  ) => {
    return (
      <div
        key={uuid}
        ref={ref}
        className={`flex justify-center items-end w-full ${
          role === "user" ? USER_BACKGROUND_COLOR : AI_BACKGROUND_COLOR
        }`}
      >
        <div
          className={`py-8 px-4 w-full flex gap-x-5 md:max-w-[800px] flex-col`}
        >
          <div className="flex gap-x-5">
            <Jazzicon
              size={36}
              user={{
                uid:
                  role === "user"
                    ? userFromStorage()?.username
                    : workspace.slug,
              }}
              role={role}
            />

            {error ? (
              <span
                className={`inline-block p-2 rounded-lg bg-red-50 text-red-500`}
              >
                <Warning className="h-4 w-4 mb-1 inline-block" /> Could not
                respond to message.
              </span>
            ) : (
              <span
                className={`whitespace-pre-line text-white font-normal text-sm md:text-sm flex flex-col gap-y-1 mt-2`}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(renderMarkdown(message)),
                }}
              />
            )}
          </div>
          {role === "assistant" && (
            <div className="flex gap-x-5">
              <div className="relative w-[35px] h-[35px] rounded-full flex-shrink-0 overflow-hidden" />
              <Actions message={DOMPurify.sanitize(message)} />
            </div>
          )}
          {role === "assistant" && <Citations sources={sources} />}
        </div>
      </div>
    );
  }
);

export default memo(HistoricalMessage);
