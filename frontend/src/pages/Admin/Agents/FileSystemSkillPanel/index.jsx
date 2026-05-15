import React, { useEffect, useState, useRef } from "react";
import Toggle, { SimpleToggleSwitch } from "@/components/lib/Toggle";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import {
  Warning,
  File,
  Files,
  PencilSimple,
  FloppyDisk,
  FolderPlus,
  FolderOpen,
  ArrowsLeftRight,
  MagnifyingGlass,
  Info,
  CircleNotch,
  Copy,
  Shield,
  Plus,
  Trash,
} from "@phosphor-icons/react";
import Admin from "@/models/admin";
import paths from "@/utils/paths";
import FileAccessPolicy from "@/models/fileAccessPolicy";

export const getFileSystemSubSkills = (t) => {
  return [
    {
      name: "filesystem-read-text-file",
      title: t("agent.skill.filesystem.skills.read-text-file.title"),
      description: t(
        "agent.skill.filesystem.skills.read-text-file.description"
      ),
      icon: File,
      category: "read",
    },
    {
      name: "filesystem-read-multiple-files",
      title: t("agent.skill.filesystem.skills.read-multiple-files.title"),
      description: t(
        "agent.skill.filesystem.skills.read-multiple-files.description"
      ),
      icon: Files,
      category: "read",
    },
    {
      name: "filesystem-list-directory",
      title: t("agent.skill.filesystem.skills.list-directory.title"),
      description: t(
        "agent.skill.filesystem.skills.list-directory.description"
      ),
      icon: FolderOpen,
      category: "read",
    },
    {
      name: "filesystem-search-files",
      title: t("agent.skill.filesystem.skills.search-files.title"),
      description: t("agent.skill.filesystem.skills.search-files.description"),
      icon: MagnifyingGlass,
      category: "read",
    },
    {
      name: "filesystem-get-file-info",
      title: t("agent.skill.filesystem.skills.get-file-info.title"),
      description: t("agent.skill.filesystem.skills.get-file-info.description"),
      icon: Info,
      category: "read",
    },
    {
      name: "filesystem-write-text-file",
      title: t("agent.skill.filesystem.skills.write-text-file.title"),
      description: t(
        "agent.skill.filesystem.skills.write-text-file.description"
      ),
      icon: FloppyDisk,
      category: "write",
    },
    {
      name: "filesystem-edit-file",
      title: t("agent.skill.filesystem.skills.edit-file.title"),
      description: t("agent.skill.filesystem.skills.edit-file.description"),
      icon: PencilSimple,
      category: "write",
    },
    {
      name: "filesystem-create-directory",
      title: t("agent.skill.filesystem.skills.create-directory.title"),
      description: t(
        "agent.skill.filesystem.skills.create-directory.description"
      ),
      icon: FolderPlus,
      category: "write",
    },
    {
      name: "filesystem-copy-file",
      title: t("agent.skill.filesystem.skills.copy-file.title"),
      description: t("agent.skill.filesystem.skills.copy-file.description"),
      icon: Copy,
      category: "write",
    },
    {
      name: "filesystem-move-file",
      title: t("agent.skill.filesystem.skills.move-file.title"),
      description: t("agent.skill.filesystem.skills.move-file.description"),
      icon: ArrowsLeftRight,
      category: "write",
    },
  ];
};

