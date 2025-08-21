/**
 * AppLayout component: renders the primary layout with sidebar navigation and main content area.
 *
 * Props:
 *  - children: ReactNode - page content to display inside the layout.
 *
 * Used to wrap top-level pages, handling responsive sidebar behavior for mobile and desktop.
 */
import React, { type ReactNode } from "react";
import Sidebar, { SidebarMobileHeader } from "@/components/Sidebar";
import { isMobile } from "react-device-detect";
import "@/styles/layout.css";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      {!isMobile ? <Sidebar /> : <SidebarMobileHeader />}
      <div className="flex-1 border-l border-[var(--border)]">
        <main className="container">{children}</main>
      </div>
    </div>
  );
}
