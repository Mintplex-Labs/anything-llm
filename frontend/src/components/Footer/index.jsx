import System from "@/models/system";
import paths from "@/utils/paths";
import {
  BookOpen,
  DiscordLogo,
  GithubLogo,
  Briefcase,
  Envelope,
  Globe,
  HouseLine,
  Info,
  LinkSimple,
} from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import SettingsButton from "../SettingsButton";
import { isMobile } from "react-device-detect";
import { Tooltip } from "react-tooltip";
import { v4 } from "uuid";

export const MAX_ICONS = 3;
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

export default function Footer() {
  const [footerData, setFooterData] = useState(false);

  useEffect(() => {
    async function fetchFooterData() {
      const { footerData } = await System.fetchCustomFooterIcons();
      setFooterData(footerData);
    }
    fetchFooterData();
  }, []);

  // wait for some kind of non-false response from footer data first
  // to prevent pop-in.
  if (footerData === false) return null;

  if (!Array.isArray(footerData) || footerData.length === 0) {
    return (
      <div className="flex justify-center mb-2">
        <div className="flex space-x-4">
          <ToolTipWrapper id="open-github">
            <a
              href={paths.github()}
              target="_blank"
              rel="noreferrer"
              className="transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
              aria-label="Find us on Github"
              data-tooltip-id="open-github"
              data-tooltip-content="View source code on Github"
            >
              <GithubLogo weight="fill" className="h-5 w-5 " />
            </a>
          </ToolTipWrapper>
          <ToolTipWrapper id="open-documentation">
            <a
              href={paths.docs()}
              target="_blank"
              rel="noreferrer"
              className="w-fit transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
              aria-label="Docs"
              data-tooltip-id="open-documentation"
              data-tooltip-content="Open AnythingLLM help docs"
            >
              <BookOpen weight="fill" className="h-5 w-5 " />
            </a>
          </ToolTipWrapper>
          <ToolTipWrapper id="open-discord">
            <a
              href={paths.discord()}
              target="_blank"
              rel="noreferrer"
              className="transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
              aria-label="Join our Discord server"
              data-tooltip-id="open-discord"
              data-tooltip-content="Join the AnythingLLM Discord"
            >
              <DiscordLogo
                weight="fill"
                className="h-5 w-5 stroke-slate-200 group-hover:stroke-slate-200"
              />
            </a>
          </ToolTipWrapper>
          {!isMobile && <SettingsButton />}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center mb-2">
      <div className="flex space-x-4">
        {footerData.map((item, index) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
          >
            {React.createElement(
              ICON_COMPONENTS?.[item.icon] ?? ICON_COMPONENTS.Info,
              {
                weight: "fill",
                className: "h-5 w-5",
              }
            )}
          </a>
        ))}
        {!isMobile && <SettingsButton />}
      </div>
    </div>
  );
}

export function ToolTipWrapper({ id = v4(), children }) {
  return (
    <div className="flex w-fit">
      {children}
      <Tooltip
        id={id}
        place="top"
        delayShow={300}
        className="tooltip !text-xs z-99"
      />
    </div>
  );
}