export default function FileSystemSkillPanel({
  title,
  skill,
  toggleSkill,
  enabled = false,
  disabled = false,
  image,
  icon,
  setHasChanges,
  hasChanges = false,
}) {
  const { t } = useTranslation();
  const [disabledSubSkills, setDisabledSubSkills] = useState([]);
  const [policy, setPolicy] = useState(null);
  const [newDirectory, setNewDirectory] = useState("");
  const [newBlacklist, setNewBlacklist] = useState("");
  const [loading, setLoading] = useState(true);
  const prevHasChanges = useRef(hasChanges);
  const FILESYSTEM_SUB_SKILLS = getFileSystemSubSkills(t);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      Admin.systemPreferencesByFields(["disabled_filesystem_skills"]),
      FileAccessPolicy.getPolicy(),
    ])
      .then(([res, policyRes]) => {
        setDisabledSubSkills(res?.settings?.disabled_filesystem_skills ?? []);
        setPolicy(policyRes?.policy || null);
      })
      .catch(() => setDisabledSubSkills([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (prevHasChanges.current === true && hasChanges === false) {
      Admin.systemPreferencesByFields(["disabled_filesystem_skills"])
        .then((res) =>
          setDisabledSubSkills(res?.settings?.disabled_filesystem_skills ?? [])
        )
        .catch(() => {});
    }
    prevHasChanges.current = hasChanges;
  }, [hasChanges]);

  function toggleSubSkill(subSkillName) {
    setHasChanges(true);
    setDisabledSubSkills((prev) => {
      if (prev.includes(subSkillName)) {
        return prev.filter((s) => s !== subSkillName);
      }
      return [...prev, subSkillName];
    });
  }

  function updatePolicy(updater) {
    setHasChanges(true);
    setPolicy((prev) => updater(prev || {}));
  }

  function addAuthorizedDirectory() {
    const trimmed = newDirectory.trim();
    if (!trimmed) return;
    updatePolicy((prev) => ({
      ...prev,
      authorizedDirectories: [
        ...(prev.authorizedDirectories || []),
        {
          id: crypto.randomUUID(),
          label: trimmed.split("/").filter(Boolean).pop() || trimmed,
          path: trimmed,
          read: true,
          write: false,
          enabled: true,
          source: "admin",
          createdAt: new Date().toISOString(),
        },
      ],
    }));
    setNewDirectory("");
  }

  function removeAuthorizedDirectory(id) {
    updatePolicy((prev) => ({
      ...prev,
      authorizedDirectories: (prev.authorizedDirectories || []).filter(
        (dir) => dir.id !== id || dir.source === "builtin"
      ),
    }));
  }

  function addBlacklistRule() {
    const trimmed = newBlacklist.trim();
    if (!trimmed) return;
    updatePolicy((prev) => ({
      ...prev,
      openBlacklist: [
        ...(prev.openBlacklist || []),
        {
          id: crypto.randomUUID(),
          label: trimmed,
          pattern: trimmed.startsWith("/") ? null : trimmed,
          path: trimmed.startsWith("/") ? trimmed : null,
          type: trimmed.startsWith("/") ? "path" : "segment",
          enabled: true,
          source: "admin",
        },
      ],
    }));
    setNewBlacklist("");
  }

  function removeBlacklistRule(id) {
    updatePolicy((prev) => ({
      ...prev,
      openBlacklist: (prev.openBlacklist || []).filter(
        (rule) => rule.id !== id || rule.source === "builtin"
      ),
    }));
  }
  const readSkills = FILESYSTEM_SUB_SKILLS.filter((s) => s.category === "read");
  const writeSkills = FILESYSTEM_SUB_SKILLS.filter(
    (s) => s.category === "write"
  );

  return (
    <div className="p-2">
      <div className="flex flex-col gap-y-[18px] max-w-[500px]">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-x-2">
            {icon &&
              React.createElement(icon, {
                size: 24,
                color: "var(--theme-text-primary)",
                weight: "bold",
              })}
            <label
              htmlFor="name"
              className="text-theme-text-primary text-md font-bold"
            >
              {title}
            </label>
          </div>
          <Toggle
            size="lg"
            enabled={enabled}
            disabled={disabled}
            onChange={() => toggleSkill(skill)}
          />
        </div>

        <img src={image} alt={title} className="w-full rounded-md" />
        <WarningBanner />
        <div className="flex flex-col gap-y-1">
          <p className="text-theme-text-secondary text-opacity-60 text-xs font-medium">
            {t("agent.skill.filesystem.description")}
          </p>
          <Link
            to={paths.docs("/agent/usage/file-system-agent")}
            target="_blank"
            className="text-sky-400 hover:text-sky-500 text-xs font-medium underline"
          >
            {t("agent.skill.filesystem.learnMore")} &rarr;
          </Link>
        </div>

        {enabled && (
          <>
            <input
              name="system::disabled_filesystem_skills"
              type="hidden"
              value={disabledSubSkills.join(",")}
            />
            <input
              name="system::file_access_default_mode"
              type="hidden"
              value={policy?.defaultMode || "sandbox"}
            />
            <input
              name="system::file_access_authorized_directories"
              type="hidden"
              value={JSON.stringify(
                (policy?.authorizedDirectories || []).filter(
                  (dir) => dir.source !== "builtin"
                )
              )}
            />
            <input
              name="system::file_access_open_blacklist"
              type="hidden"
              value={JSON.stringify(
                (policy?.openBlacklist || []).filter(
                  (rule) => rule.source !== "builtin"
                )
              )}
            />
            <div className="flex flex-col mt-2 gap-y-4">
              <div className="flex justify-between items-center">
                <p className="text-theme-text-primary font-semibold text-sm">
                  {t("agent.skill.filesystem.configuration")}
                </p>
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <CircleNotch
                    size={24}
                    className="animate-spin text-theme-text-primary"
                  />
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-y-2">
                    <FileAccessPolicyEditor
                      policy={policy}
                      setDefaultMode={(mode) =>
                        updatePolicy((prev) => ({
                          ...prev,
                          defaultMode: mode,
                        }))
                      }
                      newDirectory={newDirectory}
                      setNewDirectory={setNewDirectory}
                      addAuthorizedDirectory={addAuthorizedDirectory}
                      removeAuthorizedDirectory={removeAuthorizedDirectory}
                      newBlacklist={newBlacklist}
                      setNewBlacklist={setNewBlacklist}
                      addBlacklistRule={addBlacklistRule}
                      removeBlacklistRule={removeBlacklistRule}
                    />
                  </div>

                  <div className="flex flex-col gap-y-2">
                    <p className="text-theme-text-secondary text-xs font-medium uppercase tracking-wide">
                      {t("agent.skill.filesystem.readActions")}
                    </p>
                    <div className="flex flex-col gap-y-1">
                      {readSkills.map((subSkill) => (
                        <SubSkillRow
                          key={subSkill.name}
                          subSkill={subSkill}
                          disabled={disabledSubSkills.includes(subSkill.name)}
                          onToggle={() => toggleSubSkill(subSkill.name)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-y-2">
                    <p className="text-theme-text-secondary text-xs font-medium uppercase tracking-wide flex items-center gap-x-1">
                      <Warning
                        size={12}
                        className="text-orange-400"
                        weight="fill"
                      />
                      {t("agent.skill.filesystem.writeActions")}
                    </p>
                    <div className="flex flex-col gap-y-1">
                      {writeSkills.map((subSkill) => (
                        <SubSkillRow
                          key={subSkill.name}
                          subSkill={subSkill}
                          disabled={disabledSubSkills.includes(subSkill.name)}
                          onToggle={() => toggleSubSkill(subSkill.name)}
                          isWriteOperation
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FileAccessPolicyEditor({
  policy,
  setDefaultMode,
  newDirectory,
  setNewDirectory,
  addAuthorizedDirectory,
  removeAuthorizedDirectory,
  newBlacklist,
  setNewBlacklist,
  addBlacklistRule,
  removeBlacklistRule,
}) {
  if (!policy) return null;
  const modes = [
    { value: "sandbox", label: "Sandbox" },
    { value: "authorized", label: "Authorized" },
    { value: "open", label: "Open" },
  ];

  return (
    <div className="flex flex-col gap-y-3 p-3 rounded-lg border border-theme-sidebar-border/50 bg-theme-bg-secondary/40">
      <div className="flex items-center gap-x-2 text-theme-text-primary">
        <Shield size={16} weight="bold" />
        <p className="font-semibold text-sm">File access policy</p>
      </div>
      <label className="flex flex-col gap-y-1">
        <span className="text-xs text-theme-text-secondary font-medium">
          Global default mode
        </span>
        <select
          value={policy.defaultMode || "sandbox"}
          onChange={(e) => setDefaultMode(e.target.value)}
          className="bg-theme-bg-primary border border-theme-sidebar-border rounded-md text-theme-text-primary text-sm p-2"
        >
          {modes.map((mode) => (
            <option key={mode.value} value={mode.value}>
              {mode.label}
            </option>
          ))}
        </select>
      </label>
      <DirectoryList
        title="Authorized directories"
        rows={policy.authorizedDirectories || []}
        value={newDirectory}
        setValue={setNewDirectory}
        onAdd={addAuthorizedDirectory}
        onRemove={removeAuthorizedDirectory}
        placeholder="~/Projects or /Volumes/MyDrive"
      />
      <DirectoryList
        title="Open blacklist"
        rows={policy.openBlacklist || []}
        value={newBlacklist}
        setValue={setNewBlacklist}
        onAdd={addBlacklistRule}
        onRemove={removeBlacklistRule}
        placeholder=".secret or /private/path"
      />
      <div className="flex flex-col gap-y-1">
        <p className="text-xs text-theme-text-secondary font-medium">
          Recent file access audit log
        </p>
        {(policy.auditLogs || []).slice(0, 5).map((log) => (
          <div
            key={log.id}
            className="text-[11px] text-theme-text-secondary bg-theme-bg-primary rounded px-2 py-1"
          >
            {log.event} · {new Date(log.occurredAt).toLocaleString()}
          </div>
        ))}
        {(policy.auditLogs || []).length === 0 && (
          <p className="text-[11px] text-theme-text-secondary/70">
            No file access audit events yet.
          </p>
        )}
      </div>
    </div>
  );
}

function DirectoryList({
  title,
  rows = [],
  value,
  setValue,
  onAdd,
  onRemove,
  placeholder,
}) {
  return (
    <div className="flex flex-col gap-y-1">
      <p className="text-xs text-theme-text-secondary font-medium">{title}</p>
      <div className="flex gap-x-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="flex-1 min-w-0 bg-theme-bg-primary border border-theme-sidebar-border rounded-md text-theme-text-primary text-xs p-2"
        />
        <button
          type="button"
          onClick={onAdd}
          className="border-none bg-cta-button text-white rounded-md px-2"
        >
          <Plus size={16} />
        </button>
      </div>
      <div className="flex flex-col gap-y-1">
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex items-center justify-between gap-x-2 text-xs bg-theme-bg-primary rounded px-2 py-1"
          >
            <div className="min-w-0">
              <p className="text-theme-text-primary truncate">
                {row.label || row.pattern || row.path}
              </p>
              <p className="text-theme-text-secondary truncate">
                {row.path || row.pattern} · {row.source}
              </p>
            </div>
            <button
              type="button"
              disabled={row.source === "builtin"}
              onClick={() => onRemove(row.id)}
              className="border-none text-theme-text-secondary disabled:opacity-30 hover:text-red-400"
            >
              <Trash size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function WarningBanner() {
  return (
    <div className="flex items-start gap-x-2.5 p-2.5 bg-orange-800/20 light:bg-orange-800/10 text-orange-400 light:text-orange-600 border border-orange-400/30 rounded-lg items-center">
      <Warning size={20} className="flex-shrink-0 mt-0.5" weight="fill" />
      <p className="text-xs font-medium">
        <Trans
          i18nKey="agent.skill.filesystem.warning"
          components={{
            a: (
              <Link
                to={paths.docs("/agent/usage/file-system-agent")}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-orange-300 light:hover:text-orange-700"
              />
            ),
          }}
        />
      </p>
    </div>
  );
}

function SubSkillRow({ subSkill, disabled, onToggle, isWriteOperation }) {
  const Icon = subSkill.icon;
  return (
    <div
      className={`flex items-center justify-between p-2 rounded-lg border ${
        disabled
          ? "bg-theme-bg-secondary/30 border-theme-sidebar-border/30"
          : isWriteOperation
            ? "bg-orange-900/10 border-orange-400/20 light:bg-orange-800/10 text-orange-400 light:text-orange-600"
            : "bg-theme-bg-secondary/50 border-theme-sidebar-border/50"
      }`}
    >
      <div className="flex items-center gap-x-2">
        <Icon
          size={16}
          className={
            disabled
              ? "text-theme-text-secondary/50"
              : isWriteOperation
                ? "text-orange-400"
                : "text-theme-text-primary"
          }
          weight="bold"
        />
        <div className="flex flex-col">
          <span
            className={`text-sm font-medium ${disabled ? "text-theme-text-secondary/50" : "text-theme-text-primary"}`}
          >
            {subSkill.title}
          </span>
          <span
            className={`text-xs ${disabled ? "text-theme-text-secondary/40" : "text-theme-text-secondary"}`}
          >
            {subSkill.description}
          </span>
        </div>
      </div>
      <SimpleToggleSwitch enabled={!disabled} onChange={onToggle} size="md" />
    </div>
  );
}
