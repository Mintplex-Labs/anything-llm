import { useState } from "react";
import { CaretRight } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

function getTextSizes(t) {
  return [
    { key: "small", label: t("chat_window.small") },
    { key: "normal", label: t("chat_window.normal") },
    { key: "large", label: t("chat_window.large") },
  ];
}

export default function TextSizeRow() {
  const { t } = useTranslation();
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [selectedSize, setSelectedSize] = useState(
    window.localStorage.getItem("anythingllm_text_size") || "normal"
  );

  function handleTextSizeChange(size) {
    setSelectedSize(size);
    window.localStorage.setItem("anythingllm_text_size", size);
    window.dispatchEvent(new CustomEvent("textSizeChange", { detail: size }));
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowSubmenu(true)}
      onMouseLeave={() => setShowSubmenu(false)}
    >
      <div
        className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer ${
          showSubmenu
            ? "bg-zinc-700 light:bg-slate-200"
            : "hover:bg-zinc-700 light:hover:bg-slate-200"
        }`}
      >
        <span className="text-sm font-normal text-zinc-50 light:text-slate-800">
          {t("chat_window.text_size_label")}
        </span>
        <CaretRight
          size={14}
          weight="bold"
          className="text-zinc-50 light:text-slate-800"
        />
      </div>
      {showSubmenu && (
        <TextSizeSubmenu
          selectedSize={selectedSize}
          onSizeChange={handleTextSizeChange}
        />
      )}
    </div>
  );
}

function TextSizeSubmenu({ selectedSize, onSizeChange }) {
  const { t } = useTranslation();
  const textSizes = getTextSizes(t);

  return (
    <div className="absolute right-full top-0 -mr-2 pr-2 pt-0">
      <div className="bg-zinc-800 light:bg-slate-50 border border-zinc-700 light:border-slate-300 rounded-lg p-3.5 w-[98px] flex flex-col gap-1.5 shadow-lg">
        {textSizes.map(({ key, label }) => (
          <div
            key={key}
            onClick={() => onSizeChange(key)}
            className={`px-2 py-1 rounded cursor-pointer text-sm font-normal text-white light:text-slate-800 ${
              selectedSize === key
                ? "bg-zinc-700 light:bg-slate-200"
                : "hover:bg-zinc-700/50 light:hover:bg-slate-100"
            }`}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
