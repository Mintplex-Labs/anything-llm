export default function CTAButton({
  children,
  disabled = false,
  onClick,
  className = "",
}) {
  return (
    <button
      disabled={disabled}
      onClick={() => onClick?.()}
      className={`border-none text-xs px-4 py-1 font-semibold text-white rounded-lg bg-primary-button hover:bg-secondary hover:text-white light:hover:text-theme-text-primary h-[34px] whitespace-nowrap w-fit ${className}`}
    >
      <div className="flex items-center justify-center gap-2">{children}</div>
    </button>
  );
}
