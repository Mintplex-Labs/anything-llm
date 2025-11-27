import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { AuthProvider } from "@/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import i18n from "./i18n";

import { PfpProvider } from "./PfpContext";
import { LogoProvider } from "./LogoContext";
import { FullScreenLoader } from "./components/Preloader";
import { ThemeProvider } from "./ThemeContext";
import { PWAModeProvider } from "./PWAContext";
import KeyboardShortcutsHelp from "@/components/KeyboardShortcutsHelp";

export default function App() {
  return (
    <ThemeProvider>
      <PWAModeProvider>
        <Suspense fallback={<FullScreenLoader />}>
          <AuthProvider>
            <LogoProvider>
              <PfpProvider>
                <I18nextProvider i18n={i18n}>
                  <Outlet />
                  <ToastContainer />
                  <KeyboardShortcutsHelp />
                </I18nextProvider>
              </PfpProvider>
            </LogoProvider>
          </AuthProvider>
        </Suspense>
      </PWAModeProvider>
    </ThemeProvider>
  );
}
