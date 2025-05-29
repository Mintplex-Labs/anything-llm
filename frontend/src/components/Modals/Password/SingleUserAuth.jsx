import React, { useEffect, useState } from "react";
import System from "../../../models/system";
import { AUTH_TOKEN } from "../../../utils/constants";
import paths from "../../../utils/paths";
import ModalWrapper from "@/components/ModalWrapper";
import { useModal } from "@/hooks/useModal";
import RecoveryCodeModal from "@/components/Modals/DisplayRecoveryCodeModal";
import { useTranslation } from "react-i18next";

export default function SingleUserAuth() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [token, setToken] = useState(null);
  const [customAppName, setCustomAppName] = useState(null);

  const {
    isOpen: isRecoveryCodeModalOpen,
    openModal: openRecoveryCodeModal,
    closeModal: closeRecoveryCodeModal,
  } = useModal();

  const handleLogin = async (e) => {
    setError(null);
    setLoading(true);
    e.preventDefault();
    const data = {};
    const form = new FormData(e.target);
    for (var [key, value] of form.entries()) data[key] = value;
    const { valid, token, message, recoveryCodes } =
      await System.requestToken(data);
    if (valid && !!token) {
      setToken(token);
      if (recoveryCodes) {
        setRecoveryCodes(recoveryCodes);
        openRecoveryCodeModal();
      } else {
        window.localStorage.setItem(AUTH_TOKEN, token);
        window.location = paths.home();
      }
    } else {
      setError(message);
      setLoading(false);
    }
    setLoading(false);
  };

  const handleDownloadComplete = () => {
    setDownloadComplete(true);
  };

  useEffect(() => {
    if (downloadComplete && token) {
      window.localStorage.setItem(AUTH_TOKEN, token);
      window.location = paths.home();
    }
  }, [downloadComplete, token]);

  useEffect(() => {
    const fetchCustomAppName = async () => {
      const { appName } = await System.fetchCustomAppName();
      setCustomAppName(appName || "");
      setLoading(false);
    };
    fetchCustomAppName();
  }, []);

  return (
    <>
      <form onSubmit={handleLogin}>
        <div className="card-hemp flex flex-col justify-center items-center relative md:shadow-lg md:px-12 py-12 -mt-36 md:-mt-10 bg-white border-hemp-accent">
          <div className="flex items-start justify-between pt-8 pb-6 rounded-t">
            <div className="flex items-center flex-col gap-y-4">
              <div className="flex flex-col items-center gap-y-2">
                <h3 className="text-lg md:text-2xl font-bold text-hemp-text text-center">
                  {t("login.multi-user.welcome")}
                </h3>
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-hemp-primary via-hemp-secondary to-hemp-accent bg-clip-text text-transparent">
                  {customAppName || "HempGPT"}
                </p>
              </div>
              <p className="text-sm text-hemp-earth text-center max-w-md">
                {t("login.sign-in.start")} {customAppName || "HempGPT"}{" "}
                {t("login.sign-in.end")}
              </p>
            </div>
          </div>
          <div className="w-full px-4 md:px-8">
            <div className="w-full flex flex-col gap-y-4">
              <div className="w-full">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-hemp-text mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="input-hemp w-full md:w-[320px] h-[44px]"
                  required={true}
                  autoComplete="off"
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                  Error: {error}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center px-4 md:px-8 mt-8 w-full">
            <button
              disabled={loading}
              type="submit"
              className="btn-hemp w-full md:w-[320px] h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? t("login.multi-user.validating")
                : t("login.multi-user.login")}
            </button>
          </div>
        </div>
      </form>

      <ModalWrapper isOpen={isRecoveryCodeModalOpen} noPortal={true}>
        <RecoveryCodeModal
          recoveryCodes={recoveryCodes}
          onDownloadComplete={handleDownloadComplete}
          onClose={closeRecoveryCodeModal}
        />
      </ModalWrapper>
    </>
  );
}
