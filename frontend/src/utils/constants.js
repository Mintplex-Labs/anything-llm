import {
  BookOpen,
  Briefcase,
  DiscordLogo,
  Envelope,
  GithubLogo,
  Globe,
  HouseLine,
  Info,
  LinkSimple,
} from "@phosphor-icons/react";

export const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export const AUTH_USER = "anythingllm_user";
export const AUTH_TOKEN = "anythingllm_authToken";
export const AUTH_TIMESTAMP = "anythingllm_authTimestamp";
export const COMPLETE_QUESTIONNAIRE = "anythingllm_completed_questionnaire";

export const USER_BACKGROUND_COLOR = "bg-historical-msg-user";
export const AI_BACKGROUND_COLOR = "bg-historical-msg-system";

export function fullApiUrl() {
  if (API_BASE !== "/api") return API_BASE;
  return `${window.location.origin}/api`;
}

export const ICON_COMPONENTS = {
  BookOpen: BookOpen,
  DiscordLogo: DiscordLogo,
  GithubLogo: GithubLogo,
  Envelope: Envelope,
  LinkSimple: LinkSimple,
  HouseLine: HouseLine,
  Globe: Globe,
  Briefcase: Briefcase,
  Info: Info,
};
