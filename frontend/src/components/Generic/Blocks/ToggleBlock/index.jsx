import React from "react";
import ToggleButton from "../../Buttons/ToggleButton";
import Badge from "../../Badges/Badge";

// ToggleBlock: A component that includes a ToggleButton with additional context
export default function ToggleBlock({
  initialChecked,
  label,
  onToggle,
  description,
  name,
}) {
  return (
    <div className="relative w-full max-h-full">
      <div className="relative rounded-lg">
        <div className="flex items-start justify-between px-6 py-4"></div>
        <div className="space-y-6 flex h-full w-full">
          <div className="w-full flex flex-col gap-y-4">
            <div>
              <div className="flex flex-row gap-3" >
                <label className="block input-label mb-4">{label}</label>
                <Badge showDot animated /> 
              </div>
              <ToggleButton
                initialChecked={initialChecked}
                onToggle={onToggle}
                name={name}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between space-x-14">
          <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
