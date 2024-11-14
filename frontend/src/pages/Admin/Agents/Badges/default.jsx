export function DefaultBadge({ title }) {
  return (
    <>
      <span
        className="w-fit"
        data-tooltip-id="default-skill"
        data-tooltip-content="This skill is enabled by default and cannot be turned off."
      >
        <div className="flex items-center gap-x-1 w-fit rounded-full bg-[#F4FFD0]/10 light:bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-sky-400 light:text-theme-text-secondary shadow-sm cursor-pointer">
          <div className="text-[#F4FFD0] light:text-blue-600 text-[12px] leading-[15px]">
            Default
          </div>
        </div>
      </span>
    </>
  );
}
