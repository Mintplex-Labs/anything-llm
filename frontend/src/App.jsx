import React, { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { I18nextProvider, useTranslation } from "react-i18next";
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
import ImageLightbox from "@/components/ImageLightbox";
import { ErrorBoundary } from "react-error-boundary";
import ErrorBoundaryFallback from "./components/ErrorBoundaryFallback";
import { ChatThreadDraftProvider } from "@/contexts/ChatThreadDraftProvider";

export default function App() {
  const location = useLocation();
  return (
    <ErrorBoundary
      FallbackComponent={ErrorBoundaryFallback}
      onError={console.error}
      resetKeys={[location.pathname]}
    >
      <ThemeProvider>
        <PWAModeProvider>
          <Suspense fallback={<FullScreenLoader />}>
            <AuthProvider>
              <LogoProvider>
                <PfpProvider>
                  <I18nextProvider i18n={i18n}>
                    <ChatThreadDraftProvider>
                      <DefaultDocumentTitle />
                      <Outlet />
                      <ToastContainer />
                      <KeyboardShortcutsHelp />
                      <ImageLightbox />
                    </ChatThreadDraftProvider>
                  </I18nextProvider>
                </PfpProvider>
              </LogoProvider>
            </AuthProvider>
          </Suspense>
        </PWAModeProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

function DefaultDocumentTitle() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const defaultTitles = new Set([
      "AnythingLLM",
      "AnythingLLM | Your personal LLM trained on anything",
      "向量知识库",
    ]);
    if (defaultTitles.has(document.title)) {
      document.title = t("common.defaultSiteTitle");
    }
  }, [i18n.language, t]);

  return null;
}
