import AgentWebSearchSelection from "./WebSearchSelection";
import AgentSQLConnectorSelection from "./SQLConnectorSelection";
import GenericSkillPanel from "./GenericSkillPanel";
import DefaultSkillPanel from "./DefaultSkillPanel";
import FileSystemSkillPanel from "./FileSystemSkillPanel";
import {
  Brain,
  File,
  Browser,
  ChartBar,
  FileMagnifyingGlass,
  FolderOpen,
} from "@phosphor-icons/react";
import RAGImage from "@/media/agents/rag-memory.png";
import SummarizeImage from "@/media/agents/view-summarize.png";
import ScrapeWebsitesImage from "@/media/agents/scrape-websites.png";
import GenerateChartsImage from "@/media/agents/generate-charts.png";
import GenerateSaveImages from "@/media/agents/generate-save-files.png";
import FileSystemImage from "@/media/agents/file-system.png";

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
  { fileSystemAgentAvailable = true } = {}
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
  "save-file-to-browser": {
    title: t("agent.skill.save.title"),
    description: t("agent.skill.save.description"),
    component: GenericSkillPanel,
    skill: "save-file-to-browser",
    icon: FileMagnifyingGlass,
    image: GenerateSaveImages,
  },
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
