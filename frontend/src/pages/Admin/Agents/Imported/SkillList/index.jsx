import { CaretRight } from "@phosphor-icons/react";
import { sentenceCase } from "text-case";

export default function ImportedSkillList({
  skills = [],
  selectedSkill = null,
  handleClick = null,
}) {
  if (skills.length === 0)
    return (
      <div className="text-theme-text-secondary text-center text-xs flex flex-col gap-y-2">
        <p>No imported skills found</p>
        <p>
          Learn about agent skills in the{" "}
          <a
            href="https://docs.anythingllm.com/agent/custom/developer-guide"
            target="_blank"
            rel="noreferrer"
            className="text-theme-text-secondary underline hover:text-cta-button"
          >
            AnythingLLM Agent Docs
          </a>
          .
        </p>
      </div>
    );

  return (
    <div className="bg-theme-bg-secondary text-white rounded-xl w-full md:min-w-[360px]">
      {skills.map((config) => (
        <div
          key={config.hubId}
          onClick={() => handleClick?.({ ...config, imported: true })}
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
            ${selectedSkill?.hubId === config.hubId ? "bg-white/10 light:bg-theme-bg-sidebar" : "hover:bg-theme-bg-primary"}
          `}
        >
          <div className="flex items-center justify-between h-[36px] px-4">
            <div className="text-sm font-medium">
              {sentenceCase(config.name)}
            </div>
            <div className="flex items-center gap-x-2">
              <div className="text-sm text-theme-text-secondary font-medium">
                {config.active ? "On" : "Off"}
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
