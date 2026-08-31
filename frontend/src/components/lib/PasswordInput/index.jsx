import { useId, useRef, useState } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";

/**
 * A password input with a hold-to-reveal eye icon pinned to the right edge.
 * Accepts all standard input props. Sizing/positioning of the input should be
 * passed via `containerClassName` when the input is not full-width.
 */
export default function PasswordInput({
  className = "",
  containerClassName = "w-full",
  ...props
}) {
  const tooltipId = useId();
  const inputRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const Icon = revealed ? EyeSlash : Eye;

  // Swapping the input type between password/text resets the caret to the
  // start of the input, so capture the selection and restore it after the
  // swap has rendered.
  const setRevealedKeepCursor = (value) => {
    const input = inputRef.current;
    const start = input?.selectionStart;
    const end = input?.selectionEnd;
    setRevealed(value);
    requestAnimationFrame(() => {
      if (!input || start == null || document.activeElement !== input) return;
      input.setSelectionRange(start, end);
    });
  };
  const show = () => setRevealedKeepCursor(true);
  const hide = () => setRevealedKeepCursor(false);

  return (
    <div className={`relative ${containerClassName}`}>
      <input
        {...props}
        ref={inputRef}
        type={revealed ? "text" : "password"}
        className={`${className} pr-10`}
      />
      <button
        type="button"
        tabIndex={-1}
        aria-label="Hold to show password"
        data-tooltip-id={tooltipId}
        data-tooltip-content="Hold to show password"
        onMouseDown={(e) => {
          e.preventDefault();
          show();
        }}
        onMouseUp={hide}
        onMouseLeave={hide}
        onTouchStart={show}
        onTouchEnd={hide}
        className="absolute right-0 top-0 h-full px-2.5 flex items-center border-none bg-transparent text-white text-opacity-60 light:text-theme-text-secondary hover:text-opacity-100 cursor-pointer"
      >
        <Icon className="h-4 w-4" weight="bold" />
      </button>
      <Tooltip
        id={tooltipId}
        place="top"
        delayShow={300}
        className="tooltip !text-xs z-99"
      />
    </div>
  );
}
