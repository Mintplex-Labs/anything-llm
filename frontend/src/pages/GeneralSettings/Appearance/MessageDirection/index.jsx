import { useChatMessageAlignment } from "@/hooks/useChatMessageAlignment";
import { Tooltip } from "react-tooltip";
import { useTranslation } from "react-i18next";

export function MessageDirection() {
  const { t } = useTranslation();
  const { msgDirection, setMsgDirection } = useChatMessageAlignment();

  return (
    <div className="flex flex-col gap-y-1 mt-4">
      <h2 className="text-base leading-6 font-bold text-white">
        {t("appearance.align.title")}
      </h2>
      <p className="text-xs leading-[18px] font-base text-white/60">
        {t("appearance.align.description")}
      </p>
      <div className="flex flex-row flex-wrap gap-x-4 pt-1 gap-y-4 md:gap-y-0">
        <ItemDirection
          active={msgDirection === "left"}
          reverse={false}
          msg={t("appearance.align.left_explained")}
          onSelect={() => {
            setMsgDirection("left");
          }}
        />
        <ItemDirection
          active={msgDirection === "left_right"}
          reverse={true}
          msg={t("appearance.align.left_right_explained")}
          onSelect={() => {
            setMsgDirection("left_right");
          }}
        />
      </div>
      <Tooltip
        id="alignment-choice-item"
        place="top"
        delayShow={300}
        className="tooltip !text-xs z-99"
      />
    </div>
  );
}

function ItemDirection({ active, reverse, onSelect, msg }) {
  return (
    <button
      data-tooltip-id="alignment-choice-item"
      data-tooltip-content={msg}
      type="button"
      className={`flex:1 p-4 bg-transparent hover:light:bg-gray-100 hover:bg-gray-700/20 rounded-xl border w-[250px] ${active ? "border-primary-button" : " border-theme-border-sidebar-item"}`}
      onClick={onSelect}
    >
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className={`flex items-center justify-end gap-2 ${reverse && index % 2 === 0 ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-4 h-4 rounded-full ${index % 2 === 0 ? "bg-primary-button" : "bg-white light:bg-black"} flex-shrink-0`}
            />
            <div className="bg-gray-600 light:bg-gray-200 rounded-2xl px-4 py-2 h-[20px] w-full" />
          </div>
        ))}
      </div>
    </button>
  );
}
