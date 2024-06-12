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
    title: "RAG & long-term memory",
    description:
      'Allow the agent to leverage your local documents to answer a query or ask the agent to "remember" pieces of content for long-term memory retrieval.',
    component: DefaultSkillPanel,
    icon: Brain,
    image: RAGImage,
  },
  "view-summarize": {
    title: "View & summarize documents",
    description:
      "Allow the agent to list and summarize the content of workspace files currently embedded.",
    component: DefaultSkillPanel,
    icon: File,
    image: SummarizeImage,
  },
  "scrape-websites": {
    title: "Scrape websites",
    description: "Allow the agent to visit and scrape the content of websites.",
    component: DefaultSkillPanel,
    icon: Browser,
    image: ScrapeWebsitesImage,
  },
};

export const configurableSkills = {
  "save-file-to-browser": {
    title: "Generate & save files to browser",
    description:
      "Enable the default agent to generate and write to files that can be saved to your computer.",
    component: GenericSkillPanel,
    skill: "save-file-to-browser",
    icon: FileMagnifyingGlass,
    image: GenerateSaveImages,
  },
  "create-chart": {
    title: "Generate charts",
    description:
      "Enable the default agent to generate various types of charts from data provided or given in chat.",
    component: GenericSkillPanel,
    skill: "create-chart",
    icon: ChartBar,
    image: GenerateChartsImage,
  },
  "web-browsing": {
    title: "Web Search",
    component: AgentWebSearchSelection,
    skill: "web-browsing",
  },
  "sql-agent": {
    title: "SQL Connector",
    component: AgentSQLConnectorSelection,
    skill: "sql-agent",
  },
};
