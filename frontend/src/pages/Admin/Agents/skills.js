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
  ListMagnifyingGlass,
  Database
} from "@phosphor-icons/react";
import RAGImage from "@/media/agents/rag-memory.png";
import SummarizeImage from "@/media/agents/view-summarize.png";
import ScrapeWebsitesImage from "@/media/agents/scrape-websites.png";
import GenerateChartsImage from "@/media/agents/generate-charts.png";
import GenerateSaveImages from "@/media/agents/generate-save-files.png";
import WebsearchImage from "@/media/agents/scrape-websites.png";
import ConnectorImage from "@/media/agents/sql-agent.png";
import { useTranslation } from "react-i18next";

export const defaultSkills = () => {
  const { t } = useTranslation();

  return {
    "rag-memory": {
      title: t("agent.skill.rag.title"),
      description: t("agent.skill.rag.description"),
      component: DefaultSkillPanel,
      icon: Brain,
      image: RAGImage,
    },
    "view-summarize": {
      title: t("agent.skill.view.title"),
      description: t("agent.skill.view.description"),
      component: DefaultSkillPanel,
      icon: File,
      image: SummarizeImage,
    },
    "scrape-websites": {
      title: t("agent.skill.scrape.title"),
      description: t("agent.skill.scrape.description"),
      component: DefaultSkillPanel,
      icon: Browser,
      image: ScrapeWebsitesImage,
    },
  };
};

export const configurableSkills = () => {
  const { t } = useTranslation();

  return {
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
      icon: ListMagnifyingGlass,
      image: WebsearchImage
    },
    "sql-agent": {
      title: t("agent.skill.connector.title"),
      description: t("agent.skill.connector.description"),
      component: AgentSQLConnectorSelection,
      skill: "sql-agent",
      icon: Database,
      image: ConnectorImage
    },
  };
};
