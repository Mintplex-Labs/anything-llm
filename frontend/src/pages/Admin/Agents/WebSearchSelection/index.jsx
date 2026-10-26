import React, { useEffect, useState } from "react";
import Admin from "@/models/admin";
import SerpApiIcon from "./icons/serpapi.png";
import SearchApiIcon from "./icons/searchapi.png";
import SerperDotDevIcon from "./icons/serper.png";
import BingSearchIcon from "./icons/bing.png";
import BaiduSearchIcon from "./icons/baidu.png";
import SerplySearchIcon from "./icons/serply.png";
import SearXNGSearchIcon from "./icons/searxng.png";
import TavilySearchIcon from "./icons/tavily.svg";
import DuckDuckGoIcon from "./icons/duckduckgo.png";
import ExaIcon from "./icons/exa.png";
import PerplexitySearchIcon from "./icons/perplexity.png";
import BraveSearchIcon from "./icons/brave.png";
import CrwSearchIcon from "./icons/crw.png";
import YouSearchIcon from "./icons/you.png";
import KeenableSearchIcon from "./icons/keenable.png";
import AnySearchSearchIcon from "./icons/anysearch.png";
import FirecrawlSearchIcon from "./icons/firecrawl.png";
import { ListMagnifyingGlass } from "@phosphor-icons/react";
import Toggle from "@/components/lib/Toggle";
import { DefaultBadge } from "../Badges/default";
import SearchProviderItem from "./SearchProviderItem";
import WebSearchImage from "@/media/agents/scrape-websites.png";
import ProviderSearchMenu from "@/components/lib/ProviderSearchMenu";
import {
  SerpApiOptions,
  SearchApiOptions,
  SerperDotDevOptions,
  BingSearchOptions,
  BaiduSearchOptions,
  SerplySearchOptions,
  SearXNGOptions,
  TavilySearchOptions,
  DuckDuckGoOptions,
  ExaSearchOptions,
  PerplexitySearchOptions,
  BraveSearchOptions,
  CrwSearchOptions,
  YouSearchOptions,
  KeenableSearchOptions,
  AnySearchOptions,
  FirecrawlSearchOptions,
} from "./SearchProviderOptions";

const SEARCH_PROVIDERS = [
  {
    name: "You.com Search",
    value: "you-search",
    logo: YouSearchIcon,
    options: (settings) => <YouSearchOptions settings={settings} />,
    description:
      "LLM-ready web search with no API key required and zero data retention.",
  },
  {
    name: "DuckDuckGo",
    value: "duckduckgo-engine",
    logo: DuckDuckGoIcon,
    options: () => <DuckDuckGoOptions />,
    description: "Free and privacy-focused web search using DuckDuckGo.",
  },
  {
    name: "Brave Search",
    value: "brave-search",
    logo: BraveSearchIcon,
    options: (settings) => <BraveSearchOptions settings={settings} />,
    description: "Web search powered by the Brave Search API.",
  },
  {
    name: "SerpApi",
    value: "serpapi",
    logo: SerpApiIcon,
    options: (settings) => <SerpApiOptions settings={settings} />,
    description:
      "Scrape Google and several other search engines with SerpApi. 250 free searches every month, and then paid.",
  },
  {
    name: "SearchApi",
    value: "searchapi",
    logo: SearchApiIcon,
    options: (settings) => <SearchApiOptions settings={settings} />,
    description:
      "SearchApi delivers structured data from multiple search engines. Free for 100 queries, but then paid. ",
  },
  {
    name: "Serper.dev",
    value: "serper-dot-dev",
    logo: SerperDotDevIcon,
    options: (settings) => <SerperDotDevOptions settings={settings} />,
    description:
      "Serper.dev web-search. Free account with a 2,500 calls, but then paid.",
  },
  {
    name: "Bing Search",
    value: "bing-search",
    logo: BingSearchIcon,
    options: (settings) => <BingSearchOptions settings={settings} />,
    description: "Web search powered by the Bing Search API (paid service).",
  },
  {
    name: "Baidu Search",
    value: "baidu-search",
    logo: BaiduSearchIcon,
    options: (settings) => <BaiduSearchOptions settings={settings} />,
    description:
      "Web search powered by Baidu Search for stronger zh-CN retrieval.",
  },
  {
    name: "Serply.io",
    value: "serply-engine",
    logo: SerplySearchIcon,
    options: (settings) => <SerplySearchOptions settings={settings} />,
    description:
      "Serply.io web-search. Free account with a 100 calls/month forever.",
  },
  {
    name: "SearXNG",
    value: "searxng-engine",
    logo: SearXNGSearchIcon,
    options: (settings) => <SearXNGOptions settings={settings} />,
    description:
      "Free, open-source, internet meta-search engine with no tracking.",
  },
  {
    name: "Tavily Search",
    value: "tavily-search",
    logo: TavilySearchIcon,
    options: (settings) => <TavilySearchOptions settings={settings} />,
    description:
      "Tavily Search API. Offers a free tier with 1000 queries per month.",
  },
  {
    name: "Exa Search",
    value: "exa-search",
    logo: ExaIcon,
    options: (settings) => <ExaSearchOptions settings={settings} />,
    description:
      "One of the best web search APIs for AI agents with real-time results and full page contents.",
  },
  {
    name: "Perplexity Search",
    value: "perplexity-search",
    logo: PerplexitySearchIcon,
    options: (settings) => <PerplexitySearchOptions settings={settings} />,
    description: "AI-powered web search using the Perplexity Search API.",
  },
  {
    name: "fastCRW Search",
    value: "crw-search",
    logo: CrwSearchIcon,
    options: (settings) => <CrwSearchOptions settings={settings} />,
    description: "Open-source, self-hostable Firecrawl/Tavily alternative.",
  },
  {
    name: "Keenable",
    value: "keenable-search",
    logo: KeenableSearchIcon,
    options: (settings) => <KeenableSearchOptions settings={settings} />,
    description: "Web search built for AI agents. No API key required.",
  },
  {
    name: "AnySearch",
    value: "anysearch-search",
    logo: AnySearchSearchIcon,
    options: (settings) => <AnySearchOptions settings={settings} />,
    description: "Real-time web search for AI agents. Requires a free API key.",
  },
  {
    name: "Firecrawl",
    value: "firecrawl-search",
    logo: FirecrawlSearchIcon,
    options: (settings) => <FirecrawlSearchOptions settings={settings} />,
    description: "Web search API for AI agents. Requires a free API key.",
  },
];

