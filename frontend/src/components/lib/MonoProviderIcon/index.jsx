/* eslint-disable react-hooks/static-components */
// https://lobehub.com/icons for all the icons
import OpenAI from "@lobehub/icons/es/OpenAI/components/Mono";
import Anthropic from "@lobehub/icons/es/Anthropic/components/Mono";
import Google from "@lobehub/icons/es/Google/components/Mono";
import Gemma from "@lobehub/icons/es/Gemma/components/Mono";
import Gemini from "@lobehub/icons/es/Gemini/components/Mono";
import Microsoft from "@lobehub/icons/es/Microsoft/components/Mono";
import Meta from "@lobehub/icons/es/Meta/components/Mono";
import Mistral from "@lobehub/icons/es/Mistral/components/Mono";
import Azure from "@lobehub/icons/es/Azure/components/Mono";
import AzureAI from "@lobehub/icons/es/AzureAI/components/Mono";
import DeepSeek from "@lobehub/icons/es/DeepSeek/components/Mono";
import HuggingFace from "@lobehub/icons/es/HuggingFace/components/Mono";
import Qwen from "@lobehub/icons/es/Qwen/components/Mono";
import IBM from "@lobehub/icons/es/IBM/components/Mono";
import Bytedance from "@lobehub/icons/es/ByteDance/components/Mono";
import Kimi from "@lobehub/icons/es/Kimi/components/Mono";
import Snowflake from "@lobehub/icons/es/Snowflake/components/Mono";
import Liquid from "@lobehub/icons/es/Liquid/components/Mono";

// Direct provider key -> icon mapping for exact matches
const providerIcons = {
  openai: OpenAI,
  anthropic: Anthropic,
  google: Google,
  microsoft: Microsoft,
  gemma: Gemma,
  gemini: Gemini,
  meta: Meta,
  mistral: Mistral,
  azure: Azure,
  azureai: AzureAI,
  deepseek: DeepSeek,
  huggingface: HuggingFace,
  qwen: Qwen,
  qwq: Qwen,
  ibm: IBM,
  bytedance: Bytedance,
  kimi: Kimi,
  liquid: Liquid,
};

// Pattern matching rules: regex pattern -> icon component
// These are checked in order, first match wins
const modelPatterns = [
  { pattern: /^gpt/i, icon: OpenAI },
  { pattern: /^o\d+/i, icon: OpenAI }, // o1, o3, etc.
  { pattern: /^claude-/i, icon: Anthropic },
  { pattern: /^gemini-/i, icon: Gemini },
  { pattern: /gemma/i, icon: Gemma },
  { pattern: /llama/i, icon: Meta },
  { pattern: /^meta/i, icon: Meta },
  {
    pattern: /^(mistral|devstral|mixtral|magistral|codestral|ministral)/i,
    icon: Mistral,
  },
  { pattern: /^deepseek/i, icon: DeepSeek },
  { pattern: /^qwen/i, icon: Qwen },
  { pattern: /^qwq/i, icon: Qwen },
  { pattern: /^phi/i, icon: Microsoft },
  { pattern: /^granite/i, icon: IBM },
  { pattern: /^doubao/i, icon: Bytedance },
  { pattern: /^moonshot/i, icon: Kimi },
  { pattern: /^smol/i, icon: HuggingFace },
  { pattern: /^seed/i, icon: Bytedance },
  { pattern: /^kimi/i, icon: Kimi },
  { pattern: /^snowflake/i, icon: Snowflake },
  { pattern: /^lfm/i, icon: Liquid },
];

/**
 * Find icon by matching model name against known patterns
 * @param {string} modelName - The model name to match
 * @returns {React.ComponentType|null}
 */
function findIconByModelName(modelName) {
  if (!modelName) return null;
  const match = modelPatterns.find(({ pattern }) => pattern.test(modelName));
  return match?.icon || null;
}

/**
 * @param {object} props - The props of the component.
 * @param {string} props.provider - The provider key (for exact match) or model name (for pattern match).
 * @param {('exact'|'pattern')} props.match - Match mode: 'exact' for provider key, 'pattern' for model name matching.
 * @param {number} props.size - The size of the icon.
 * @param {string} props.className - The class name of the icon.
 * @param {string} props.fallbackIconKey - The key of the fallback icon to use if no icon is found.
 * @returns {React.ReactNode}
 */
export default function MonoProviderIcon({
  provider,
  match = "exact",
  size = 24,
  className = "",
  fallbackIconKey = null,
}) {
  let Icon = null;

  if (match === "exact") Icon = providerIcons[provider?.toLowerCase()];
  else if (match === "pattern") Icon = findIconByModelName(provider);
  if (!Icon && fallbackIconKey && providerIcons[fallbackIconKey])
    Icon = providerIcons[fallbackIconKey];
  if (!Icon) return null;
  return <Icon size={size} className={className} />;
}
