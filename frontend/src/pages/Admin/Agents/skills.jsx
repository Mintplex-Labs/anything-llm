import AgentWebSearchSelection from "./WebSearchSelection";
import AgentSQLConnectorSelection from "./SQLConnectorSelection";
import GenericSkillPanel from "./GenericSkillPanel";
import DefaultSkillPanel from "./DefaultSkillPanel";
import FileSystemSkillPanel from "./FileSystemSkillPanel";
import CreateFileSkillPanel from "./CreateFileSkillPanel";
import GMailSkillPanel from "./GMailSkillPanel";
import GoogleCalendarSkillPanel from "./GoogleCalendarSkillPanel";
import OutlookSkillPanel from "./OutlookSkillPanel";
import {
  Brain,
  File,
  Browser,
  ChartBar,
  FolderOpen,
  FilePlus,
} from "@phosphor-icons/react";
import RAGImage from "@/media/agents/rag-memory.png";
import SummarizeImage from "@/media/agents/view-summarize.png";
import ScrapeWebsitesImage from "@/media/agents/scrape-websites.png";
import GenerateChartsImage from "@/media/agents/generate-charts.png";
import GenerateSaveImages from "@/media/agents/generate-save-files.png";
import FileSystemImage from "@/media/agents/file-system.png";
import GMailIcon from "./GMailSkillPanel/gmail.png";
import OutlookIcon from "./OutlookSkillPanel/outlook.png";
import GoogleCalendarIcon from "./GoogleCalendarSkillPanel/google-calendar.png";

export const getDefaultSkills = (t) => ({
  "rag-memory": {
    title: t("agent.skill.rag.title"),
    description: t("agent.skill.rag.description"),
    component: DefaultSkillPanel,
    icon: Brain,
    image: RAGImage,
    skill: "rag-memory",
  },
  "document-summarizer": {
    title: t("agent.skill.view.title"),
    description: t("agent.skill.view.description"),
    component: DefaultSkillPanel,
    icon: File,
    image: SummarizeImage,
    skill: "document-summarizer",
  },
  "web-scraping": {
    title: t("agent.skill.scrape.title"),
    description: t("agent.skill.scrape.description"),
    component: DefaultSkillPanel,
    icon: Browser,
    image: ScrapeWebsitesImage,
    skill: "web-scraping",
  },
});

export const getConfigurableSkills = (
  t,
  { fileSystemAgentAvailable = true, createFilesAgentAvailable = true } = {}
) => ({
  ...(fileSystemAgentAvailable && {
    "filesystem-agent": {
      title: t("agent.skill.filesystem.title"),
      description: t("agent.skill.filesystem.description"),
      component: FileSystemSkillPanel,
      skill: "filesystem-agent",
      icon: FolderOpen,
      image: FileSystemImage,
    },
  }),
  ...(createFilesAgentAvailable && {
    "create-files-agent": {
      title: t("agent.skill.createFiles.title"),
      description: t("agent.skill.createFiles.description"),
      component: CreateFileSkillPanel,
      skill: "create-files-agent",
      icon: FilePlus,
      image: GenerateSaveImages,
    },
  }),
  "create-chart": {
    title: t("agent.skill.generate.title"),
    description: t("agent.skill.generate.description"),
    component: GenericSkillPanel,
    skill: "create-chart",
    icon: ChartBar,
    image: GenerateChartsImage,
  },
  "web-browsing": {
    title: t("agent.skill.web.title"),
    description: t("agent.skill.web.description"),
    component: AgentWebSearchSelection,
    skill: "web-browsing",
  },
  "sql-agent": {
    title: t("agent.skill.sql.title"),
    description: t("agent.skill.sql.description"),
    component: AgentSQLConnectorSelection,
    skill: "sql-agent",
  },
});

export const getAppIntegrationSkills = (t) => ({
  "gmail-agent": {
    title: t("agent.skill.gmail.title"),
    description: t("agent.skill.gmail.description"),
    component: GMailSkillPanel,
    skill: "gmail-agent",
    Icon: ({ size }) => (
      <img src={GMailIcon} alt="GMail" width={size} height={size} />
    ),
    mode: ["singleUserOnly"],
  },
  "google-calendar-agent": {
    title: t("agent.skill.googleCalendar.title"),
    description: t("agent.skill.googleCalendar.description"),
    component: GoogleCalendarSkillPanel,
    skill: "google-calendar-agent",
    Icon: ({ size }) => (
      <img
        src={GoogleCalendarIcon}
        alt="Google Calendar"
        width={size}
        height={size}
      />
    ),
    mode: ["singleUserOnly"],
  },
  "outlook-agent": {
    title: t("agent.skill.outlook.title"),
    description: t("agent.skill.outlook.description"),
    component: OutlookSkillPanel,
    skill: "outlook-agent",
    Icon: ({ size }) => (
      <img src={OutlookIcon} alt="Outlook" width={size} height={size} />
    ),
    mode: ["singleUserOnly"],
  },
});
