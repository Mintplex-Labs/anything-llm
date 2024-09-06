import AgentWebSearchSelection from "./WebSearchSelection";
import AgentSQLConnectorSelection from "./SQLConnectorSelection";
import GenericSkillPanel from "./GenericSkillPanel";
import DefaultSkillPanel from "./DefaultSkillPanel";
import {
  Brain,
  File,
  Browser,
  ChartBar,
  FileMagnifyingGlass,
} from "@phosphor-icons/react";
import RAGImage from "@/media/agents/rag-memory.png";
import SummarizeImage from "@/media/agents/view-summarize.png";
import ScrapeWebsitesImage from "@/media/agents/scrape-websites.png";
import GenerateChartsImage from "@/media/agents/generate-charts.png";
import GenerateSaveImages from "@/media/agents/generate-save-files.png";

export const defaultSkills = {
  "rag-memory": {
    title: "agentSkills.rag-memory.title",
    description: "agentSkills.rag-memory.description",
    component: DefaultSkillPanel,
    icon: Brain,
    image: RAGImage,
  },
  "view-summarize": {
    title: "agentSkills.view-summarize.title",
    description: "agentSkills.view-summarize.description",
    component: DefaultSkillPanel,
    icon: File,
    image: SummarizeImage,
  },
  "scrape-websites": {
    title: "agentSkills.scrape-websites.title",
    description: "agentSkills.scrape-websites.description",
    component: DefaultSkillPanel,
    icon: Browser,
    image: ScrapeWebsitesImage,
  },
};

export const configurableSkills = {
  "save-file-to-browser": {
    title: "agentSkills.save-file-to-browser.title",
    description: "agentSkills.save-file-to-browser.description",
    component: GenericSkillPanel,
    skill: "agentSkills.save-file-to-browser.skill",
    icon: FileMagnifyingGlass,
    image: GenerateSaveImages,
  },
  "create-chart": {
    title: "agentSkills.create-chart.title",
    description: "agentSkills.create-chart.description",
    component: GenericSkillPanel,
    skill: "agentSkills.create-chart.skill",
    icon: ChartBar,
    image: GenerateChartsImage,
  },
  "web-browsing": {
    title: "agentSkills.web-browsing.title",
    component: AgentWebSearchSelection,
    skill: "agentSkills.web-browsing.skill",
  },
  "sql-agent": {
    title: "agentSkills.sql-agent.title",
    component: AgentSQLConnectorSelection,
    skill: "agentSkills.sql-agent.skill",
  },
};
