import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import Toggle, { SimpleToggleSwitch } from "@/components/lib/Toggle";
import { Trans, useTranslation } from "react-i18next";
import debounce from "lodash.debounce";
import {
  MagnifyingGlass,
  CircleNotch,
  Warning,
  CaretDown,
  CheckCircle,
  Info,
} from "@phosphor-icons/react";
import GMailIcon from "./gmail.png";
import Admin from "@/models/admin";
import System from "@/models/system";
import GoogleAgentSkills from "@/models/googleAgentSkills";
import { getGmailSkills, filterSkillCategories } from "./utils";
import { Tooltip } from "react-tooltip";
import { Link } from "react-router-dom";
import paths from "@/utils/paths";

export default function GMailSkillPanel({
  title,
  skill,
  toggleSkill,
  enabled = false,
  disabled = false,
  setHasChanges,
  hasChanges = false,
}) {
  const { t } = useTranslation();
  const [disabledSkills, setDisabledSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deploymentId, setDeploymentId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isMultiUserMode, setIsMultiUserMode] = useState(false);
  const [configDefaultExpanded, setConfigDefaultExpanded] = useState(true);
  const prevHasChanges = useRef(hasChanges);
  const skillCategories = getGmailSkills(t);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      Admin.systemPreferencesByFields(["disabled_gmail_skills"]),
      System.keys(),
      GoogleAgentSkills.gmail.getStatus(),
    ])
      .then(([prefsRes, settingsRes, statusRes]) => {
        setDisabledSkills(prefsRes?.settings?.disabled_gmail_skills ?? []);
        setIsMultiUserMode(settingsRes?.MultiUserMode ?? false);

        if (statusRes?.success && statusRes.config) {
          const loadedDeploymentId = statusRes.config.deploymentId || "";
          const loadedApiKey = statusRes.config.apiKey || "";
          setDeploymentId(loadedDeploymentId);
          setApiKey(loadedApiKey);
          setConfigDefaultExpanded(!(loadedDeploymentId && loadedApiKey));
        }
      })
      .catch(() => {
        setDisabledSkills([]);
        setDeploymentId("");
        setApiKey("");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (prevHasChanges.current === true && hasChanges === false) {
      Promise.all([
        Admin.systemPreferencesByFields(["disabled_gmail_skills"]),
        GoogleAgentSkills.gmail.getStatus(),
      ])
        .then(([prefsRes, statusRes]) => {
          setDisabledSkills(prefsRes?.settings?.disabled_gmail_skills ?? []);
          if (statusRes?.success && statusRes.config) {
            setDeploymentId(statusRes.config.deploymentId || "");
            setApiKey(statusRes.config.apiKey || "");
          }
        })
        .catch(() => {});
    }
    prevHasChanges.current = hasChanges;
  }, [hasChanges]);

  function toggleGmailSkill(skillName) {
    setHasChanges(true);
    setDisabledSkills((prev) =>
      prev.includes(skillName)
        ? prev.filter((s) => s !== skillName)
        : [...prev, skillName]
    );
  }

  const isConfigured = deploymentId && apiKey;

  return (
    <div className="p-2">
      <div className="flex flex-col gap-y-[18px] max-w-[500px]">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-x-2">
            <img src={GMailIcon} alt="GMail" className="w-6 h-6" />
            <label className="text-theme-text-primary text-md font-bold">
              {title}
            </label>
          </div>
          <Toggle
            size="lg"
            enabled={enabled}
            disabled={disabled || isMultiUserMode}
            onChange={() => toggleSkill(skill)}
          />
        </div>

        {isMultiUserMode && (
          <div className="flex items-center gap-x-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <Warning size={20} className="text-yellow-500 shrink-0" />
            <p className="text-yellow-500 text-xs">
              {t("agent.skill.gmail.multiUserWarning")}
            </p>
          </div>
        )}

        <p className="text-theme-text-secondary text-opacity-60 text-xs font-medium">
          <Trans
            i18nKey="agent.skill.gmail.description"
            components={{
              a: (
                <Link
                  className="text-sky-400 hover:text-sky-500 text-xs font-medium underline"
                  to={paths.docs("/agent/usage/gmail-agent")}
                  target="_blank"
                />
              ),
            }}
          />
        </p>

        {enabled && !isMultiUserMode && (
          <>
            <HiddenFormInputs
              disabledSkills={disabledSkills}
              deploymentId={deploymentId}
              apiKey={apiKey}
            />

            {loading ? (
              <div className="flex items-center justify-center py-4">
                <CircleNotch
                  size={24}
                  className="animate-spin text-theme-text-primary"
                />
              </div>
            ) : (
              <>
                <ConfigurationSection
                  deploymentId={deploymentId}
                  setDeploymentId={setDeploymentId}
                  apiKey={apiKey}
                  setApiKey={setApiKey}
                  setHasChanges={setHasChanges}
                  isConfigured={isConfigured}
                  defaultExpanded={configDefaultExpanded}
                />

                {isConfigured && (
                  <SkillsSection
                    skillCategories={skillCategories}
                    disabledSkills={disabledSkills}
                    onToggle={toggleGmailSkill}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ConfigurationSection({
  deploymentId,
  setDeploymentId,
  apiKey,
  setApiKey,
  setHasChanges,
  isConfigured,
  defaultExpanded = true,
}) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="border border-theme-sidebar-border/50 rounded-lg overflow-hidden mt-2">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="border-none w-full flex items-center justify-between p-3 bg-theme-bg-secondary/30 hover:bg-theme-bg-secondary/50 transition-colors"
      >
        <div className="flex items-center gap-x-2">
          <span className="text-theme-text-primary font-semibold text-sm">
            {t("agent.skill.gmail.configuration")}
          </span>
          {isConfigured && (
            <div className="flex items-center gap-x-1">
              <CheckCircle size={14} weight="fill" className="text-green-500" />
              <span className="text-xs text-green-500">
                {t("agent.skill.gmail.configured")}
              </span>
            </div>
          )}
        </div>
        <CaretDown
          size={16}
          className={`text-theme-text-secondary transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="p-3 flex flex-col gap-y-4 border-t border-theme-sidebar-border/50">
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center gap-x-2">
              <label className="text-theme-text-primary text-sm font-medium">
                {t("agent.skill.gmail.deploymentId")}
              </label>
              <Info
                data-tooltip-id="deployment-id-tooltip"
                size={16}
                className="text-theme-text-secondary"
              />
              <Tooltip
                id="deployment-id-tooltip"
                place="top"
                delayShow={300}
                className="tooltip !text-xs !opacity-100"
              >
                {t("agent.skill.gmail.deploymentIdHelp")}
              </Tooltip>
            </div>
            <input
              type="text"
              value={deploymentId}
              onChange={(e) => {
                setDeploymentId(e.target.value);
                setHasChanges(true);
              }}
              placeholder="AKfycb..."
              className="w-full px-3 py-2 bg-theme-bg-primary border border-theme-sidebar-border rounded-lg text-theme-text-primary text-sm placeholder:text-theme-text-secondary/50"
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <div className="flex items-center gap-x-2">
              <label className="text-theme-text-primary text-sm font-medium">
                {t("agent.skill.gmail.apiKey")}
              </label>
              <Info
                data-tooltip-id="api-key-tooltip"
                size={16}
                className="text-theme-text-secondary"
              />
              <Tooltip
                id="api-key-tooltip"
                place="top"
                delayShow={300}
                className="tooltip !text-xs !opacity-100"
              >
                {t("agent.skill.gmail.apiKeyHelp")}
              </Tooltip>
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setHasChanges(true);
              }}
              placeholder="Your API key..."
              className="w-full px-3 py-2 bg-theme-bg-primary border border-theme-sidebar-border rounded-lg text-theme-text-primary text-sm placeholder:text-theme-text-secondary/50"
            />
          </div>
          {!isConfigured && (
            <div className="flex items-center gap-x-2 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <Warning size={20} className="text-orange-500 shrink-0" />
              <p className="text-orange-500 text-xs">
                {t("agent.skill.gmail.configurationRequired")}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SkillSearchInput({ onSearch }) {
  const { t } = useTranslation();
  const inputRef = useRef(null);

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        onSearch(value);
      }, 300),
    [onSearch]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleChange = (e) => {
    debouncedSearch(e.target.value);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="search"
        placeholder={t("agent.skill.gmail.searchSkills")}
        onChange={handleChange}
        className="w-full pl-9 pr-3 py-2 bg-theme-bg-primary border border-theme-sidebar-border rounded-lg text-theme-text-primary text-sm placeholder:text-theme-text-secondary/50 search-input"
      />
      <MagnifyingGlass
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-text-secondary"
        weight="bold"
      />
    </div>
  );
}

function SkillsSection({ skillCategories, disabledSkills, onToggle }) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const filteredCategories = useMemo(
    () => filterSkillCategories(skillCategories, searchTerm),
    [skillCategories, searchTerm]
  );

  const hasResults = Object.keys(filteredCategories).length > 0;

  return (
    <div className="flex flex-col mt-4 gap-y-4">
      <SkillSearchInput onSearch={handleSearch} />
      {hasResults ? (
        <div className="flex flex-col gap-y-4">
          {Object.entries(filteredCategories).map(([categoryKey, category]) => (
            <CategorySection
              key={categoryKey}
              category={category}
              disabledSkills={disabledSkills}
              onToggle={onToggle}
            />
          ))}
        </div>
      ) : (
        <p className="text-theme-text-secondary text-sm text-center py-4">
          {t("agent.skill.gmail.noSkillsFound")}
        </p>
      )}
    </div>
  );
}

function CategorySection({ category, disabledSkills, onToggle }) {
  const Icon = category.icon;

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center gap-x-2 px-1">
        <Icon size={18} className="text-theme-text-primary" />
        <span className="text-sm font-medium text-theme-text-primary">
          {category.title}
        </span>
      </div>
      <div className="flex flex-col gap-y-2">
        {category.skills.map((skill) => (
          <SkillRow
            key={skill.name}
            skill={skill}
            disabled={disabledSkills.includes(skill.name)}
            onToggle={() => onToggle(skill.name)}
          />
        ))}
      </div>
    </div>
  );
}

function SkillRow({ skill, disabled, onToggle }) {
  return (
    <div
      className={`flex items-center justify-between p-2 rounded-lg border ${
        disabled
          ? "bg-theme-bg-secondary/30 border-theme-sidebar-border/30"
          : "bg-theme-bg-secondary/50 border-theme-sidebar-border/50"
      }`}
    >
      <div className="flex flex-col">
        <span className="text-sm font-medium text-slate-100 light:text-slate-900">
          {skill.title}
        </span>
        <span className="text-xs text-slate-100/50 light:text-slate-900/50">
          {skill.description}
        </span>
      </div>
      <SimpleToggleSwitch enabled={!disabled} onChange={onToggle} size="md" />
    </div>
  );
}

function HiddenFormInputs({ disabledSkills, deploymentId, apiKey }) {
  const configJson = JSON.stringify({
    deploymentId: deploymentId || "",
    apiKey: apiKey || "",
  });

  return (
    <>
      <input
        name="system::disabled_gmail_skills"
        type="hidden"
        value={disabledSkills.join(",")}
      />
      <input
        name="system::gmail_agent_config"
        type="hidden"
        value={configJson}
      />
    </>
  );
}
