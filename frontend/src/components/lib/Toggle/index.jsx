import { Info } from "@phosphor-icons/react";

const TOGGLE_STYLES = {
  sm: "h-[12px] w-[20px] after:h-[8px] after:w-[8px] after:top-[2px] after:left-[2px] peer-checked:after:translate-x-full",
  md: "h-[16px] w-[28px] after:h-[12px] after:w-[12px] after:top-[2px] after:left-[2px] peer-checked:after:translate-x-full",
  lg: "h-[19px] w-[36px] after:h-[15px] after:w-[15px] after:top-[2px] after:left-[2px] peer-checked:after:translate-x-[17px]",
};

const LABEL_STYLES = {
  sm: {
    label: "text-[12px] leading-[10px] font-medium mt-[1.5px]",
    description: "text-[10px] leading-[16px] font-normal",
    gap: "gap-[2px]",
  },
  md: {
    label: "text-[14px] leading-[18px] font-medium -mt-[2px]",
    description: "text-[12px] leading-[16px] font-normal",
    gap: "gap-[2px]",
  },
  lg: {
    label: "text-[16px] leading-[14px] font-medium mt-[2.5px]",
    description: "text-[14px] leading-[24px] font-normal",
    gap: "gap-[2px]",
  },
};

/**
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.enabled] - Controlled checked state
 * @param {(checked: boolean) => void} [props.onChange] - Change handler receiving new checked state
 * @param {boolean} [props.disabled=false] - Whether toggle is disabled
 * @param {"sm" | "md" | "lg"} [props.size="sm"] - Toggle size
 * @param {string} [props.name] - Input name for form submission
 * @param {string} [props.label] - Label text next to toggle
 * @param {string} [props.description] - Description text below label
 * @param {"default" | "horizontal"} [props.variant="default"] - Layout variant
 * @param {string} [props.hint] - Tooltip ID for info icon hint next to label
 * @param {string} [props.value] - Input value for form submission
 */
export default function Toggle({
  className,
  enabled,
  onChange,
  disabled = false,
  size = "sm",
  name,
  label,
  description,
  variant = "default",
  hint,
  value,
}) {
  const inputProps =
    enabled !== undefined
      ? { checked: enabled, onChange: (e) => onChange?.(e.target.checked) }
      : { defaultChecked: false };

  const labelStyles = LABEL_STYLES[size] || LABEL_STYLES.sm;

  if (variant === "horizontal") {
    return (
      <label
        className={`flex items-start justify-between max-w-[700px] ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${className ?? ""}`}
      >
        <TextContent
          label={label}
          description={description}
          labelStyles={labelStyles}
          hint={hint}
        />
        <div className="shrink-0 ml-4">
          <ToggleSwitch
            name={name}
            disabled={disabled}
            size={size}
            inputProps={inputProps}
            value={value}
          />
        </div>
      </label>
    );
  }

  return (
    <label
      className={`inline-flex items-start ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${className ?? ""}`}
    >
      <ToggleSwitch
        name={name}
        disabled={disabled}
        size={size}
        inputProps={inputProps}
        value={value}
      />
      {(label || description) && (
        <div className="ml-3">
          <TextContent
            label={label}
            description={description}
            labelStyles={labelStyles}
            hint={hint}
          />
        </div>
      )}
    </label>
  );
}

function ToggleSwitch({ name, disabled, size, inputProps, value }) {
  return (
    <>
      <input
        type="checkbox"
        name={name}
        disabled={disabled}
        className="peer sr-only"
        value={value}
        {...inputProps}
      />
      <div
        className={`
          relative shrink-0 peer pointer-events-none rounded-full
          ${TOGGLE_STYLES[size] || TOGGLE_STYLES.sm}
          after:absolute after:rounded-full after:bg-white
          after:transition-all after:content-['']
          peer-focus:ring-2
          bg-zinc-500 light:bg-zinc-300 peer-focus:ring-zinc-700 light:peer-focus:bg-green-100 light:peer-focus:ring-green-200
          peer-checked:bg-green-400 peer-checked:peer-focus:bg-green-300 peer-checked:peer-focus:ring-green-900 light:peer-checked:peer-focus:bg-green-300 light:peer-checked:peer-focus:ring-green-200
        `}
      />
    </>
  );
}

function TextContent({ label, description, labelStyles = {}, hint }) {
  if (!label && !description) return null;
  return (
    <div className={`flex flex-col ${labelStyles.gap}`}>
      {label && (
        <span
          className={`flex items-center gap-x-1 text-white light:text-slate-950 ${labelStyles.label}`}
        >
          {label}
          {hint && (
            <Info
              size={14}
              className="text-theme-text-secondary cursor-pointer"
              data-tooltip-id={hint}
            />
          )}
        </span>
      )}
      {description && (
        <span
          className={`text-zinc-400 light:text-zinc-600 ${labelStyles.description}`}
        >
          {description}
        </span>
      )}
    </div>
  );
}
