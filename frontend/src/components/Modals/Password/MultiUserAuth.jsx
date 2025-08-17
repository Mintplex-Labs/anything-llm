import React, { useEffect, useState } from "react";
import System from "../../../models/system";
import { AUTH_TOKEN, AUTH_USER } from "../../../utils/constants";
import paths from "../../../utils/paths";
import showToast from "@/utils/toast";
import ModalWrapper from "@/components/ModalWrapper";
import { useModal } from "@/hooks/useModal";
import RecoveryCodeModal from "@/components/Modals/DisplayRecoveryCodeModal";
import { useTranslation } from "react-i18next";

const RecoveryForm = ({ onSubmit, setShowRecoveryForm }) => {
  const { t } = useTranslation();
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
    <form onSubmit={handleSubmit} className="flex flex-col text-center">
      <h3 className="text-lg font-bold">{t("login.password-reset.title")}</h3>
      <p className="text-sm text-[var(--text-muted)]">
        {t("login.password-reset.description")}
      </p>
      <input
        name="username"
        type="text"
        placeholder={t("login.multi-user.placeholder-username")}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="onenew-input mt-3"
        required
      />
      {recoveryCodeInputs.map((code, index) => (
        <input
          key={index}
          type="text"
          name={`recoveryCode${index + 1}`}
          placeholder={t("login.password-reset.recovery-code", {
            index: index + 1,
          })}
          value={code}
          onChange={(e) => handleRecoveryCodeChange(index, e.target.value)}
          className="onenew-input mt-3"
          required
        />
      ))}
      <button
        type="submit"
        className="onenew-btn onenew-btn--primary w-full mt-4"
      >
        {t("login.password-reset.title")}
      </button>
      <button
        type="button"
        className="text-[var(--text-muted)] hover:opacity-80 mt-3"
        onClick={() => setShowRecoveryForm(false)}
      >
        {t("login.password-reset.back-to-login")}
      </button>
    </form>
  );
};

const ResetPasswordForm = ({ onSubmit }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newPassword, confirmPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col text-center">
      <h3 className="text-lg font-bold">Reset Password</h3>
      <p className="text-sm text-[var(--text-muted)]">
        Enter your new password.
      </p>
      <input
        type="password"
        name="newPassword"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="onenew-input mt-3"
        required
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="onenew-input mt-3"
        required
      />
      <button
        type="submit"
        className="onenew-btn onenew-btn--primary w-full mt-4"
      >
        Reset Password
      </button>
    </form>
  );
};

export default function MultiUserAuth() {
  const { t } = useTranslation();
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
      <form onSubmit={handleLogin} className="flex flex-col text-center">
        <div>
          <h3 className="text-lg font-bold">
            {t("login.multi-user.welcome")}{" "}
            <span>{customAppName || "OneNew"}</span>
          </h3>
          <p className="text-sm text-[var(--text-muted)]">
            {t("login.sign-in.start")} {customAppName || "OneNew"}{" "}
            {t("login.sign-in.end")}
          </p>
        </div>
        <input
          name="username"
          type="text"
          placeholder={t("login.multi-user.placeholder-username")}
          className="onenew-input mt-3"
          required={true}
          autoComplete="off"
        />
        <input
          name="password"
          type="password"
          placeholder={t("login.multi-user.placeholder-password")}
          className="onenew-input mt-3"
          required={true}
          autoComplete="off"
        />
        {error && <p className="text-red-400 text-sm mt-2">Error: {error}</p>}
        <button
          disabled={loading}
          type="submit"
          className="onenew-btn onenew-btn--primary w-full mt-4"
        >
          {loading
            ? t("login.multi-user.validating")
            : t("login.multi-user.login")}
        </button>
        <button
          type="button"
          className="text-[var(--text-muted)] hover:opacity-80 mt-3"
          onClick={handleResetPassword}
        >
          {t("login.multi-user.forgot-pass")}?
          <b>{t("login.multi-user.reset")}</b>
        </button>
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
