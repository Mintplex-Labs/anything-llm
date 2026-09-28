import { CaretRight, Plus, WarningCircle } from "@phosphor-icons/react";

/**
 * List of markdown skills for the Agent Skills settings page.
 * Each row shows the skill name and description; clicking opens the editor.
 * Broken skills (invalid frontmatter, missing SKILL.md, or a name that does
 * not match its folder) are listed with a warning and, where possible, a
 * one-click rename fix.
 */
export default function MarkdownSkillList({
  skills = [],
  brokenSkills = [],
  detection = null,
  selectedSkill,
  handleClick,
  onNewSkill,
  onRenameFix,
}) {
  // Only surface a notice when detection degraded: the reranker was
  // unavailable, so the first N skills were injected instead of the most
  // relevant ones.
  const showDetection = Boolean(
    detection && detection.mode === "fallback" && detection.count > 0
  );
  return (
    <div className="bg-theme-bg-secondary text-white rounded-xl w-full md:min-w-[360px] overflow-hidden">
      {showDetection && (
        <div
          className="py-3 px-4 flex items-start gap-x-2 rounded-t-xl border-b border-white/10 bg-amber-400/10 text-amber-300/90"
          title="Status of the most recent skill detection. Updated after each chat."
        >
          <WarningCircle
            size={16}
            className="flex-none mt-0.5 text-amber-400"
          />
          <span className="text-xs leading-snug">
            {`Top ${detection.count} of ${skills.length} skills shown — reranker unavailable (${detection.reason}).`}
          </span>
        </div>
      )}
      {skills.map((skill, index) => (
        <div
          key={skill.name}
          className={`py-3 px-4 flex items-center justify-between gap-x-3 ${
            index === 0 && !showDetection ? "rounded-t-xl" : ""
          } ${
            index === skills.length - 1 && !onNewSkill ? "rounded-b-xl" : ""
          } ${index !== 0 ? "border-t border-white/10" : ""} cursor-pointer transition-all duration-300 hover:bg-theme-bg-primary ${
            selectedSkill?.name === skill.name
              ? "bg-white/10 light:bg-theme-bg-sidebar"
              : ""
          }`}
          onClick={() => handleClick?.(skill)}
          title={skill.description}
        >
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">{skill.name}</div>
            {skill.description && (
              <div className="text-xs text-theme-text-secondary truncate">
                {skill.description}
              </div>
            )}
          </div>
          <CaretRight
            size={14}
            weight="bold"
            className="text-theme-text-secondary flex-none"
          />
        </div>
      ))}
      {brokenSkills.map((broken) => {
        // A name/folder mismatch can be fixed by renaming the folder to the
        // frontmatter name; anything else is just reported.
        const isMismatch = /does not match its folder/.test(broken.error || "");
        const frontmatterName = isMismatch
          ? (broken.error.match(/Name "([^"]+)"/) || [])[1]
          : null;
        return (
          <div
            key={`broken-${broken.dir}`}
            className="py-3 px-4 flex items-center justify-between gap-x-3 border-t border-white/10"
          >
            <div className="min-w-0 flex items-center gap-x-2">
              <WarningCircle size={16} className="text-amber-400 flex-none" />
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">
                  {frontmatterName || broken.dir}
                </div>
                <div className="text-xs text-amber-400/80 truncate">
                  {broken.error}
                </div>
              </div>
            </div>
            {isMismatch && frontmatterName && (
              <button
                type="button"
                className="text-xs text-cta-button hover:underline flex-none"
                onClick={() => onRenameFix?.(broken.dir, frontmatterName)}
              >
                Rename folder
              </button>
            )}
          </div>
        );
      })}
      {skills.length === 0 && brokenSkills.length === 0 && (
        <div className="py-6 px-4 text-center">
          <p className="text-theme-text-secondary text-xs">
            No markdown skills yet.
          </p>
        </div>
      )}
      {onNewSkill && (
        <div
          className="py-3 px-4 flex items-center gap-x-2 cursor-pointer transition-all duration-300 hover:bg-theme-bg-primary border-t border-white/10 rounded-b-xl"
          onClick={onNewSkill}
        >
          <Plus size={16} weight="bold" />
          <span className="text-sm text-cta-button">New Skill</span>
        </div>
      )}
    </div>
  );
}
