import React, { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { AuthProvider } from "@/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import i18n from "./i18n";

import { PfpProvider } from "./PfpContext";
import { LogoProvider } from "./LogoContext";
import { VisibilityProvider } from "./VisibilityContext";
import { FullScreenLoader } from "./components/Preloader";
import { ThemeProvider } from "./ThemeContext";
import { PWAModeProvider } from "./PWAContext";
import KeyboardShortcutsHelp from "@/components/KeyboardShortcutsHelp";
import ImageLightbox from "@/components/ImageLightbox";
import { PreviewProvider } from "@/components/DocumentPreview/PreviewContext";
import { ErrorBoundary } from "react-error-boundary";
import ErrorBoundaryFallback from "./components/ErrorBoundaryFallback";

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
              <VisibilityProvider>
                <LogoProvider>
                  <PfpProvider>
                    <I18nextProvider i18n={i18n}>
                      <PreviewProvider>
                        <Outlet />
                        <ToastContainer />
                        <KeyboardShortcutsHelp />
                        <ImageLightbox />
                      </PreviewProvider>
                    </I18nextProvider>
                  </PfpProvider>
                </LogoProvider>
              </VisibilityProvider>
            </AuthProvider>
          </Suspense>
        </PWAModeProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
