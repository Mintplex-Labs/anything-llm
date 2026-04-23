import {
  MagnifyingGlass,
  EnvelopeOpen,
  PaperPlaneTilt,
  ChartBar,
  PencilSimple,
} from "@phosphor-icons/react";
export { filterSkillCategories } from "../utils";

export const getGmailSkills = (t) => ({
  search: {
    title: t("agent.skill.gmail.categories.search.title"),
    description: t("agent.skill.gmail.categories.search.description"),
    icon: MagnifyingGlass,
    skills: [
      {
        name: "gmail-get-inbox",
        title: t("agent.skill.gmail.skills.getInbox.title"),
        description: t("agent.skill.gmail.skills.getInbox.description"),
      },
      {
        name: "gmail-search",
        title: t("agent.skill.gmail.skills.search.title"),
        description: t("agent.skill.gmail.skills.search.description"),
      },
      {
        name: "gmail-read-thread",
        title: t("agent.skill.gmail.skills.readThread.title"),
        description: t("agent.skill.gmail.skills.readThread.description"),
      },
    ],
  },
  drafts: {
    title: t("agent.skill.gmail.categories.drafts.title"),
    description: t("agent.skill.gmail.categories.drafts.description"),
    icon: PencilSimple,
    skills: [
      {
        name: "gmail-create-draft",
        title: t("agent.skill.gmail.skills.createDraft.title"),
        description: t("agent.skill.gmail.skills.createDraft.description"),
      },
      {
        name: "gmail-create-draft-reply",
        title: t("agent.skill.gmail.skills.createDraftReply.title"),
        description: t("agent.skill.gmail.skills.createDraftReply.description"),
      },
      {
        name: "gmail-update-draft",
        title: t("agent.skill.gmail.skills.updateDraft.title"),
        description: t("agent.skill.gmail.skills.updateDraft.description"),
      },
      {
        name: "gmail-get-draft",
        title: t("agent.skill.gmail.skills.getDraft.title"),
        description: t("agent.skill.gmail.skills.getDraft.description"),
      },
      {
        name: "gmail-list-drafts",
        title: t("agent.skill.gmail.skills.listDrafts.title"),
        description: t("agent.skill.gmail.skills.listDrafts.description"),
      },
      {
        name: "gmail-delete-draft",
        title: t("agent.skill.gmail.skills.deleteDraft.title"),
        description: t("agent.skill.gmail.skills.deleteDraft.description"),
      },
      {
        name: "gmail-send-draft",
        title: t("agent.skill.gmail.skills.sendDraft.title"),
        description: t("agent.skill.gmail.skills.sendDraft.description"),
      },
    ],
  },
  send: {
    title: t("agent.skill.gmail.categories.send.title"),
    description: t("agent.skill.gmail.categories.send.description"),
    icon: PaperPlaneTilt,
    skills: [
      {
        name: "gmail-send-email",
        title: t("agent.skill.gmail.skills.sendEmail.title"),
        description: t("agent.skill.gmail.skills.sendEmail.description"),
      },
      {
        name: "gmail-reply-to-thread",
        title: t("agent.skill.gmail.skills.replyToThread.title"),
        description: t("agent.skill.gmail.skills.replyToThread.description"),
      },
    ],
  },
  threads: {
    title: t("agent.skill.gmail.categories.threads.title"),
    description: t("agent.skill.gmail.categories.threads.description"),
    icon: EnvelopeOpen,
    skills: [
      {
        name: "gmail-mark-read",
        title: t("agent.skill.gmail.skills.markRead.title"),
        description: t("agent.skill.gmail.skills.markRead.description"),
      },
      {
        name: "gmail-mark-unread",
        title: t("agent.skill.gmail.skills.markUnread.title"),
        description: t("agent.skill.gmail.skills.markUnread.description"),
      },
      {
        name: "gmail-move-to-trash",
        title: t("agent.skill.gmail.skills.moveToTrash.title"),
        description: t("agent.skill.gmail.skills.moveToTrash.description"),
      },
      {
        name: "gmail-move-to-archive",
        title: t("agent.skill.gmail.skills.moveToArchive.title"),
        description: t("agent.skill.gmail.skills.moveToArchive.description"),
      },
      {
        name: "gmail-move-to-inbox",
        title: t("agent.skill.gmail.skills.moveToInbox.title"),
        description: t("agent.skill.gmail.skills.moveToInbox.description"),
      },
    ],
  },
  account: {
    title: t("agent.skill.gmail.categories.account.title"),
    description: t("agent.skill.gmail.categories.account.description"),
    icon: ChartBar,
    skills: [
      {
        name: "gmail-get-mailbox-stats",
        title: t("agent.skill.gmail.skills.getMailboxStats.title"),
        description: t("agent.skill.gmail.skills.getMailboxStats.description"),
      },
    ],
  },
});
