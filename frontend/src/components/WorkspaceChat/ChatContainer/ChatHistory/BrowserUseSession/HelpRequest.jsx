import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  HandPointing,
  PaperPlaneRight,
  CircleNotch,
} from "@phosphor-icons/react";
import { ACK_TIMEOUT_MS } from "./utils";

/**
 * The agent's question, with Take control to help in the live view and a reply box to continue.
 * @param {{session: Object, controlling: boolean, onToggleControl: () => void,
 *   onReply: (text: string) => boolean, onSent?: () => void}} props - onReply: whether it was sent
 */
export default function HelpRequest({
  session,
  controlling,
  onToggleControl,
  onReply,
  onSent,
}) {
  const { t } = useTranslation();
  const [reply, setReply] = useState("");
  // The snapshot the reply was sent against - every session update is a new
  // snapshot, so the "sent" state clears as soon as the agent reacts.
  const [sentFor, setSentFor] = useState(null);
  const sent = sentFor === session;

  // A reply the agent was no longer waiting for gets no update - hand the box back.
  useEffect(() => {
    if (sentFor === null) return;
    const timer = setTimeout(() => setSentFor(null), ACK_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [sentFor]);

  const send = (e) => {
    e?.preventDefault();
    if (sent) return;
    if (!onReply(reply)) return;
    setReply("");
    setSentFor(session);
    onSent?.();
  };

  return (
    <form
      onSubmit={send}
      className="flex flex-col gap-y-2.5 px-3 py-3 bg-amber-500/10 border-t border-amber-500/30"
    >
      <div className="flex items-start justify-between gap-x-3">
        <p className="min-w-0 text-sm text-white light:text-slate-900 whitespace-pre-wrap">
          {session.question}
        </p>
        <TakeControlButton
          controlling={controlling}
          onToggle={onToggleControl}
        />
      </div>
      <div className="flex items-center gap-x-2">
        <input
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          disabled={sent}
          placeholder={
            sent
              ? t("browserUse.card.replySent")
              : t("browserUse.card.replyPlaceholder")
          }
          className="flex-1 min-w-0 h-[32px] px-3 text-sm rounded-lg outline-none border border-zinc-700 bg-zinc-800 text-white light:bg-white light:border-slate-300 light:text-slate-900 focus:border-sky-500 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={sent}
          className="border-none flex items-center gap-x-1 px-3 h-[32px] rounded-lg text-xs font-medium bg-white light:bg-slate-900 text-zinc-900 light:text-white hover:opacity-80 disabled:opacity-50 flex-shrink-0"
        >
          {sent ? (
            <CircleNotch size={14} weight="bold" className="animate-spin" />
          ) : (
            <PaperPlaneRight size={14} weight="bold" />
          )}
          {t("browserUse.card.continue")}
        </button>
      </div>
      <p className="text-[11px] text-zinc-400 light:text-slate-500">
        {t("browserUse.card.signInHint")}
      </p>
    </form>
  );
}

function TakeControlButton({ controlling, onToggle }) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center gap-x-1.5 px-3 h-[30px] rounded-lg text-xs font-medium flex-shrink-0 border border-solid ${controlling ? "bg-amber-400 border-amber-400 text-zinc-900 hover:opacity-80" : "bg-transparent border-amber-500/60 text-amber-200 light:text-amber-700 hover:bg-amber-500/15"}`}
    >
      <HandPointing size={14} weight="bold" />
      {controlling
        ? t("browserUse.card.releaseControl")
        : t("browserUse.card.takeOver")}
    </button>
  );
}
