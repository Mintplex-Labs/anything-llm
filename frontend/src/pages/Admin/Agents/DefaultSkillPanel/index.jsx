import React from "react";
import { DefaultBadge } from "../Badges/default";

export default function DefaultSkillPanel({ title, description, image, icon }) {
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
                fill: '#000',
              })}
            <label
              htmlFor="name"
              className="text-theme-text-primary text-md font-bold custom-text-secondary"
            >
              {title}
            </label>
            <DefaultBadge title={title} />
          </div>
        </div>
        <img src={image} alt={title} className="w-full rounded-md" />
        <p className="text-theme-text-secondary text-opacity-60 text-xs font-medium py-1.5 custom-text-secondary">
          {description}
        </p>
      </div>
    </div>
  );
}
