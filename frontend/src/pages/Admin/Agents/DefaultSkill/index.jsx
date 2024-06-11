import { Info } from "@phosphor-icons/react";
import React from "react";
import { Tooltip } from "react-tooltip";

export default function DefaultSkill({ title, description, image, icon }) {
  return (
    <div className="p-2">
      <div className="flex flex-col gap-y-[18px] max-w-[500px]">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-x-2">
            {icon &&
              React.createElement(icon, {
                size: 24,
                color: "white",
                weight: "bold",
              })}
            <label htmlFor="name" className="text-white text-md font-bold">
              {title}
            </label>
          </div>
        </div>
        <img src={image} alt={title} className="w-full rounded-md" />
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          {description}
        </p>
        <span
          className="flex items-center gap-x-1 w-fit rounded-full bg-sky-600/20 px-2 py-0.5 text-sm font-medium text-sky-400 shadow-sm cursor-pointer"
          data-tooltip-id={`default-skill-${title}`}
          data-tooltip-content="This skill is enabled by default and cannot be turned off."
        >
          <div>Default Skill</div>
          <Info className="inline-block h-4 w-4 text-sky-400" weight="bold" />
        </span>
        <Tooltip
          id={`default-skill-${title}`}
          place="bottom"
          delayShow={300}
          className="tooltip !text-xs"
        />
      </div>
    </div>
  );
}
