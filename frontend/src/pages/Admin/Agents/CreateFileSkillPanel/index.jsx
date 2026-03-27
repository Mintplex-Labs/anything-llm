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

const getCreateFileSubSkills = (t) => {
  return [
    {
      name: "create-text-file",
      title: t("agent.skill.createFiles.skills.create-text-file.title"),
      description: t(
        "agent.skill.createFiles.skills.create-text-file.description"
      ),
      icon: FileText,
      category: "text",
    },
    {
      name: "create-pptx-presentation",
      title: t("agent.skill.createFiles.skills.create-pptx.title"),
      description: t("agent.skill.createFiles.skills.create-pptx.description"),
      icon: FilePpt,
      category: "pptx",
    },
    {
      name: "create-pdf-file",
      title: t("agent.skill.createFiles.skills.create-pdf.title"),
      description: t("agent.skill.createFiles.skills.create-pdf.description"),
      icon: FilePdf,
      category: "pdf",
    },
    {
      name: "create-excel-file",
      title: t("agent.skill.createFiles.skills.create-xlsx.title"),
      description: t("agent.skill.createFiles.skills.create-xlsx.description"),
      icon: FileXls,
      category: "xlsx",
    },
    {
      name: "create-docx-file",
      title: t("agent.skill.createFiles.skills.create-docx.title"),
      description: t("agent.skill.createFiles.skills.create-docx.description"),
      icon: FileDoc,
      category: "docx",
    },
  ];
};

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
  const [disabledSubSkills, setDisabledSubSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const prevHasChanges = useRef(hasChanges);
  const CREATE_FILE_SUB_SKILLS = getCreateFileSubSkills(t);

  useEffect(() => {
    setLoading(true);
    Admin.systemPreferencesByFields(["disabled_create_files_skills"])
      .then((res) =>
        setDisabledSubSkills(res?.settings?.disabled_create_files_skills ?? [])
      )
      .catch(() => setDisabledSubSkills([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (prevHasChanges.current === true && hasChanges === false) {
      Admin.systemPreferencesByFields(["disabled_create_files_skills"])
        .then((res) =>
          setDisabledSubSkills(
            res?.settings?.disabled_create_files_skills ?? []
          )
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

  const pptxSkills = CREATE_FILE_SUB_SKILLS.filter(
    (s) => s.category === "pptx"
  );
  const textSkills = CREATE_FILE_SUB_SKILLS.filter(
    (s) => s.category === "text"
  );
  const pdfSkills = CREATE_FILE_SUB_SKILLS.filter((s) => s.category === "pdf");
  const xlsxSkills = CREATE_FILE_SUB_SKILLS.filter(
    (s) => s.category === "xlsx"
  );
  const docxSkills = CREATE_FILE_SUB_SKILLS.filter(
    (s) => s.category === "docx"
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
        <div className="flex flex-col gap-y-1">
          <p className="text-theme-text-secondary text-opacity-60 text-xs font-medium">
            {t("agent.skill.createFiles.description")}
          </p>
        </div>

        {enabled && (
          <>
            <input
              name="system::disabled_create_files_skills"
              type="hidden"
              value={disabledSubSkills.join(",")}
            />
            <div className="flex flex-col mt-2 gap-y-4">
              <div className="flex justify-between items-center">
                <p className="text-theme-text-primary font-semibold text-sm">
                  {t("agent.skill.createFiles.configuration")}
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
                    <p className="text-theme-text-secondary text-xs font-medium uppercase tracking-wide flex items-center gap-x-1">
                      <FileText size={12} weight="fill" />
                      {t("agent.skill.createFiles.textActions")}
                    </p>
                    <div className="flex flex-col gap-y-1">
                      {textSkills.map((subSkill) => (
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
                      <FilePpt size={12} weight="fill" />
                      {t("agent.skill.createFiles.pptxActions")}
                    </p>
                    <div className="flex flex-col gap-y-1">
                      {pptxSkills.map((subSkill) => (
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
                      <FilePdf size={12} weight="fill" />
                      {t("agent.skill.createFiles.pdfActions")}
                    </p>
                    <div className="flex flex-col gap-y-1">
                      {pdfSkills.map((subSkill) => (
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
                      <FileXls size={12} weight="fill" />
                      {t("agent.skill.createFiles.xlsxActions")}
                    </p>
                    <div className="flex flex-col gap-y-1">
                      {xlsxSkills.map((subSkill) => (
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
                      <FileDoc size={12} weight="fill" />
                      {t("agent.skill.createFiles.docxActions")}
                    </p>
                    <div className="flex flex-col gap-y-1">
                      {docxSkills.map((subSkill) => (
                        <SubSkillRow
                          key={subSkill.name}
                          subSkill={subSkill}
                          disabled={disabledSubSkills.includes(subSkill.name)}
                          onToggle={() => toggleSubSkill(subSkill.name)}
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

function SubSkillRow({ subSkill, disabled, onToggle }) {
  const Icon = subSkill.icon;
  return (
    <div
      className={`flex items-center justify-between p-2 rounded-lg border ${
        disabled
          ? "bg-theme-bg-secondary/30 border-theme-sidebar-border/30"
          : "bg-theme-bg-secondary/50 border-theme-sidebar-border/50"
      }`}
    >
      <div className="flex items-center gap-x-2">
        <Icon size={16} className="text-slate-100" weight="bold" />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-100">
            {subSkill.title}
          </span>
          <span className="text-xs text-slate-100/50">
            {subSkill.description}
          </span>
        </div>
      </div>
      <SimpleToggleSwitch enabled={!disabled} onChange={onToggle} size="md" />
    </div>
  );
}
