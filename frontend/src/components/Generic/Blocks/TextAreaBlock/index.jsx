import TextArea from "../../Inputs/TextArea";

export default function TextAreaBlock({
  label,
  description,
  defaultValue,
  required,
  placeholder,
  onChange,
  name,
  disabled,
  initialRows,
  className,
  autoComplete,
  wrap,
  code,
  onSave,
  value,
}) {
  return (
    <div>
      <div className="flex flex-col">
        {label && (
          <label htmlFor="name" className="block input-label">
            {label}
          </label>
        )}
        {description && (
          <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
            {description}
          </p>
        )}
      </div>
      <TextArea
        defaultValue={defaultValue}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={onChange}
        name={name}
        disabled={disabled}
        initialRows={initialRows}
        className={className}
        autoComplete={autoComplete}
        wrap={wrap}
        code={code}
        onSave={onSave}
      />
    </div>
  );
}
