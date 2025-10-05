import React from "react";
import { useTranslation } from "react-i18next";
import { User, EnvelopeSimple } from "@phosphor-icons/react";
import { userFromStorage } from "@/utils/request";
import paths from "@/utils/paths";

export default function NoWorkspaceAccess() {
  const { t } = useTranslation();
  const user = userFromStorage();

  return (
    <div className="w-full h-full flex items-center justify-center bg-theme-bg-container">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-theme-button-primary rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-theme-text-primary mb-2">
            {t("noWorkspaceAccess.title")}
          </h1>
          <p className="text-theme-text-secondary mb-6">
            {t("noWorkspaceAccess.description")}
          </p>
        </div>

        <div className="bg-theme-bg-secondary rounded-lg p-4 mb-6">
          <p className="text-sm text-theme-text-secondary mb-3">
            {t("noWorkspaceAccess.nextSteps")}
          </p>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 text-theme-text-primary">
              <span className="w-2 h-2 bg-theme-button-primary rounded-full"></span>
              {t("noWorkspaceAccess.step1")}
            </div>
            <div className="flex items-center gap-2 text-theme-text-primary">
              <span className="w-2 h-2 bg-theme-button-primary rounded-full"></span>
              {t("noWorkspaceAccess.step2")}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href={paths.mailToMintplex()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-theme-button-primary text-white rounded-lg hover:bg-theme-button-primary-hover transition-colors"
          >
            <EnvelopeSimple className="w-4 h-4" />
            {t("noWorkspaceAccess.contactSupport")}
          </a>
          
          {user?.role === "default" && (
            <p className="text-xs text-theme-text-secondary">
              {t("noWorkspaceAccess.userRole", { username: user.username })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
