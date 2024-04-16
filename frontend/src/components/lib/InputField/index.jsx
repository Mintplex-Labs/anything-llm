export default function InputField({
  label,
  description,
  type = "text",
  className = "",
  labelClassName = "",
  descriptionClassName = "",
  inputClassName = "",
  ...props
}) {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label
          className={`text-white text-sm font-semibold block mb-4 ${labelClassName}`}
        >
          {label}
        </label>
      )}
      {description && (
        <p className={`text-xs text-white/60 mb-4 ${descriptionClassName}`}>
          {description}
        </p>
      )}
      <input
        type={type}
        className={`bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5 ${inputClassName}`}
        {...props}
      />
    </div>
  );
}
