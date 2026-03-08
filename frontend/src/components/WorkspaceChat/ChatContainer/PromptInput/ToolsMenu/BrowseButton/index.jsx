import { SquaresFour } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

/**
 * @param {string} props.link - route to navigate to
 */
export default function BrowseButton({ link }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(link)}
      className="flex items-center gap-1.5 px-2 h-6 rounded cursor-pointer hover:bg-zinc-700/50 light:hover:bg-slate-100"
    >
      <SquaresFour size={12} className="text-white light:text-slate-900" />
      <span className="text-xs text-white light:text-slate-900">
        {t("chat_window.browse")}
      </span>
    </div>
  );
}
