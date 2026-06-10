import React, { forwardRef, useRef } from "react";

// Matches a ${variableName} reference, e.g. ${userId} or ${data.user.name}.
const VARIABLE_PATTERN = "\\$\\{[^}]+\\}";

// The highlight box drawn around a ${variable}. A 30% tint (composited over
// whatever is behind it) instead of a solid fill, so the text stays readable
// against both the light and dark themes. sky-300 matches the cta blue but,
// being a standard palette color, supports the /30 opacity modifier (the
// var-based theme colors don't). Shared with the "Variables" hint chips so the
// two always look the same.
export const VARIABLE_HIGHLIGHT_CLASS = "rounded-[3px] bg-sky-300/30";

// Shared text metrics so the backdrop and the real field line up exactly.
const FIELD_TEXT = "block w-full p-2.5 text-sm";

/**
 * A text input / textarea that live-highlights ${variable} references the same
 * way system prompt variables are highlighted, so it's obvious which parts of
 * the field will be swapped for a flow variable at runtime.
 *
 * How it works: a read-only "backdrop" sits behind a transparent-background
 * field. The backdrop renders the same text but draws a colored box around any
 * ${...} token. The real field renders on top, so the visible characters line
 * up over the highlight boxes while the field stays fully editable.
 *
 * The ref is forwarded to the underlying input/textarea so callers (like the
 * API Call block's "insert variable" button) can read/set the cursor position.
 */
const VariableInput = forwardRef(function VariableInput(
  {
    value = "",
    onChange,
    multiline = false,
    mono = false,
    className = "",
    ...props
  },
  ref
) {
  const backdropRef = useRef(null);

  // Keep the highlight backdrop scrolled in lockstep with the field so the
  // boxes stay aligned once the text overflows the visible area.
  const handleScroll = (e) => {
    if (!backdropRef.current) return;
    backdropRef.current.scrollTop = e.target.scrollTop;
    backdropRef.current.scrollLeft = e.target.scrollLeft;
  };

  const fontClass = mono ? "font-mono" : "";
  const wrapClass = multiline
    ? "whitespace-pre-wrap break-words"
    : "whitespace-pre";

  // input and textarea behave identically here except for the tag, the resize
  // handle, and the text type, so render whichever one through a single path.
  const Field = multiline ? "textarea" : "input";

  return (
    <div
      className={`relative w-full rounded-lg bg-theme-settings-input-bg ${className}`}
    >
      <div
        ref={backdropRef}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 overflow-hidden rounded-lg text-transparent ${wrapClass} ${FIELD_TEXT} ${fontClass}`}
      >
        {renderHighlightedParts(value)}
      </div>

      <Field
        ref={ref}
        type={multiline ? undefined : "text"}
        value={value}
        onChange={onChange}
        onScroll={handleScroll}
        autoComplete="off"
        spellCheck={false}
        className={`relative bg-transparent text-theme-text-primary placeholder:text-theme-settings-input-placeholder rounded-lg outline-none focus:outline-primary-button active:outline-primary-button ${
          multiline ? "resize-y" : ""
        } ${FIELD_TEXT} ${fontClass}`}
        {...props}
      />
    </div>
  );
});

// Split the value into plain text and ${...} tokens, wrapping each token in a
// highlight box. The token text itself stays transparent (inherited from the
// backdrop) so only the colored box shows through behind the real field text.
function renderHighlightedParts(value) {
  if (!value) return null;

  // The capturing group keeps the matched ${...} tokens in the split result.
  const parts = value.split(new RegExp(`(${VARIABLE_PATTERN})`, "g"));
  const isVariable = new RegExp(`^${VARIABLE_PATTERN}$`);
  return parts.map((part, index) => {
    if (!isVariable.test(part))
      return <React.Fragment key={index}>{part}</React.Fragment>;

    return (
      <span key={index} className={VARIABLE_HIGHLIGHT_CLASS}>
        {part}
      </span>
    );
  });
}

export default VariableInput;
