import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe, CircleNotch } from "@phosphor-icons/react";
import BrowserUse from "@/models/browserUse";

// Throttle for mouse moves; still enough for a drag to follow.
const MOVE_INTERVAL_MS = 50;

/**
 * The live picture of the browser. While in control, mouse, scroll and keys are forwarded, with
 * positions as fractions of the view so the card's size never matters.
 * @param {{frameSrc: string|null, starting?: boolean, controlling: boolean, onInput: (input: Object) => void}} props
 *   starting: the browser has no page yet - its frames are only the blank start page
 */
export default function LiveView({
  frameSrc,
  starting = false,
  controlling,
  onInput,
}) {
  const { t } = useTranslation();
  const ref = useRef(null);
  const pressed = useRef(false);
  const lastMoveAt = useRef(0);
  useEffect(() => {
    if (controlling) ref.current?.focus();
    // Handing control back mid-press must not leave the browser's button held down.
    else if (pressed.current) {
      pressed.current = false;
      onInput({ type: "up" });
    }
  }, [controlling]);

  const at = (e) => {
    const box = ref.current.getBoundingClientRect();
    return {
      x: (e.clientX - box.left) / box.width,
      y: (e.clientY - box.top) / box.height,
    };
  };
  const release = (e) => {
    if (!pressed.current) return;
    pressed.current = false;
    onInput({ type: "up", ...at(e) });
  };
  const handlers = controlling
    ? {
        onPointerDown: (e) => {
          if (e.button !== 0) return;
          e.preventDefault();
          ref.current.focus();
          // Keeps the release coming here even if the pointer leaves the view while held.
          e.currentTarget.setPointerCapture(e.pointerId);
          pressed.current = true;
          onInput({ type: "down", ...at(e) });
        },
        onPointerMove: (e) => {
          const now = Date.now();
          if (now - lastMoveAt.current < MOVE_INTERVAL_MS) return;
          lastMoveAt.current = now;
          onInput({ type: "move", ...at(e) });
        },
        onPointerUp: release,
        onPointerCancel: release,
        onWheel: (e) => onInput({ type: "scroll", ...at(e), deltaY: e.deltaY }),
        onKeyDown: (e) => {
          e.preventDefault();
          const shortcut = e.ctrlKey || e.metaKey || e.altKey;
          if (e.key.length === 1 && !shortcut)
            return onInput({ type: "text", text: e.key });
          onInput({ type: "key", key: keyCombo(e) });
        },
        onPaste: (e) => {
          e.preventDefault();
          const text = e.clipboardData.getData("text");
          if (text) onInput({ type: "text", text });
        },
      }
    : {};

  return (
    <div
      ref={ref}
      tabIndex={controlling ? 0 : -1}
      {...handlers}
      className={`relative w-full aspect-[16/10] bg-zinc-950 light:bg-slate-200 outline-none ${controlling ? "cursor-pointer touch-none select-none ring-2 ring-inset ring-amber-400" : ""}`}
    >
      {/* object-fill: clicks go back as fractions of the view, so the picture must cover it exactly. */}
      {starting ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-y-3">
          <CircleNotch
            size={28}
            weight="bold"
            className="text-zinc-400 light:text-slate-500 animate-spin"
          />
          <p className="text-sm text-zinc-400 light:text-slate-500">
            {t("browserUse.card.starting")}
          </p>
        </div>
      ) : frameSrc ? (
        <img
          src={frameSrc}
          alt=""
          draggable={false}
          className="w-full h-full object-fill select-none"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Globe size={40} className="text-zinc-600 animate-pulse" />
        </div>
      )}
      {controlling && (
        <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-black/75 text-white text-xs whitespace-nowrap">
          {t("browserUse.card.controlHint")}
        </div>
      )}
    </div>
  );
}

/**
 * The latest frame (base64 jpeg) of a running session. Frames are only streamed while a card
 * watches, so this registers as a watcher while mounted.
 */
export function useLiveFrame(sessionId, websocket) {
  // Tagged with its session so a frame never outlives a change of sessionId.
  const [latest, setLatest] = useState({ sessionId: null, frame: null });
  useEffect(
    () =>
      BrowserUse.watchLive(sessionId, websocket, (frame) =>
        setLatest({ sessionId, frame })
      ),
    [sessionId, websocket]
  );
  return latest.sessionId === sessionId ? latest.frame : null;
}

/** "Control+Shift+K" style name for a key event, as the browser's press_key understands it. */
function keyCombo(e) {
  const key = e.key === " " ? "Space" : e.key;
  if (["Control", "Shift", "Alt", "Meta"].includes(key)) return key;
  return [
    e.ctrlKey && "Control",
    e.altKey && "Alt",
    e.shiftKey && key.length > 1 && "Shift",
    e.metaKey && "Meta",
    key,
  ]
    .filter(Boolean)
    .join("+");
}
