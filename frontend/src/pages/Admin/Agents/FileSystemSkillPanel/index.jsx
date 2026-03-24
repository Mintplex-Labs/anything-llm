import React, { useEffect, useState, useRef } from "react";
import Toggle, { SimpleToggleSwitch } from "@/components/lib/Toggle";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
} from "@phosphor-icons/react";
import Admin from "@/models/admin";

const getFileSystemSubSkills = (t) => {
  return [
    {
      name: "filesystem-read-text-file",
      title: "Read File",
      description: "Read contents of files (text, code, PDF, images, etc.)",
      icon: File,
      category: "read",
    },
    {
      name: "filesystem-read-multiple-files",
      title: "Read Multiple Files",
      description: "Read multiple files at once",
      icon: Files,
      category: "read",
    },
    {
      name: "filesystem-list-directory",
      title: "List Directory",
      description: "List files and directories in a folder",
      icon: FolderOpen,
      category: "read",
    },
    {
      name: "filesystem-search-files",
      title: "Search Files",
      description: "Search for files by name or content",
      icon: MagnifyingGlass,
      category: "read",
    },
    {
      name: "filesystem-get-file-info",
      title: "Get File Info",
      description: "Get detailed metadata about files",
      icon: Info,
      category: "read",
    },
    {
      name: "filesystem-write-file",
      title: "Write File",
      description: "Create new files or overwrite existing files",
      icon: FloppyDisk,
      category: "write",
    },
    {
      name: "filesystem-edit-file",
      title: "Edit File",
      description: "Make line-based edits to text files",
      icon: PencilSimple,
      category: "write",
    },
    {
      name: "filesystem-create-directory",
      title: "Create Directory",
      description: "Create new directories",
      icon: FolderPlus,
      category: "write",
    },
    {
      name: "filesystem-move-file",
      title: "Move/Rename File",
      description: "Move or rename files and directories",
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
  const [loading, setLoading] = useState(true);
  const prevHasChanges = useRef(hasChanges);
  const FILESYSTEM_SUB_SKILLS = getFileSystemSubSkills(t);

  useEffect(() => {
    setLoading(true);
    Admin.systemPreferencesByFields(["disabled_filesystem_skills"])
      .then((res) =>
        setDisabledSubSkills(res?.settings?.disabled_filesystem_skills ?? [])
      )
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
            to="/docs/guides/agent-skills/filesystem-agent"
            target="_blank"
            className="text-sky-400 hover:text-sky-500 text-xs font-medium underline"
          >
            Learn more about this how to use this skill &rarr;
          </Link>
        </div>

        {enabled && (
          <>
            <input
              name="system::disabled_filesystem_skills"
              type="hidden"
              value={disabledSubSkills.join(",")}
            />
            <div className="flex flex-col mt-2 gap-y-4">
              <div className="flex justify-between items-center">
                <p className="text-theme-text-primary font-semibold text-sm">
                  Configuration
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
                    <p className="text-theme-text-secondary text-xs font-medium uppercase tracking-wide">
                      Read Actions
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
                      Write Actions
                      <Warning
                        size={12}
                        className="text-orange-400"
                        weight="fill"
                      />
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

function WarningBanner() {
  const { t } = useTranslation();
  return (
    <div className="flex items-start gap-x-2.5 p-2.5 bg-orange-800/20 light:bg-orange-800/10 text-orange-400 light:text-orange-600 border border-orange-400/30 rounded-lg items-center">
      <Warning size={20} className="flex-shrink-0 mt-0.5" weight="fill" />
      <p className="text-xs font-medium">
        Filesystem access can be dangerous as it can modify or delete files.
        Please consult the{" "}
        <Link
          to="/docs/guides/agent-skills/filesystem-agent"
          target="_blank"
          className="underline hover:text-orange-300 light:hover:text-orange-700"
        >
          documentation
        </Link>{" "}
        before enabling.
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
            ? "bg-orange-900/10 border-orange-400/20"
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
