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
import { Link } from "react-router-dom";

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
          <div className="flex w-fit">
            <Link
              to={paths.github()}
              target="_blank"
              rel="noreferrer"
              className="transition-all duration-300 p-2 rounded-full bg-theme-sidebar-footer-icon hover:bg-theme-sidebar-footer-icon-hover text-[var(--theme-sidebar-footer-icon-fill)]"
              aria-label="Find us on GitHub"
              data-tooltip-id="footer-item"
              data-tooltip-content="View source code on GitHub"
            >
              <GithubLogo weight="fill" className="h-5 w-5" />
            </Link>
          </div>
          <div className="flex w-fit">
            <Link
              to={paths.docs()}
              target="_blank"
              rel="noreferrer"
              className="transition-all duration-300 p-2 rounded-full bg-theme-sidebar-footer-icon hover:bg-theme-sidebar-footer-icon-hover text-[var(--theme-sidebar-footer-icon-fill)]"
              aria-label="Docs"
              data-tooltip-id="footer-item"
              data-tooltip-content="Open OneNew help docs"
            >
              <BookOpen weight="fill" className="h-5 w-5" />
            </Link>
          </div>
          <div className="flex w-fit">
            <Link
              to={paths.discord()}
              target="_blank"
              rel="noreferrer"
              className="transition-all duration-300 p-2 rounded-full bg-theme-sidebar-footer-icon hover:bg-theme-sidebar-footer-icon-hover text-[var(--theme-sidebar-footer-icon-fill)]"
              aria-label="Join our Discord server"
              data-tooltip-id="footer-item"
              data-tooltip-content="Join the OneNew Discord"
            >
              <DiscordLogo weight="fill" className="h-5 w-5" />
            </Link>
          </div>
          {!isMobile && <SettingsButton />}
        </div>
        <Tooltip
          id="footer-item"
          place="top"
          delayShow={300}
          className="tooltip !text-xs z-99"
        />
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
            className="transition-all duration-300 flex w-fit h-fit p-2 p-2 rounded-full bg-theme-sidebar-footer-icon hover:bg-theme-sidebar-footer-icon-hover hover:border-slate-100 text-[var(--theme-sidebar-footer-icon-fill)]"
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
      <Tooltip
        id="footer-item"
        place="top"
        delayShow={300}
        className="tooltip !text-xs z-99"
      />
    </div>
  );
}