export default function AgentWebSearchSelection({
  skill,
  title,
  description,
  settings,
  toggleSkill,
  enabled = true,
  setHasChanges,
}) {
  const [selectedProvider, setSelectedProvider] = useState("you-search");

  function updateChoice(selection) {
    setSelectedProvider(selection);
    setHasChanges(true);
  }

  useEffect(() => {
    Admin.systemPreferencesByFields(["agent_search_provider"])
      .then((res) =>
        setSelectedProvider(
          res?.settings?.agent_search_provider ?? "you-search"
        )
      )
      .catch(() => setSelectedProvider("you-search"));
  }, []);

  const selectedSearchProviderObject =
    SEARCH_PROVIDERS.find((provider) => provider.value === selectedProvider) ??
    SEARCH_PROVIDERS[0];

  return (
    <div className="p-2">
      <div className="flex flex-col gap-y-[18px] max-w-[500px]">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-x-2">
            <ListMagnifyingGlass
              size={24}
              color="var(--theme-text-primary)"
              weight="bold"
            />
            <label
              htmlFor="name"
              className="text-theme-text-primary text-md font-bold"
            >
              {title}
            </label>
            <DefaultBadge title={title} />
          </div>
          <Toggle
            size="lg"
            enabled={enabled}
            onChange={() => toggleSkill(skill)}
          />
        </div>
        <img
          src={WebSearchImage}
          alt="Web Search"
          className="w-full rounded-md"
        />
        <p className="text-theme-text-secondary text-opacity-60 text-xs font-medium py-1.5">
          {description}
        </p>
        <div hidden={!enabled}>
          <div className="relative">
            <input
              type="hidden"
              name="system::agent_search_provider"
              value={selectedProvider}
            />
            <ProviderSearchMenu
              items={SEARCH_PROVIDERS}
              selected={selectedSearchProviderObject}
              placeholder="Search available web-search providers"
              renderItem={(provider, close) => (
                <SearchProviderItem
                  provider={provider}
                  checked={selectedProvider === provider.value}
                  onClick={() => {
                    updateChoice(provider.value);
                    close();
                  }}
                />
              )}
            />
          </div>
          <div className="mt-4 flex flex-col gap-y-1">
            {selectedSearchProviderObject.options(settings)}
          </div>
        </div>
      </div>
    </div>
  );
}
