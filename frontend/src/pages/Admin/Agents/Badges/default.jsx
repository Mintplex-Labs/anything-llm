import { Tooltip } from "react-tooltip";

export function DefaultBadge({ title }) {
  return (
    <>
      <span
        className="w-fit"
        data-tooltip-id={`default-skill-${title}`}
        data-tooltip-content="This skill is enabled by default and cannot be turned off."
      >
        <div className="flex items-center gap-x-1 w-fit rounded-full bg-[#F4FFD0]/10 px-2.5 py-0.5 text-sm font-medium text-sky-400 shadow-sm cursor-pointer">
          <div className="text-[#F4FFD0] text-[12px] leading-[15px]">
            Default
          </div>
        </div>
      </span>
      <Tooltip
        id={`default-skill-${title}`}
        place="bottom"
        delayShow={300}
        className="tooltip !text-xs"
      />
    </>
  );
}
