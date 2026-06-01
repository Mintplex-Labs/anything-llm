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
  ArrowSquareOut,
  XCircle,
} from "@phosphor-icons/react";
import Admin from "@/models/admin";
import System from "@/models/system";
import OutlookAgent from "@/models/outlookAgent";
import { getOutlookSkills, filterSkillCategories } from "./utils";
import OutlookIcon from "./outlook.png";
import { Tooltip } from "react-tooltip";
import { Link } from "react-router-dom";
import paths from "@/utils/paths";

export default function OutlookSkillPanel({
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
  const [clientId, setClientId] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [authType, setAuthType] = useState("common");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [isMultiUserMode, setIsMultiUserMode] = useState(false);
  const [configDefaultExpanded, setConfigDefaultExpanded] = useState(true);
  const prevHasChanges = useRef(hasChanges);
  const skillCategories = getOutlookSkills(t);

  const fetchStatus = async () => {
    try {
      const data = await OutlookAgent.getStatus();
      if (data.success) {
        setIsAuthenticated(data.isAuthenticated);
        // Load config from status endpoint
        if (data.config) {
          setClientId(data.config.clientId || "");
          setTenantId(data.config.tenantId || "");
          setClientSecret(data.config.clientSecret || "");
          setAuthType(data.config.authType || "common");
          setConfigDefaultExpanded(
            !(data.config.clientId && data.config.clientSecret)
          );
        }
      }
    } catch (e) {
      console.error("Failed to fetch Outlook status:", e);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      Admin.systemPreferencesByFields(["disabled_outlook_skills"]),
      System.keys(),
      OutlookAgent.getStatus(),
    ])
      .then(([prefsRes, settingsRes, statusRes]) => {
        setDisabledSkills(prefsRes?.settings?.disabled_outlook_skills ?? []);
        setIsMultiUserMode(settingsRes?.MultiUserMode ?? false);

        // Load config from status endpoint
        if (statusRes?.success) {
          setIsAuthenticated(statusRes.isAuthenticated);
          if (statusRes.config) {
            setClientId(statusRes.config.clientId || "");
            setTenantId(statusRes.config.tenantId || "");
            setClientSecret(statusRes.config.clientSecret || "");
            setAuthType(statusRes.config.authType || "common");
            setConfigDefaultExpanded(
              !(statusRes.config.clientId && statusRes.config.clientSecret)
            );
          }
        }
      })
      .catch(() => {
        setDisabledSkills([]);
        setClientId("");
        setTenantId("");
        setClientSecret("");
        setAuthType("common");
      })
      .finally(() => setLoading(false));

    const urlParams = new URLSearchParams(window.location.search);
    const outlookAuth = urlParams.get("outlook_auth");
    if (outlookAuth === "success") {
      fetchStatus();
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (outlookAuth === "error") {
      const message = urlParams.get("message");
      console.error("Outlook auth error:", message);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (prevHasChanges.current === true && hasChanges === false) {
      Promise.all([
        Admin.systemPreferencesByFields(["disabled_outlook_skills"]),
        OutlookAgent.getStatus(),
      ])
        .then(([prefsRes, statusRes]) => {
          setDisabledSkills(prefsRes?.settings?.disabled_outlook_skills ?? []);
          if (statusRes?.success) {
            setIsAuthenticated(statusRes.isAuthenticated);
            if (statusRes.config) {
              setClientId(statusRes.config.clientId || "");
              setTenantId(statusRes.config.tenantId || "");
              setClientSecret(statusRes.config.clientSecret || "");
              setAuthType(statusRes.config.authType || "common");
            }
          }
        })
        .catch(() => {});
    }
    prevHasChanges.current = hasChanges;
  }, [hasChanges]);

  function toggleOutlookSkill(skillName) {
    setHasChanges(true);
    setDisabledSkills((prev) =>
      prev.includes(skillName)
        ? prev.filter((s) => s !== skillName)
        : [...prev, skillName]
    );
  }

  const handleStartAuth = async () => {
    setAuthLoading(true);
    try {
      const data = await OutlookAgent.saveCredentialsAndGetAuthUrl({
        clientId,
        tenantId,
        clientSecret,
        authType,
      });
      if (data.success && data.url) {
        window.open(data.url, "_blank");
      } else {
        console.error("Failed to get auth URL:", data.error);
      }
    } catch (e) {
      console.error("Auth error:", e);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRevokeAuth = async () => {
    setAuthLoading(true);
    try {
      const data = await OutlookAgent.revokeAccess();
      if (data.success) {
        setIsAuthenticated(false);
      }
    } catch (e) {
      console.error("Revoke error:", e);
    } finally {
      setAuthLoading(false);
    }
  };

  // For organization auth type, tenant ID is required; for others it's optional
  const hasCredentials =
    authType === "organization"
      ? clientId && tenantId && clientSecret
      : clientId && clientSecret;
  const isConfigured = hasCredentials && isAuthenticated;

  return (
    <div className="p-2">
      <div className="flex flex-col gap-y-[18px] max-w-[500px]">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-x-2">
            <img src={OutlookIcon} alt="Outlook" className="w-6 h-6" />
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
              {t("agent.skill.outlook.multiUserWarning")}
            </p>
          </div>
        )}

        <p className="text-theme-text-secondary text-opacity-60 text-xs font-medium">
          <Trans
            i18nKey="agent.skill.outlook.description"
            components={{
              a: (
                <Link
                  className="text-sky-400 hover:text-sky-500 text-xs font-medium underline"
                  to={paths.docs("/agent/usage/outlook-agent")}
                  target="_blank"
                />
              ),
            }}
          />
        </p>

        {enabled && !isMultiUserMode && (
          <>
            <HiddenFormInputs disabledSkills={disabledSkills} />

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
                  clientId={clientId}
                  setClientId={setClientId}
                  tenantId={tenantId}
                  setTenantId={setTenantId}
                  clientSecret={clientSecret}
                  setClientSecret={setClientSecret}
                  authType={authType}
                  setAuthType={setAuthType}
                  setHasChanges={setHasChanges}
                  hasCredentials={hasCredentials}
                  isAuthenticated={isAuthenticated}
                  isConfigured={isConfigured}
                  defaultExpanded={configDefaultExpanded}
                  onStartAuth={handleStartAuth}
                  onRevokeAuth={handleRevokeAuth}
                  authLoading={authLoading}
                />

                {isConfigured && (
                  <SkillsSection
                    skillCategories={skillCategories}
                    disabledSkills={disabledSkills}
                    onToggle={toggleOutlookSkill}
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
  clientId,
  setClientId,
  tenantId,
  setTenantId,
  clientSecret,
  setClientSecret,
  authType,
  setAuthType,
  setHasChanges,
  hasCredentials,
  isAuthenticated,
  isConfigured,
  defaultExpanded = true,
  onStartAuth,
  onRevokeAuth,
  authLoading,
}) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const showTenantId = authType === "organization";

  return (
    <div className="border border-theme-sidebar-border/50 rounded-lg overflow-hidden mt-2">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="border-none w-full flex items-center justify-between p-3 bg-theme-bg-secondary/30 hover:bg-theme-bg-secondary/50 transition-colors"
      >
        <div className="flex items-center gap-x-2">
          <span className="text-theme-text-primary font-semibold text-sm">
            {t("agent.skill.outlook.configuration")}
          </span>
          {isConfigured && (
            <div className="flex items-center gap-x-1">
              <CheckCircle size={14} weight="fill" className="text-green-500" />
              <span className="text-xs text-green-500">
                {t("agent.skill.outlook.configured")}
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
                {t("agent.skill.outlook.authType")}
              </label>
              <Info
                data-tooltip-id="auth-type-tooltip"
                size={16}
                className="text-theme-text-secondary"
              />
              <Tooltip
                id="auth-type-tooltip"
                place="top"
                delayShow={300}
                className="tooltip !text-xs !opacity-100 max-w-xs"
              >
                {t("agent.skill.outlook.authTypeHelp")}
              </Tooltip>
            </div>
            <select
              value={authType}
              onChange={(e) => {
                setAuthType(e.target.value);
                setHasChanges(true);
              }}
              className="w-full px-3 py-2 bg-theme-bg-primary border border-theme-sidebar-border rounded-lg text-theme-text-primary text-sm"
            >
              <option value="common">
                {t("agent.skill.outlook.authTypeCommon")}
              </option>
              <option value="consumers">
                {t("agent.skill.outlook.authTypeConsumers")}
              </option>
              <option value="organization">
                {t("agent.skill.outlook.authTypeOrganization")}
              </option>
            </select>
          </div>

          <div className="flex flex-col gap-y-2">
            <div className="flex items-center gap-x-2">
              <label className="text-theme-text-primary text-sm font-medium">
                {t("agent.skill.outlook.clientId")}
              </label>
              <Info
                data-tooltip-id="client-id-tooltip"
                size={16}
                className="text-theme-text-secondary"
              />
              <Tooltip
                id="client-id-tooltip"
                place="top"
                delayShow={300}
                className="tooltip !text-xs !opacity-100"
              >
                {t("agent.skill.outlook.clientIdHelp")}
              </Tooltip>
            </div>
            <input
              type="text"
              value={clientId}
              onChange={(e) => {
                setClientId(e.target.value);
                setHasChanges(true);
              }}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              className="w-full px-3 py-2 bg-theme-bg-primary border border-theme-sidebar-border rounded-lg text-theme-text-primary text-sm placeholder:text-theme-text-secondary/50"
            />
          </div>

          {showTenantId && (
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center gap-x-2">
                <label className="text-theme-text-primary text-sm font-medium">
                  {t("agent.skill.outlook.tenantId")}
                </label>
                <Info
                  data-tooltip-id="tenant-id-tooltip"
                  size={16}
                  className="text-theme-text-secondary"
                />
                <Tooltip
                  id="tenant-id-tooltip"
                  place="top"
                  delayShow={300}
                  className="tooltip !text-xs !opacity-100"
                >
                  {t("agent.skill.outlook.tenantIdHelp")}
                </Tooltip>
              </div>
              <input
                type="text"
                value={tenantId}
                onChange={(e) => {
                  setTenantId(e.target.value);
                  setHasChanges(true);
                }}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="w-full px-3 py-2 bg-theme-bg-primary border border-theme-sidebar-border rounded-lg text-theme-text-primary text-sm placeholder:text-theme-text-secondary/50"
              />
            </div>
          )}

          <div className="flex flex-col gap-y-2">
            <div className="flex items-center gap-x-2">
              <label className="text-theme-text-primary text-sm font-medium">
                {t("agent.skill.outlook.clientSecret")}
              </label>
              <Info
                data-tooltip-id="client-secret-tooltip"
                size={16}
                className="text-theme-text-secondary"
              />
              <Tooltip
                id="client-secret-tooltip"
                place="top"
                delayShow={300}
                className="tooltip !text-xs !opacity-100"
              >
                {t("agent.skill.outlook.clientSecretHelp")}
              </Tooltip>
            </div>
            <input
              type="password"
              value={clientSecret}
              onChange={(e) => {
                setClientSecret(e.target.value);
                setHasChanges(true);
              }}
              placeholder="Your client secret..."
              className="w-full px-3 py-2 bg-theme-bg-primary border border-theme-sidebar-border rounded-lg text-theme-text-primary text-sm placeholder:text-theme-text-secondary/50"
            />
          </div>

          {!hasCredentials && (
            <div className="flex items-center gap-x-2 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <Warning size={20} className="text-orange-500 shrink-0" />
              <p className="text-orange-500 text-xs">
                {t("agent.skill.outlook.configurationRequired")}
              </p>
            </div>
          )}

          {hasCredentials && !isAuthenticated && (
            <div className="flex flex-col gap-y-3">
              <div className="flex items-center gap-x-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <Info size={20} className="text-blue-500 shrink-0" />
                <p className="text-blue-500 text-xs">
                  {t("agent.skill.outlook.authRequired")}
                </p>
              </div>
              <button
                type="button"
                onClick={onStartAuth}
                disabled={authLoading}
                className="flex items-center justify-center gap-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {authLoading ? (
                  <CircleNotch size={16} className="animate-spin" />
                ) : (
                  <ArrowSquareOut size={16} />
                )}
                {t("agent.skill.outlook.authenticateWithMicrosoft")}
              </button>
            </div>
          )}

          {hasCredentials && isAuthenticated && (
            <div className="flex flex-col gap-y-3">
              <div className="flex items-center gap-x-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <CheckCircle
                  size={20}
                  weight="fill"
                  className="text-green-500 shrink-0"
                />
                <p className="text-green-500 text-xs">
                  {t("agent.skill.outlook.authenticated")}
                </p>
              </div>
              <button
                type="button"
                onClick={onRevokeAuth}
                disabled={authLoading}
                className="flex items-center justify-center gap-x-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 text-red-500 text-sm font-medium rounded-lg transition-colors"
              >
                {authLoading ? (
                  <CircleNotch size={16} className="animate-spin" />
                ) : (
                  <XCircle size={16} />
                )}
                {t("agent.skill.outlook.revokeAccess")}
              </button>
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
        placeholder={t("agent.skill.outlook.searchSkills")}
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
          {t("agent.skill.outlook.noSkillsFound")}
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

function HiddenFormInputs({ disabledSkills }) {
  return (
    <input
      name="system::disabled_outlook_skills"
      type="hidden"
      value={disabledSkills.join(",")}
    />
  );
}
