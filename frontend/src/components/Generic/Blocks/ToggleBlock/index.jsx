import React from "react";
import Badge from "@/components/Generic/Badges/Badge";
import ToggleButton from "@/components/Generic/Inputs/ToggleSwitch";
import TitleBlock from "../TitleBlock";

export default function ToggleBlock({
  content, // toggled content goes here
  initialChecked,
  label,
  onToggle,
  description,
  name,
  badge = false,
  badgeLabel,
  badgeAnimated,
  badgeBg,
  badgeShowDot,
  border,
  bg,
  Icon,
  disabled,
  inline = false,
}) {
  const borderStyle = border ? "border border-gray-600 rounded-2xl p-4" : "";
  const backgroundStyle = bg ? "bg-black/10" : "";

  return (
    <div
      className={`relative w-full max-h-full ${borderStyle} ${backgroundStyle}`}
    >
      <div className="relative rounded-lg">
        <div className="space-y-6 flex h-full w-full">
          <div className="w-full flex flex-col gap-y-4">
            <div className="flex gap-2">
              {Icon && <Icon className="w-16 h-16  text-white/30" />}
              <div>
                <div className="flex flex-row gap-4">
                  {inline && (
                    <div>
                      <ToggleButton
                        initialChecked={initialChecked}
                        onToggle={onToggle}
                        name={name}
                        disabled={disabled}
                      />
                    </div>
                  )}
                  <label className="block input-label mb-1 first-letter:capitalize">
                    {label}
                  </label>
                  {badge && (
                    <Badge
                      showDot={badgeShowDot}
                      animated={badgeAnimated}
                      label={badgeLabel}
                      bg={badgeBg}
                    />
                  )}
                </div>
                {!inline && (
                  <div className="mt-2">
                    <ToggleButton
                      initialChecked={initialChecked}
                      onToggle={onToggle}
                      name={name}
                      disabled={disabled}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between space-x-14">
          <p className="text-white/60 text-xs py-1.5">{description}</p>
        </div>
        {content}
      </div>
    </div>
  );
}
