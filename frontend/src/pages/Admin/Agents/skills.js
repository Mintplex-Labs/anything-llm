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
    titleKey: "agent.skill.rag.title",
    descriptionKey: "agent.skill.rag.description",
    component: DefaultSkillPanel,
    icon: Brain,
    image: RAGImage,
    skill: "rag-memory",
  },
  "document-summarizer": {
    titleKey: "agent.skill.view.title",
    descriptionKey: "agent.skill.view.description",
    component: DefaultSkillPanel,
    icon: File,
    image: SummarizeImage,
    skill: "document-summarizer",
  },
  "web-scraping": {
    titleKey: "agent.skill.scrape.title",
    descriptionKey: "agent.skill.scrape.description",
    component: DefaultSkillPanel,
    icon: Browser,
    image: ScrapeWebsitesImage,
    skill: "web-scraping",
  },
};

export const configurableSkills = {
  "save-file-to-browser": {
    titleKey: "agent.skill.save.title",
    descriptionKey: "agent.skill.save.description",
    component: GenericSkillPanel,
    skill: "save-file-to-browser",
    icon: FileMagnifyingGlass,
    image: GenerateSaveImages,
  },
  "create-chart": {
    titleKey: "agent.skill.generate.title",
    descriptionKey: "agent.skill.generate.description",
    component: GenericSkillPanel,
    skill: "create-chart",
    icon: ChartBar,
    image: GenerateChartsImage,
  },
  "web-browsing": {
    titleKey: "agent.skill.web.title",
    descriptionKey: "agent.skill.web.description",
    component: AgentWebSearchSelection,
    skill: "web-browsing",
  },
  "sql-agent": {
    titleKey: "agent.skill.sql.title",
    descriptionKey: "agent.skill.sql.description",
    component: AgentSQLConnectorSelection,
    skill: "sql-agent",
  },
};
