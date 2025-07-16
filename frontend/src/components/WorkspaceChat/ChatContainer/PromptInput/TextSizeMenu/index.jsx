import { useState, useRef } from "react";
import { TextT } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";

export default function TextSizeButton() {
  const tooltipRef = useRef(null);
  const { t } = useTranslation();
  const { theme } = useTheme();

  const toggleTooltip = () => {
    if (!tooltipRef.current) return;
    tooltipRef.current.isOpen
      ? tooltipRef.current.close()
      : tooltipRef.current.open();
  };

  return (
    <>
      <div
        id="text-size-btn"
        data-tooltip-id="tooltip-text-size-btn"
        aria-label={t("chat_window.text_size")}
        onClick={toggleTooltip}
        className="border-none flex justify-center items-center opacity-60 hover:opacity-100 light:opacity-100 light:hover:opacity-60 cursor-pointer"
      >
        <TextT
          color="var(--theme-sidebar-footer-icon-fill)"
          weight="fill"
          className="w-[22px] h-[22px] pointer-events-none text-white"
        />
      </div>
      <Tooltip
        ref={tooltipRef}
        id="tooltip-text-size-btn"
        place="top"
        opacity={1}
        clickable={true}
        delayShow={300}
        delayHide={800}
        arrowColor={
          theme === "light"
            ? "var(--theme-modal-border)"
            : "var(--theme-bg-primary)"
        }
        className="z-99 !w-[140px] !bg-theme-bg-primary !px-[5px] !rounded-lg !pointer-events-auto light:border-2 light:border-theme-modal-border"
      >
        <TextSizeMenu tooltipRef={tooltipRef} />
      </Tooltip>
    </>
  );
}

function TextSizeMenu({ tooltipRef }) {
  const { t } = useTranslation();
  const [selectedSize, setSelectedSize] = useState(
    window.localStorage.getItem("anythingllm_text_size") || "normal"
  );

  const handleTextSizeChange = (size) => {
    setSelectedSize(size);
    window.localStorage.setItem("anythingllm_text_size", size);
    window.dispatchEvent(new CustomEvent("textSizeChange", { detail: size }));
    tooltipRef.current?.close();
  };

  return (
    <div className="flex flex-col justify-start items-stretch gap-1 p-2">
      <button
        onClick={(e) => {
          e.preventDefault();
          handleTextSizeChange("small");
        }}
        className={`border-none w-full hover:cursor-pointer px-2 py-2 rounded-md flex items-center group ${
          selectedSize === "small"
            ? "bg-theme-action-menu-item-hover"
            : "hover:bg-theme-action-menu-item-hover"
        }`}
      >
        <div className="text-theme-text-primary text-xs">
          {t("chat_window.small")}
        </div>
      </button>

      <button
        onClick={(e) => {
          e.preventDefault();
          handleTextSizeChange("normal");
        }}
        className={`border-none w-full hover:cursor-pointer px-2 py-2 rounded-md flex items-center group ${
          selectedSize === "normal"
            ? "bg-theme-action-menu-item-hover"
            : "hover:bg-theme-action-menu-item-hover"
        }`}
      >
        <div className="text-theme-text-primary text-sm">
          {t("chat_window.normal")}
        </div>
      </button>

      <button
        onClick={(e) => {
          e.preventDefault();
          handleTextSizeChange("large");
        }}
        className={`border-none w-full hover:cursor-pointer px-2 py-2 rounded-md flex items-center group ${
          selectedSize === "large"
            ? "bg-theme-action-menu-item-hover"
            : "hover:bg-theme-action-menu-item-hover"
        }`}
      >
        <div className="text-theme-text-primary text-[16px]">
          {t("chat_window.large")}
        </div>
      </button>
    </div>
  );
}
