import RecoveryCodeModal from "@/components/Modals/DisplayRecoveryCodeModal";
import ModalWrapper from "@/components/ModalWrapper";
import useLogo from "@/hooks/useLogo";
import { useModal } from "@/hooks/useModal";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import System from "../../../models/system";
import { AUTH_TOKEN } from "../../../utils/constants";
import paths from "../../../utils/paths";

export default function SingleUserAuth() {
  const { t } = useTranslation();
  const { loginLogo } = useLogo();
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
      <div className="w-full max-w-md rounded-2xl bg-black/30 p-8 shadow-2xl backdrop-blur-lg">
        {/* Logo/Profile Section */}
        <div className="mb-6 flex justify-center">
          {loginLogo ? (
            <img
              src={loginLogo}
              alt="Logo"
              className="w-32 h-32 rounded-full border-4 border-[#3379e4] object-cover"
            />
          ) : (
            <div 
              className="w-32 h-32 rounded-full bg-center bg-no-repeat bg-cover border-4 border-[#3379e4] flex items-center justify-center bg-gradient-to-br from-[#4f33a9] to-[#d92d83]"
            >
              <span className="text-white font-bold text-4xl">
                {(customAppName || 'M').charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Welcome Text */}
        <h2 className="text-white text-center text-2xl font-bold mb-2">
          {customAppName ? `${customAppName}'e Hoş Geldiniz` : 'Money Asistan\'a Hoş Geldiniz'}
        </h2>
        <p className="text-gray-400 text-center mb-8">
          Giriş yapmak için şifrenizi girin.
        </p>

        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label className="sr-only" htmlFor="password">Şifre</label>
            <input
              className="form-input w-full rounded-lg border-2 border-gray-700 bg-gray-800/60 px-4 py-3 text-white placeholder-gray-400 transition-colors focus:border-[#d92d83] focus:ring-0"
              id="password"
              name="password"
              placeholder="Şifre"
              type="password"
              required={true}
              autoComplete="off"
            />
          </div>
          
          {error && (
            <div className="mb-4">
              <p className="text-red-400 text-sm text-center">Hata: {error}</p>
            </div>
          )}
          
          <button 
            className="w-full rounded-lg bg-gradient-to-r from-[#d92d83] to-[#3379e4] py-3 text-base font-bold text-white shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Doğrulanıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>

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
