import RecoveryCodeModal from "@/components/Modals/DisplayRecoveryCodeModal";
import ModalWrapper from "@/components/ModalWrapper";
import useLogo from "@/hooks/useLogo";
import { useModal } from "@/hooks/useModal";
import showToast from "@/utils/toast";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import System from "../../../models/system";
import { AUTH_TOKEN, AUTH_USER } from "../../../utils/constants";
import paths from "../../../utils/paths";

const RecoveryForm = ({ onSubmit, setShowRecoveryForm }) => {
  const { loginLogo } = useLogo();
  const [username, setUsername] = useState("");
  const [recoveryCodeInputs, setRecoveryCodeInputs] = useState(
    Array(2).fill("")
  );

  const handleRecoveryCodeChange = (index, value) => {
    const updatedCodes = [...recoveryCodeInputs];
    updatedCodes[index] = value;
    setRecoveryCodeInputs(updatedCodes);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const recoveryCodes = recoveryCodeInputs.filter(
      (code) => code.trim() !== ""
    );
    onSubmit(username, recoveryCodes);
  };

  return (
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
            <span className="text-white font-bold text-4xl">M</span>
          </div>
        )}
      </div>

      {/* Welcome Text */}
      <h2 className="text-white text-center text-2xl font-bold mb-2">
        Şifre Sıfırlama
      </h2>
      <p className="text-gray-400 text-center mb-8">
        Kurtarma kodlarınız ile şifrenizi sıfırlayabilirsiniz.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="sr-only" htmlFor="username">Kullanıcı Adı</label>
          <input
            className="form-input w-full rounded-lg border-2 border-gray-700 bg-gray-800/60 px-4 py-3 text-white placeholder-gray-400 transition-colors focus:border-[#d92d83] focus:ring-0"
            id="username"
            name="username"
            placeholder="Kullanıcı Adı"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        {recoveryCodeInputs.map((code, index) => (
          <div key={index} className="mb-4">
            <label className="sr-only" htmlFor={`recoveryCode${index + 1}`}>
              Kurtarma Kodu {index + 1}
            </label>
            <input
              className="form-input w-full rounded-lg border-2 border-gray-700 bg-gray-800/60 px-4 py-3 text-white placeholder-gray-400 transition-colors focus:border-[#d92d83] focus:ring-0"
              id={`recoveryCode${index + 1}`}
              name={`recoveryCode${index + 1}`}
              placeholder={`Kurtarma Kodu ${index + 1}`}
              type="text"
              value={code}
              onChange={(e) => handleRecoveryCodeChange(index, e.target.value)}
              required
            />
          </div>
        ))}
        
        <button 
          className="w-full rounded-lg bg-gradient-to-r from-[#d92d83] to-[#3379e4] py-3 text-base font-bold text-white shadow-lg transition-transform hover:scale-105 mb-4" 
          type="submit"
        >
          Şifre Sıfırla
        </button>
      </form>

      <div className="text-center">
        <button
          type="button"
          className="text-sm text-gray-400 hover:text-white hover:underline"
          onClick={() => setShowRecoveryForm(false)}
        >
          Girişe Geri Dön
        </button>
      </div>
    </div>
  );
};

const ResetPasswordForm = ({ onSubmit }) => {
  const { loginLogo } = useLogo();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newPassword, confirmPassword);
  };

  return (
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
            <span className="text-white font-bold text-4xl">M</span>
          </div>
        )}
      </div>

      {/* Welcome Text */}
      <h2 className="text-white text-center text-2xl font-bold mb-2">
        Yeni Şifre Belirleme
      </h2>
      <p className="text-gray-400 text-center mb-8">
        Lütfen yeni şifrenizi belirleyin.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="sr-only" htmlFor="newPassword">Yeni Şifre</label>
          <input
            className="form-input w-full rounded-lg border-2 border-gray-700 bg-gray-800/60 px-4 py-3 text-white placeholder-gray-400 transition-colors focus:border-[#d92d83] focus:ring-0"
            id="newPassword"
            name="newPassword"
            placeholder="Yeni Şifre"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="sr-only" htmlFor="confirmPassword">Şifre Doğrulama</label>
          <input
            className="form-input w-full rounded-lg border-2 border-gray-700 bg-gray-800/60 px-4 py-3 text-white placeholder-gray-400 transition-colors focus:border-[#d92d83] focus:ring-0"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Şifre Doğrulama"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        <button 
          className="w-full rounded-lg bg-gradient-to-r from-[#d92d83] to-[#3379e4] py-3 text-base font-bold text-white shadow-lg transition-transform hover:scale-105" 
          type="submit"
        >
          Şifreyi Güncelle
        </button>
      </form>
    </div>
  );
};

