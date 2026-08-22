import { useTranslation } from "react-i18next";
import { SimpleToggleSwitch } from "@/components/lib/Toggle";
import {
  getDefaultSkills,
  getConfigurableSkills,
  getAppIntegrationSkills,
} from "@/pages/Admin/Agents/skills";
import useAgentSkillsState from "@/components/WorkspaceChat/ChatContainer/PromptInput/ToolsMenu/Tabs/AgentSkills/useAgentSkillsState";
import useSkillSections from "@/components/WorkspaceChat/ChatContainer/PromptInput/ToolsMenu/Tabs/AgentSkills/useSkillSections";

const SKELETON_ROWS = 8;

/**
 * Per-workspace agent skill toggles. Anything left untouched follows the
 * instance-wide skills configured under Admin > Agent Skills.
 * @param {object} props
 * @param {object} props.workspace
 */
export default function WorkspaceAgentSkills({ workspace }) {
  const { t } = useTranslation();
  const defaultSkills = getDefaultSkills(t);
  const appIntegrationSkills = getAppIntegrationSkills(t);
  const {
    fileSystemAgentAvailable,
    importedSkills,
    flows,
    mcpServers,
    loading,
    hasOverrides,
    instanceSkillEnabled,
    skillState,
    resetOverrides,
    isMultiUser,
    isSubSkillEnabled,
  } = useAgentSkillsState(defaultSkills, workspace);

  const sections = useSkillSections({
    t,
    defaultSkills,
    configurableSkills: getConfigurableSkills(t, { fileSystemAgentAvailable }),
    appIntegrationSkills,
    importedSkills,
    flows,
    mcpServers,
    isMultiUser,
    instanceSkillEnabled,
    skillState,
    isSubSkillEnabled,
  });

  if (loading)
    return (
      <div className="flex flex-col gap-y-4">
        <Header t={t} />
        <div className="flex flex-col gap-y-2">
          {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
            <div
              key={i}
              className="h-[30px] rounded bg-white/10 light:bg-slate-200 animate-pulse"
            />
          ))}
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-start justify-between gap-x-4">
        <Header t={t} />
        {hasOverrides && (
          <button
            type="button"
            onClick={resetOverrides}
            className="border-none bg-transparent shrink-0 cursor-pointer text-xs text-white text-opacity-60 hover:text-opacity-100"
          >
            {t("chat_window.reset_workspace_skills")}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-y-5">
        {sections.map((section) => (
          <div key={section.id} className="flex flex-col gap-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white text-opacity-40">
              {section.name}
            </p>
            {section.items.map((item) => (
              <div key={item.id}>
                <SkillToggle
                  name={item.name}
                  enabled={item.enabled}
                  onToggle={item.onToggle}
                />
                {item.enabled &&
                  item.subSkills?.map((subItem) => (
                    <SkillToggle
                      key={subItem.id}
                      name={subItem.name}
                      enabled={subItem.enabled}
                      onToggle={subItem.onToggle}
                      indented
                    />
                  ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Header({ t }) {
  return (
    <div className="flex flex-col gap-y-1">
      <p className="text-white text-sm font-semibold">
        {t("chat_window.agent_skills")}
      </p>
      <p className="text-white text-opacity-60 text-xs font-medium">
        {t("chat_window.workspace_agent_skills_description")}
      </p>
    </div>
  );
}

function SkillToggle({ name, enabled, onToggle, indented = false }) {
  return (
    <div
      className={`flex items-center justify-between gap-x-4 py-1.5 ${indented ? "pl-4" : ""}`}
    >
      <span className="text-white text-sm">{name}</span>
      <SimpleToggleSwitch size="md" enabled={enabled} onChange={onToggle} />
    </div>
  );
}
