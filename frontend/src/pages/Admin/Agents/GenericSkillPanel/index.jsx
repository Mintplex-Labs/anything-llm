import React from "react";

export default function GenericSkillPanel({
  title,
  description,
  skill,
  toggleSkill,
  enabled = false,
  disabled = false,
  image,
  icon,
}) {
  return (
    <div className="p-2">
      <div className="flex flex-col gap-y-[18px] max-w-[500px]">
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
          <label
            className={`border-none relative inline-flex items-center ml-auto ${
              disabled ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <input
              type="checkbox"
              disabled={disabled}
              className="peer sr-only"
              checked={enabled}
              onChange={() => toggleSkill(skill)}
            />
            <div className="peer-disabled:opacity-50 pointer-events-none peer h-6 w-11 rounded-full bg-[#CFCFD0] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border-none after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-[#32D583] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-transparent"></div>
            <span className="ml-3 text-sm font-medium"></span>
          </label>
        </div>
        <img src={image} alt={title} className="w-full rounded-md" />
        <p className="text-theme-text-secondary text-opacity-60 text-xs font-medium py-1.5">
          {description}
        </p>
      </div>
    </div>
  );
}
