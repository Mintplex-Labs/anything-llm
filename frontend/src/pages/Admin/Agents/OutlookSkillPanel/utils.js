import {
  MagnifyingGlass,
  PaperPlaneTilt,
  ChartBar,
  PencilSimple,
} from "@phosphor-icons/react";
import strDistance from "js-levenshtein";

const LEVENSHTEIN_THRESHOLD = 3;

export const getOutlookSkills = (t) => ({
  search: {
    title: t("agent.skill.outlook.categories.search.title"),
    description: t("agent.skill.outlook.categories.search.description"),
    icon: MagnifyingGlass,
    skills: [
      {
        name: "outlook-get-inbox",
        title: t("agent.skill.outlook.skills.getInbox.title"),
        description: t("agent.skill.outlook.skills.getInbox.description"),
      },
      {
        name: "outlook-search",
        title: t("agent.skill.outlook.skills.search.title"),
        description: t("agent.skill.outlook.skills.search.description"),
      },
      {
        name: "outlook-read-thread",
        title: t("agent.skill.outlook.skills.readThread.title"),
        description: t("agent.skill.outlook.skills.readThread.description"),
      },
    ],
  },
  drafts: {
    title: t("agent.skill.outlook.categories.drafts.title"),
    description: t("agent.skill.outlook.categories.drafts.description"),
    icon: PencilSimple,
    skills: [
      {
        name: "outlook-create-draft",
        title: t("agent.skill.outlook.skills.createDraft.title"),
        description: t("agent.skill.outlook.skills.createDraft.description"),
      },
      {
        name: "outlook-update-draft",
        title: t("agent.skill.outlook.skills.updateDraft.title"),
        description: t("agent.skill.outlook.skills.updateDraft.description"),
      },
      {
        name: "outlook-list-drafts",
        title: t("agent.skill.outlook.skills.listDrafts.title"),
        description: t("agent.skill.outlook.skills.listDrafts.description"),
      },
      {
        name: "outlook-delete-draft",
        title: t("agent.skill.outlook.skills.deleteDraft.title"),
        description: t("agent.skill.outlook.skills.deleteDraft.description"),
      },
      {
        name: "outlook-send-draft",
        title: t("agent.skill.outlook.skills.sendDraft.title"),
        description: t("agent.skill.outlook.skills.sendDraft.description"),
      },
    ],
  },
  send: {
    title: t("agent.skill.outlook.categories.send.title"),
    description: t("agent.skill.outlook.categories.send.description"),
    icon: PaperPlaneTilt,
    skills: [
      {
        name: "outlook-send-email",
        title: t("agent.skill.outlook.skills.sendEmail.title"),
        description: t("agent.skill.outlook.skills.sendEmail.description"),
      },
    ],
  },
  account: {
    title: t("agent.skill.outlook.categories.account.title"),
    description: t("agent.skill.outlook.categories.account.description"),
    icon: ChartBar,
    skills: [
      {
        name: "outlook-get-mailbox-stats",
        title: t("agent.skill.outlook.skills.getMailboxStats.title"),
        description: t(
          "agent.skill.outlook.skills.getMailboxStats.description"
        ),
      },
    ],
  },
});

function skillMatchesSearch(skill, searchTerm) {
  if (!searchTerm) return true;

  const normalizedSearch = searchTerm.toLowerCase().trim();
  const titleLower = skill.title.toLowerCase();
  const descLower = skill.description.toLowerCase();

  if (titleLower.includes(normalizedSearch)) return true;
  if (descLower.includes(normalizedSearch)) return true;
  if (strDistance(titleLower, normalizedSearch) <= LEVENSHTEIN_THRESHOLD)
    return true;

  return false;
}

export function filterSkillCategories(skillCategories, searchTerm) {
  if (!searchTerm) return skillCategories;

  const filtered = {};
  for (const [key, category] of Object.entries(skillCategories)) {
    const matchingSkills = category.skills.filter((skill) =>
      skillMatchesSearch(skill, searchTerm)
    );
    if (matchingSkills.length > 0) {
      filtered[key] = { ...category, skills: matchingSkills };
    }
  }
  return filtered;
}
