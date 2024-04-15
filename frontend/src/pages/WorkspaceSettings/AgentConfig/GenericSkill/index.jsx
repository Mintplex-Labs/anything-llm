import React from "react";
export default function GenericSkill({
  title,
  description,
  skill,
  toggleSkill,
  enabled = false,
  disabled = false,
}) {
  return (
    <div className="border-b border-white/40 pb-4">
      <div className="flex flex-col">
        <div className="flex w-full justify-between items-center">
          <label htmlFor="name" className="block input-label">
            {title}
          </label>
          <label
            className={`border-none relative inline-flex items-center mt-2 ${
              disabled ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <input
              type="checkbox"
              disabled={disabled}
              className="peer sr-only"
              checked={enabled}
              onClick={() => toggleSkill(skill)}
            />
            <div className="peer-disabled:opacity-50 pointer-events-none peer h-6 w-11 rounded-full bg-stone-400 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border after:border-gray-600 after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-lime-300 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
          </label>
        </div>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          {description}
        </p>
      </div>
    </div>
  );
}
