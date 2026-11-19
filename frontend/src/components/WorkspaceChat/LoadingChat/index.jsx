import { useEffect, useState } from "react";
import { CircleNotch } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { isMobile } from "react-device-detect";
import { SidebarMobileHeader } from "@/components/Sidebar";

const MESSAGE_COUNT = 3;
const ROTATE_MS = 3000;

export default function LoadingChat() {
  const { t } = useTranslation();
  const messages = [
    t("chat_window.loading_chat_history"),
    t("chat_window.loading_chat_recalling"),
    t("chat_window.loading_chat_remembering"),
  ];
  // Start on a random message so repeat loads don't always read the same,
  // then rotate through the rest while loading continues.
  const [index, setIndex] = useState(() =>
    Math.floor(Math.random() * MESSAGE_COUNT)
  );

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % MESSAGE_COUNT),
      ROTATE_MS
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="transition-all duration-500 relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-zinc-900 light:bg-white w-full h-full flex items-center justify-center"
      style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
    >
      {isMobile && <SidebarMobileHeader />}
      <div
        role="status"
        className="animate-fade-in flex items-center gap-x-2 text-sm text-zinc-400 light:text-slate-500"
      >
        <CircleNotch size={18} weight="bold" className="animate-spin" />
        {/* Screen readers hear one fixed message, not every rotation. */}
        <span className="sr-only">{messages[0]}</span>
        <span key={index} aria-hidden="true" className="animate-fade-in">
          {messages[index]}
        </span>
      </div>
    </div>
  );
}
