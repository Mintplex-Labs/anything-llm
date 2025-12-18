import { useState, useEffect } from "react";
import System from "@/models/system";
import { LLM_PROVIDER_PRIVACY_MAP } from "@/utils/constants";
import { EMBEDDING_ENGINE_PROVIDER_PRIVACY_MAP } from "@/utils/constants";
import { VECTOR_DB_PROVIDER_PRIVACY_MAP } from "@/utils/constants";
import { ArrowSquareOut } from "@phosphor-icons/react";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import { Link } from "react-router-dom";

export default function ProviderPrivacy() {
  const [providers, setProviders] = useState({
    llmProvider: "openai",
    embeddingEngine: "openai",
    vectorDb: "lancedb",
  });

  useEffect(() => {
    async function fetchProviders() {
      const _settings = await System.keys();
      setProviders({
        llmProvider: _settings?.LLMProvider || "openai",
        embeddingEngine: _settings?.EmbeddingEngine || "openai",
        vectorDb: _settings?.VectorDB || "lancedb",
      });
    }
    fetchProviders();
  }, []);

  const LLMProvider = LLM_PROVIDER_PRIVACY_MAP[providers.llmProvider] || {
    name: "Unknown",
    description: [
      `"${providers.llmProvider}" has no known data handling policy defined in AnythingLLM`,
    ],
    logo: AnythingLLMIcon,
  };
  const EmbeddingProvider = EMBEDDING_ENGINE_PROVIDER_PRIVACY_MAP[
    providers.embeddingEngine
  ] || {
    name: "Unknown",
    description: [
      `"${providers.embeddingEngine}" has no known data handling policy defined in AnythingLLM`,
    ],
    logo: AnythingLLMIcon,
  };
  const VectorDbProvider = VECTOR_DB_PROVIDER_PRIVACY_MAP[
    providers.vectorDb
  ] || {
    name: "Unknown",
    description: [
      `"${providers.vectorDb}" has no known data handling policy defined in AnythingLLM`,
    ],
    logo: AnythingLLMIcon,
  };
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl">
      <ProviderPrivacyItem
        title="LLM Provider"
        provider={LLMProvider}
        altText="LLM Logo"
      />
      <ProviderPrivacyItem
        title="Embedding Preference"
        provider={EmbeddingProvider}
        altText="Embedding Logo"
      />
      <ProviderPrivacyItem
        title="Vector Database"
        provider={VectorDbProvider}
        altText="Vector DB Logo"
      />
    </div>
  );
}

function ProviderPrivacyItem({ title, provider, altText }) {
  return (
    <div className="flex flex-col items-start gap-y-3 pb-4 border-b border-theme-sidebar-border">
      <div className="text-theme-text-primary text-base font-bold">{title}</div>
      <div className="flex items-start gap-3">
        <img
          src={provider.logo}
          alt={altText}
          className="w-8 h-8 rounded flex-shrink-0 mt-0.5"
        />
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-theme-text-primary text-sm font-semibold">
              {provider.name}
            </span>
          </div>
          {provider.policyUrl ? (
            <div className="text-theme-text-secondary text-sm">
              Your usage, chats, and data are subject to the service&apos;s{" "}
              <Link
                className="text-theme-text-secondary hover:text-theme-text-primary text-sm font-medium underline transition-colors inline-flex items-center gap-1"
                to={provider.policyUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                privacy policy
                <ArrowSquareOut size={12} />
              </Link>
              .
            </div>
          ) : (
            provider.description && (
              <ul className="flex flex-col list-none gap-1">
                {provider.description.map((desc, idx) => (
                  <li key={idx} className="text-theme-text-secondary text-sm">
                    {desc}
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      </div>
    </div>
  );
}
