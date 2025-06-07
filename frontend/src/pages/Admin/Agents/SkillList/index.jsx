import { CaretRight } from "@phosphor-icons/react";
import { isMobile } from "react-device-detect";

export default function SkillList({
  skills = [],
  selectedSkill = null,
  handleClick = null,
  activeSkills = [],
  toggleSkill = () => {},
}) {
  if (skills.length === 0) return null;

  return (
    <div
      className={`bg-theme-bg-secondary text-white rounded-xl ${isMobile ? "w-full" : "min-w-[360px] w-fit"}`}
    >
      {Object.entries(skills).map(([skill, settings]) => (
        <div
          key={skill}
          onClick={() => handleClick?.(skill)}
          className={`
              relative
              cursor-pointer
              transition-all duration-300
              after:content-['']
              after:absolute
              after:bottom-0
              after:left-4
              after:right-4
              after:h-[1px]
              after:bg-theme-action-menu-bg
              last:after:hidden
              first:rounded-t-xl
              last:rounded-b-xl
              ${selectedSkill === skill ? "bg-white/10 light:bg-theme-bg-sidebar" : "hover:bg-theme-bg-primary"}
            `}
        >
          <div className="flex items-center justify-between h-[36px] px-4">
            <div className="text-sm font-medium">{settings.title}</div>
            <div className="flex items-center gap-x-2">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSkill(skill);
                }}
                className="relative inline-flex h-4 w-7 items-center rounded-full transition-colors duration-300"
                style={{
                  backgroundColor: activeSkills.includes(skill)
                    ? "#32D583"
                    : "#CFCFD0",
                }}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 ${
                    activeSkills.includes(skill)
                      ? "translate-x-[14px]"
                      : "translate-x-[2px]"
                  }`}
                />
              </div>
              <CaretRight
                size={14}
                weight="bold"
                className="text-theme-text-secondary"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