export default function MultiUserAuth() {
  const { t } = useTranslation();
  const { loginLogo } = useLogo();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showRecoveryForm, setShowRecoveryForm] = useState(false);
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
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
    const { valid, user, token, message, recoveryCodes } =
      await System.requestToken(data);
    if (valid && !!token && !!user) {
      setUser(user);
      setToken(token);

      if (recoveryCodes) {
        setRecoveryCodes(recoveryCodes);
        openRecoveryCodeModal();
      } else {
        window.localStorage.setItem(AUTH_USER, JSON.stringify(user));
        window.localStorage.setItem(AUTH_TOKEN, token);
        window.location = paths.home();
      }
    } else {
      setError(message);
      setLoading(false);
    }
    setLoading(false);
  };

  const handleDownloadComplete = () => setDownloadComplete(true);
  const handleResetPassword = () => setShowRecoveryForm(true);
  const handleRecoverySubmit = async (username, recoveryCodes) => {
    const { success, resetToken, error } = await System.recoverAccount(
      username,
      recoveryCodes
    );

    if (success && resetToken) {
      window.localStorage.setItem("resetToken", resetToken);
      setShowRecoveryForm(false);
      setShowResetPasswordForm(true);
    } else {
      showToast(error, "error", { clear: true });
    }
  };

  const handleResetSubmit = async (newPassword, confirmPassword) => {
    const resetToken = window.localStorage.getItem("resetToken");

    if (resetToken) {
      const { success, error } = await System.resetPassword(
        resetToken,
        newPassword,
        confirmPassword
      );

      if (success) {
        window.localStorage.removeItem("resetToken");
        setShowResetPasswordForm(false);
        showToast("Password reset successful", "success", { clear: true });
      } else {
        showToast(error, "error", { clear: true });
      }
    } else {
      showToast("Invalid reset token", "error", { clear: true });
    }
  };

  useEffect(() => {
    if (downloadComplete && user && token) {
      window.localStorage.setItem(AUTH_USER, JSON.stringify(user));
      window.localStorage.setItem(AUTH_TOKEN, token);
      window.location = paths.home();
    }
  }, [downloadComplete, user, token]);

  useEffect(() => {
    const fetchCustomAppName = async () => {
      const { appName } = await System.fetchCustomAppName();
      setCustomAppName(appName || "");
      setLoading(false);
    };
    fetchCustomAppName();
  }, []);

  if (showRecoveryForm) {
    return (
      <RecoveryForm
        onSubmit={handleRecoverySubmit}
        setShowRecoveryForm={setShowRecoveryForm}
      />
    );
  }

  if (showResetPasswordForm)
    return <ResetPasswordForm onSubmit={handleResetSubmit} />;
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
          Giriş yapmak için bilgilerinizi girin.
        </p>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="sr-only" htmlFor="username">Kullanıcı Adı</label>
            <input
              className="form-input w-full rounded-lg border-2 border-gray-700 bg-gray-800/60 px-4 py-3 text-white placeholder-gray-400 transition-colors focus:border-[#d92d83] focus:ring-0"
              id="username"
              name="username"
              placeholder="Kullanıcı Adı"
              type="text"
              required={true}
              autoComplete="off"
            />
          </div>
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

        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-sm text-gray-400 hover:text-white hover:underline"
            onClick={handleResetPassword}
          >
            Şifrenizi mi unuttunuz?
          </button>
        </div>
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
