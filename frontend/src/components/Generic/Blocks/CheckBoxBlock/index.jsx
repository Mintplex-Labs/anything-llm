import React from "react";
import Badge from "@/components/Generic/Badges/Badge";
import CheckBox from "../../Inputs/CheckBox";

/**
 * @description A block that contains a checkbox and its label and description
 * @param {boolean} initialChecked - initial state of the checkbox
 * @param {string} label - label for the checkbox
 * @param {function} onToggle - function to call when the checkbox is toggled
 * @param {string} description - description of the checkbox
 * @param {string} name - name of the checkbox
 * @param {boolean} badge - whether to show a badge
 * @param {string} badgeLabel - label for the badge
 * @param {boolean} badgeAnimated - whether the badge should be animated
 * @param {string} badgeBg - background color for the badge
 * @param {boolean} border - whether to show a border
 * @param {React.Component} Icon - icon to show next to the checkbox
 * @param {string} contentLocation - location of the content
 * @param {boolean} disabled - whether the checkbox is disabled
 * @param {boolean} inline - whether the checkbox should be inline
 */
export default function CheckBoxBlock({
  initialChecked,
  label,
  onToggle,
  description,
  name,
  badge = false,
  badgeLabel,
  badgeAnimated,
  badgeBg,
  border,
  Icon,
  contentLocation,
  disabled,
  inline = false,
}) {
  const borderStyle = border ? "border border-gray-600 rounded-2xl p-4" : "";
  const contentPosition = {
    middle: "middle",
    top: "top",
    bottom: "bottom",
  }[contentLocation];

  return (
    <div className={`relative w-full max-h-full ${borderStyle}`}>
      <div className="relative rounded-lg">
        <div className="space-y-6 flex h-full w-full">
          <div className="w-full flex flex-col gap-y-4">
            <div className="flex gap-4">
              {Icon && (
                <Icon className="w-16 h-16 text-white text-opacity-60" />
              )}
              <div>
                <div className="flex flex-row gap-4">
                  {inline && (
                    <div>
                      <CheckBox
                        initialChecked={initialChecked}
                        onToggle={onToggle}
                        name={name}
                        disabled={disabled}
                      />
                    </div>
                  )}
                  <label className="block  input-label mb-4 first-letter:capitalize">
                    {label}
                  </label>
                  {badge && (
                    <Badge
                      showDot
                      animated={badgeAnimated}
                      label={badgeLabel}
                      bg={badgeBg}
                    />
                  )}
                </div>
                {!inline && (
                  <CheckBox
                    initialChecked={initialChecked}
                    onToggle={onToggle}
                    name={name}
                    disabled={disabled}
                  />
                )}
              </div>
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
