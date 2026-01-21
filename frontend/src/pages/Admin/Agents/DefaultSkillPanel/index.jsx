import React from "react";
import { DefaultBadge } from "../Badges/default";
import Toggle from "@/components/lib/Toggle";

export default function DefaultSkillPanel({
  title,
  description,
  image,
  icon,
  enabled = true,
  toggleSkill,
  skill,
}) {
  return (
    <div className="p-2">
      <div className="flex flex-col gap-y-[18px] max-w-[500px]">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-x-2">
            {icon &&
              React.createElement(icon, {
                size: 24,
                color: "var(--theme-text-primary)",
                weight: "bold",
              })}
            <label
              htmlFor="name"
              className="text-theme-text-primary text-md font-bold"
            >
              {title}
            </label>
            <DefaultBadge title={title} />
          </div>
          <Toggle
            size="lg"
            enabled={enabled}
            onChange={() => toggleSkill(skill)}
          />
        </div>
        <img src={image} alt={title} className="w-full rounded-md" />
        <p className="text-theme-text-secondary text-opacity-60 text-xs font-medium py-1.5">
          {description}
          <br />
          <br />
          By default, this skill is enabled, but you can disable it if you don't
          want it to be available to the agent.
        </p>
      </div>
    </div>
  );
}
