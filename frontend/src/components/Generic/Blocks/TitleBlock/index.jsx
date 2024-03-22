import Badge from "@/components/Generic/Badges/Badge";
import React from "react";

export default function TitleBlock({
  content, // toggle content goes here
  label,
  description,
  badge = false,
  badgeLabel,
  badgeAnimated,
  badgeBg,
  border,
  bg,
  Icon,
  labelStyles,
  divider,
}) {
  const borderStyle = border ? "border border-gray-600 rounded-2xl p-4" : "";
  const backgroundStyle = bg ? "bg-black/10" : "";
  const dividerStyle = divider
    ? "pb-4 mb-8 border-white/10 border-b-2"
    : "pb-2";

  return (
    <div
      className={`relative w-full max-h-full flex flex-col gap-y-1  ${dividerStyle}  ${borderStyle} ${backgroundStyle}`}
    >
      <div className="relative rounded-lg ">
        <div className="space-y-6 flex h-full w-full">
          <div className="w-full flex flex-col gap-y-4">
            <div className={`flex ${Icon ? "gap-4" : ""}`}>
              {Icon && <Icon className="w-9 h-9  text-white/30" />}
              <div>
                <div className="flex flex-row gap-4">
                  {label && (
                    <label
                      className={`block ${
                        labelStyles ? labelStyles : "input-label"
                      }  mb-2.5 first-letter:capitalize `}
                    >
                      {label}
                    </label>
                  )}
                  {badge && (
                    <Badge
                      showDot
                      animated={badgeAnimated}
                      label={badgeLabel}
                      bg={badgeBg}
                    />
                  )}
                </div>
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
