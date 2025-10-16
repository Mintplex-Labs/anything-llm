import React, { useEffect, useState } from "react";
import paths from "@/utils/paths";
import { isMobile } from "react-device-detect";
import useUser from "@/hooks/useUser";
import Appearance from "@/models/appearance";
import useLogo from "@/hooks/useLogo";
import Workspace from "@/models/workspace";
import { NavLink } from "react-router-dom";
import { LAST_VISITED_WORKSPACE } from "@/utils/constants";
import { useTranslation } from "react-i18next";
import { safeJsonParse } from "@/utils/request";

export default function DefaultChatContainer() {
  const { t } = useTranslation();
  const { user } = useUser();
  const { logo } = useLogo();
  const [lastVisitedWorkspace, setLastVisitedWorkspace] = useState(null);
  const [{ workspaces, loading }, setWorkspaces] = useState({
    workspaces: [],
    loading: true,
  });

  useEffect(() => {
    async function fetchWorkspaces() {
      const availableWorkspaces = await Workspace.all();
      const serializedLastVisitedWorkspace = localStorage.getItem(
        LAST_VISITED_WORKSPACE
      );
      if (!serializedLastVisitedWorkspace)
        return setWorkspaces({
          workspaces: availableWorkspaces,
          loading: false,
        });

      try {
        const lastVisitedWorkspace = safeJsonParse(
          serializedLastVisitedWorkspace,
          null
        );
        if (lastVisitedWorkspace == null) throw new Error("Non-parseable!");
        const isValid = availableWorkspaces.some(
          (ws) => ws.slug === lastVisitedWorkspace?.slug
        );
        if (!isValid) throw new Error("Invalid value!");
        setLastVisitedWorkspace(lastVisitedWorkspace);
      } catch {
        localStorage.removeItem(LAST_VISITED_WORKSPACE);
      } finally {
        setWorkspaces({ workspaces: availableWorkspaces, loading: false });
      }
    }
    fetchWorkspaces();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="w-full h-full flex flex-col items-center justify-center overflow-y-auto no-scroll">
          {/* Logo skeleton */}
          <div className="w-[140px] h-[140px] mb-5 rounded-lg bg-theme-bg-primary animate-pulse" />
          {/* Title skeleton */}
          <div className="w-48 h-6 mb-4 rounded bg-theme-bg-primary animate-pulse" />
          {/* Paragraph skeleton */}
          <div className="w-80 h-4 mb-2 rounded bg-theme-bg-primary animate-pulse" />
          <div className="w-64 h-4 rounded bg-theme-bg-primary animate-pulse" />
          {/* Button skeleton */}
          <div className="mt-[29px] w-40 h-[34px] rounded-lg bg-theme-bg-primary animate-pulse" />
        </div>
      </Layout>
    );
  }

  const hasWorkspaces = workspaces.length > 0;
  return (
    <Layout>
      <div className="w-full h-full flex flex-col items-center justify-center overflow-y-auto no-scroll">
        <img
          src={logo}
          alt="Custom Logo"
          className=" w-[200px] h-fit mb-5 rounded-lg"
        />
        <h1 className="text-white text-2xl font-semibold">
          {t("home.welcome")}, {user.username}!
        </h1>
        <p className="text-theme-home-text-secondary text-base text-center whitespace-pre-line">
          {hasWorkspaces ? t("home.chooseWorkspace") : t("home.notAssigned")}
        </p>
        {hasWorkspaces && (
          <NavLink
            to={paths.workspace.chat(
              lastVisitedWorkspace?.slug || workspaces[0].slug
            )}
            className="text-sm font-medium mt-[10px] w-fit px-4 h-[34px] flex items-center justify-center rounded-lg cursor-pointer bg-theme-home-button-secondary hover:bg-theme-home-button-secondary-hover text-theme-home-button-secondary-text hover:text-theme-home-button-secondary-hover-text transition-all duration-200"
          >
            {t("home.goToWorkspace", {
              workspace: lastVisitedWorkspace?.name || workspaces[0].name,
            })}{" "}
            &rarr;
          </NavLink>
        )}
      </div>
    </Layout>
  );
}

const Layout = ({ children }) => {
  const { showScrollbar } = Appearance.getSettings();
  return (
    <div
      style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
      className={`relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary light:border-[1px] light:border-theme-sidebar-border w-full h-full overflow-y-scroll ${showScrollbar ? "show-scrollbar" : "no-scroll"}`}
    >
      {children}
    </div>
  );
};
