import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Globe,
  ClockCounterClockwise,
  UserCircle,
} from "@phosphor-icons/react";
import Toggle from "@/components/lib/Toggle";
import useUser from "@/hooks/useUser";
import SessionHistory from "./SessionHistory";
import Profiles from "./Profiles";
import paths from "@/utils/paths";

/**
 * Agent skill panel for Browser Use: the toggle, the history of every session the agent ran
 * (every user's, unless DISABLE_VIEW_CHAT_HISTORY hides them) and the users' saved browser profiles.
 */
export default function BrowserUseSkillPanel({
  title,
  description,
  skill,
  toggleSkill,
  enabled = false,
  disabled = false,
}) {
  const { t } = useTranslation();
  return (
    <div className="p-2">
      <div className="flex flex-col gap-y-[18px] max-w-[560px]">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-x-2">
            <Globe size={24} color="var(--theme-text-primary)" weight="bold" />
            <label className="text-theme-text-primary text-md font-bold">
              {title}
            </label>
          </div>
          <Toggle
            size="lg"
            enabled={enabled}
            disabled={disabled}
            onChange={() => toggleSkill(skill)}
          />
        </div>
        <p className="text-theme-text-secondary text-opacity-60 text-xs font-medium">
          {description}{" "}
          <a
            href={paths.documentation.browserUseDocker()}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-cta-button"
          >
            {t("browserUse.limitations")}
          </a>
        </p>
        <Tabs />
      </div>
    </div>
  );
}

const TABS = [
  { name: "sessions", Icon: ClockCounterClockwise },
  { name: "profiles", Icon: UserCircle },
];

function Tabs() {
  const { t } = useTranslation();
  const { user } = useUser();
  const [tab, setTab] = useState("sessions");
  // Single-user mode has just the one shared profile.
  if (!user) return <SessionHistory />;
  return (
    <div className="flex flex-col gap-y-2">
      <div role="tablist" className="flex border-none w-full">
        {TABS.map(({ name, Icon }) => (
          <button
            key={name}
            type="button"
            role="tab"
            aria-selected={tab === name}
            onClick={() => setTab(name)}
            className={`w-full hover:bg-sky-500/10 light:hover:bg-sky-400/10 rounded-t-lg border-none flex items-center justify-center gap-x-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === name
                ? "border-sky-400 text-sky-500"
                : "border-transparent text-theme-text-secondary hover:text-theme-text-primary"
            }`}
          >
            <Icon size={16} weight="bold" />
            {t(`browserUse.tabs.${name}`)}
          </button>
        ))}
      </div>
      {tab === "sessions" ? <SessionHistory /> : <Profiles />}
    </div>
  );
}
