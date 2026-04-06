import React, { useEffect, useState, useRef } from "react";
import Toggle, { SimpleToggleSwitch } from "@/components/lib/Toggle";
import { useTranslation } from "react-i18next";
import {
  FilePpt,
  FileXls,
  FileDoc,
  FilePdf,
  FileText,
  CircleNotch,
} from "@phosphor-icons/react";
import Admin from "@/models/admin";

const getCreateFileSkills = (t) => [
  {
    name: "create-text-file",
    title: t("agent.skill.createFiles.skills.create-text-file.title"),
    description: t(
      "agent.skill.createFiles.skills.create-text-file.description"
    ),
    icon: FileText,
  },
  {
    name: "create-pptx-presentation",
    title: t("agent.skill.createFiles.skills.create-pptx.title"),
    description: t("agent.skill.createFiles.skills.create-pptx.description"),
    icon: FilePpt,
  },
  {
    name: "create-pdf-file",
    title: t("agent.skill.createFiles.skills.create-pdf.title"),
    description: t("agent.skill.createFiles.skills.create-pdf.description"),
    icon: FilePdf,
  },
  {
    name: "create-excel-file",
    title: t("agent.skill.createFiles.skills.create-xlsx.title"),
    description: t("agent.skill.createFiles.skills.create-xlsx.description"),
    icon: FileXls,
  },
  {
    name: "create-docx-file",
    title: t("agent.skill.createFiles.skills.create-docx.title"),
    description: t("agent.skill.createFiles.skills.create-docx.description"),
    icon: FileDoc,
  },
];

export default function CreateFileSkillPanel({
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
  const [disabledSkills, setDisabledSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const prevHasChanges = useRef(hasChanges);
  const skills = getCreateFileSkills(t);

  useEffect(() => {
    setLoading(true);
    Admin.systemPreferencesByFields(["disabled_create_files_skills"])
      .then((res) =>
        setDisabledSkills(res?.settings?.disabled_create_files_skills ?? [])
      )
      .catch(() => setDisabledSkills([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (prevHasChanges.current === true && hasChanges === false) {
      Admin.systemPreferencesByFields(["disabled_create_files_skills"])
        .then((res) =>
          setDisabledSkills(res?.settings?.disabled_create_files_skills ?? [])
        )
        .catch(() => {});
    }
    prevHasChanges.current = hasChanges;
  }, [hasChanges]);

  function toggleFileSkill(skillName) {
    setHasChanges(true);
    setDisabledSkills((prev) =>
      prev.includes(skillName)
        ? prev.filter((s) => s !== skillName)
        : [...prev, skillName]
    );
  }

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
        <p className="text-theme-text-secondary text-opacity-60 text-xs font-medium">
          {t("agent.skill.createFiles.description")}
        </p>

        {enabled && (
          <>
            <input
              name="system::disabled_create_files_skills"
              type="hidden"
              value={disabledSkills.join(",")}
            />
            <div className="flex flex-col mt-2 gap-y-2">
              <p className="text-theme-text-primary font-semibold text-sm">
                {t("agent.skill.createFiles.configuration")}
              </p>
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <CircleNotch
                    size={24}
                    className="animate-spin text-theme-text-primary"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-y-2">
                  {skills.map((fileSkill) => (
                    <SkillRow
                      key={fileSkill.name}
                      skill={fileSkill}
                      disabled={disabledSkills.includes(fileSkill.name)}
                      onToggle={() => toggleFileSkill(fileSkill.name)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SkillRow({ skill, disabled, onToggle }) {
  const Icon = skill.icon;
  return (
    <div
      className={`flex items-center justify-between p-2 rounded-lg border ${
        disabled
          ? "bg-theme-bg-secondary/30 border-theme-sidebar-border/30"
          : "bg-theme-bg-secondary/50 border-theme-sidebar-border/50"
      }`}
    >
      <div className="flex items-center gap-x-2">
        <Icon
          size={22}
          className="text-slate-100 light:text-slate-900 shrink-0"
        />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-100 light:text-slate-900">
            {skill.title}
          </span>
          <span className="text-xs text-slate-100/50 light:text-slate-900/50">
            {skill.description}
          </span>
        </div>
      </div>
      <SimpleToggleSwitch enabled={!disabled} onChange={onToggle} size="md" />
    </div>
  );
}
