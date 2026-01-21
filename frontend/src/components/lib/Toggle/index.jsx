const TOGGLE_STYLES = {
  sm: "h-[12px] w-[20px] after:h-[8px] after:w-[8px] after:top-[2px] after:left-[2px] peer-checked:after:translate-x-full",
  md: "h-[16px] w-[28px] after:h-[12px] after:w-[12px] after:top-[2px] after:left-[2px] peer-checked:after:translate-x-full",
  lg: "h-[19px] w-[36px] after:h-[15px] after:w-[15px] after:top-[2px] after:left-[2px] peer-checked:after:translate-x-[17px]",
};

export default function Toggle({
  enabled,
  onChange,
  disabled = false,
  size = "sm",
  name,
}) {
  // Support both controlled (enabled + onChange) and uncontrolled (name) modes
  const inputProps =
    enabled !== undefined
      ? { checked: enabled, onChange: (e) => onChange?.(e.target.checked) }
      : { defaultChecked: false };

  return (
    <label
      className={`relative inline-flex items-center ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      <input
        type="checkbox"
        name={name}
        disabled={disabled}
        className="peer sr-only"
        {...inputProps}
      />
      <div
        className={`
          peer pointer-events-none rounded-full
          ${TOGGLE_STYLES[size] || TOGGLE_STYLES.sm}
          after:absolute after:rounded-full after:bg-white
          after:transition-all after:content-['']
          peer-focus:ring-2
          bg-zinc-500 light:bg-zinc-300 peer-focus:ring-zinc-700 light:peer-focus:bg-green-100 light:peer-focus:ring-green-200
          peer-checked:bg-green-400 peer-checked:peer-focus:bg-green-300 peer-checked:peer-focus:ring-green-900 light:peer-checked:peer-focus:bg-green-300 light:peer-checked:peer-focus:ring-green-200
        `}
      />
    </label>
  );
}
