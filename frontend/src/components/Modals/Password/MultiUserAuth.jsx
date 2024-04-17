import React, { useEffect, useState } from "react";
import System from "../../../models/system";
import { AUTH_TOKEN, AUTH_USER } from "../../../utils/constants";
import useLogo from "../../../hooks/useLogo";
import paths from "../../../utils/paths";
import showToast from "@/utils/toast";
import { DownloadSimple, Key } from "@phosphor-icons/react";
import ModalWrapper from "@/components/ModalWrapper";
import { useModal } from "@/hooks/useModal";

const RecoveryModal = ({ onSubmit, onClose }) => {
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
    <div className="inline-block align-bottom bg-[#2C2F36] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
      <form onSubmit={handleSubmit}>
        <div className="py-[17px] px-[20px]">
          <h3
            className="text-lg leading-6 font-medium text-white"
            id="modal-headline"
          >
            Reset Password
          </h3>
          <div className="mt-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-white"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 px-2 h-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white/80 placeholder-[#FFFFFF99] text-black font-medium"
            />
          </div>
          {recoveryCodeInputs.map((code, index) => (
            <div key={index} className="mt-4">
              <label
                htmlFor={`recoveryCode${index + 1}`}
                className="block text-sm font-medium text-white"
              >
                Recovery Code {index + 1}
              </label>
              <input
                type="text"
                name={`recoveryCode${index + 1}`}
                id={`recoveryCode${index + 1}`}
                value={code}
                onChange={(e) =>
                  handleRecoveryCodeChange(index, e.target.value)
                }
                className="mt-2 px-2 h-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white/80 placeholder-[#FFFFFF99] text-black font-medium"
              />
            </div>
          ))}
        </div>
        <div className="flex w-full justify-between items-center p-3 space-x-2 border-t rounded-b border-gray-500/50">
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-[#2C2F36] text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="transition-all duration-300 text-xs px-2 py-1 font-semibold rounded-lg bg-[#46C8FF] hover:bg-[#2C2F36] border-2 border-transparent hover:border-[#46C8FF] hover:text-white h-[32px] -mr-8 whitespace-nowrap shadow-[0_4px_14px_rgba(0,0,0,0.25)]"
          >
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
};

const ResetPasswordModal = ({ onSubmit, onClose }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newPassword, confirmPassword);
  };

  return (
    <div className="inline-block align-bottom bg-[#2C2F36] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
      <form onSubmit={handleSubmit}>
        <div className="py-[17px] px-[20px]">
          <h3
            className="text-lg leading-6 font-medium text-white"
            id="modal-headline"
          >
            Reset Password
          </h3>
          <div className="mt-4">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-white"
            >
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-2 px-2 h-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white/80 placeholder-[#FFFFFF99] text-black font-medium"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-white"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-2 px-2 h-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white/80 placeholder-[#FFFFFF99] text-black font-medium"
            />
          </div>
        </div>
        <div className="flex w-full justify-between items-center p-3 space-x-2 border-t rounded-b border-gray-500/50">
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-[#2C2F36] text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="transition-all duration-300 text-xs px-2 py-1 font-semibold rounded-lg bg-[#46C8FF] hover:bg-[#2C2F36] border-2 border-transparent hover:border-[#46C8FF] hover:text-white h-[32px] -mr-8 whitespace-nowrap shadow-[0_4px_14px_rgba(0,0,0,0.25)]"
          >
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
};

const RecoveryCodeModal = ({ recoveryCodes, onDownloadComplete, onClose }) => {
  const [downloadClicked, setDownloadClicked] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  const downloadRecoveryCodes = () => {
    const element = document.createElement("a");
    const file = new Blob([recoveryCodes.join("\n")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "recovery_codes.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setDownloadClicked(true);
  };

  const handleClose = () => {
    if (downloadClicked) {
      onDownloadComplete();
      onClose();
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(recoveryCodes.join(",\n")).then(() => {
      setCopiedToClipboard(true);
      showToast("Recovery codes copied to clipboard", "success", {
        clear: true,
      });
    });
  };

  return (
    <div className="inline-block bg-[#2C2F36] rounded-lg text-left overflow-hidden shadow-xl transform transition-all border-2 border-[#BCC9DB]/10 w-[600px] mx-4">
      <div className="md:py-[35px] md:px-[50px] py-[28px] px-[20px]">
        <div className="flex gap-x-2">
          <Key size={24} className="text-white" weight="bold" />
          <h3
            className="text-lg leading-6 font-medium text-white"
            id="modal-headline"
          >
            Recovery Codes
          </h3>
        </div>
        <div className="mt-4">
          <p className="text-sm text-white flex flex-col">
            In order to reset your password in the future, you will need these
            recovery codes. Download or copy your recovery codes to save them.{" "}
            <br />
            <b className="mt-4">These recovery codes are only shown once!</b>
          </p>
          <div
            className="bg-[#1C1E21] text-white hover:text-[#46C8FF]
               flex items-center justify-center rounded-md mt-6 cursor-pointer"
            onClick={handleCopyToClipboard}
          >
            <ul className="space-y-2 md:p-6 p-4">
              {recoveryCodes.map((code, index) => (
                <li key={index} className="md:text-sm text-xs">
                  {code}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-center items-center p-3 space-x-2 rounded-b border-gray-500/50 -mt-4 mb-4">
        <button
          type="button"
          className="transition-all duration-300 text-xs md:w-[500px] md:h-[34px] h-[48px] w-full m-2 font-semibold rounded-lg bg-[#46C8FF] hover:bg-[#2C2F36] border-2 border-transparent hover:border-[#46C8FF] hover:text-white whitespace-nowrap shadow-[0_4px_14px_rgba(0,0,0,0.25)] flex justify-center items-center gap-x-2"
          onClick={downloadClicked ? handleClose : downloadRecoveryCodes}
        >
          {downloadClicked ? (
            "Close"
          ) : (
            <>
              <DownloadSimple weight="bold" size={18} />
              <p>Download</p>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default function MultiUserAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { logo: _initLogo } = useLogo();
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const {
    isOpen: isRecoveryModalOpen,
    openModal: openRecoveryModal,
    closeModal: closeRecoveryModal,
  } = useModal();

  const {
    isOpen: isResetModalOpen,
    openModal: openResetModal,
    closeModal: closeResetModal,
  } = useModal();

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

  const handleResetPassword = (e) => {
    e.preventDefault();
    openRecoveryModal();
  };

  const handleRecoverySubmit = async (username, recoveryCodes) => {
    const { success, resetToken, error } = await System.recoverAccount(
      username,
      recoveryCodes
    );

    if (success && resetToken) {
      window.localStorage.setItem("resetToken", resetToken);
      closeRecoveryModal();
      openResetModal();
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
        closeResetModal();
        showToast("Password reset successful", "success", { clear: true });
      } else {
        showToast(error, "error", { clear: true });
      }
    } else {
      showToast("Invalid reset token", "error", { clear: true });
    }
  };

  const handleDownloadComplete = () => {
    setDownloadComplete(true);
  };

  useEffect(() => {
    if (downloadComplete && user && token) {
      window.localStorage.setItem(AUTH_USER, JSON.stringify(user));
      window.localStorage.setItem(AUTH_TOKEN, token);
      window.location = paths.home();
    }
  }, [downloadComplete, user, token]);

  return (
    <>
      <form onSubmit={handleLogin}>
        <div className="flex flex-col justify-center items-center relative rounded-2xl shadow border-2 border-slate-300 border-opacity-20 w-[400px] login-input-gradient">
          <div className="flex items-start justify-between pt-11 pb-9 rounded-t">
            <div className="flex items-center flex-col">
              <h3 className="text-md md:text-2xl font-bold text-gray-900 dark:text-white text-center">
                Sign In
              </h3>
            </div>
          </div>
          <div className="px-12 space-y-6 flex h-full w-full">
            <div className="w-full flex flex-col gap-y-4">
              <div>
                <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  className="bg-opacity-40 border-gray-300 text-sm rounded-lg block w-full p-2.5 bg-[#222628] placeholder-[#FFFFFF99] text-white focus:ring-blue-500 focus:border-blue-500"
                  required={true}
                  autoComplete="off"
                />
              </div>
              <div>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="bg-opacity-40 border-gray-300 text-sm rounded-lg block w-full p-2.5 bg-[#222628] placeholder-[#FFFFFF99] text-white focus:ring-blue-500 focus:border-blue-500"
                  required={true}
                  autoComplete="off"
                />
              </div>
              {error && (
                <p className="text-red-600 dark:text-red-400 text-sm">
                  Error: {error}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-y-2 items-center p-12 space-x-2 border-gray-200 rounded-b dark:border-gray-600 w-full">
            <button
              disabled={loading}
              type="submit"
              className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-white text-sm font-bold px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-white dark:text-neutral-700 dark:border-white dark:hover:text-white dark:hover:bg-slate-600 dark:focus:ring-gray-600 w-full"
            >
              {loading ? "Validating..." : "Login"}
            </button>
            <button
              onClick={handleResetPassword}
              className="px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
            >
              Reset Password
            </button>
          </div>
        </div>
      </form>
      <ModalWrapper isOpen={isRecoveryModalOpen}>
        <RecoveryModal
          onSubmit={handleRecoverySubmit}
          onClose={closeRecoveryModal}
        />
      </ModalWrapper>
      <ModalWrapper isOpen={isResetModalOpen}>
        <ResetPasswordModal
          onSubmit={handleResetSubmit}
          onClose={closeResetModal}
        />
      </ModalWrapper>
      <ModalWrapper isOpen={isRecoveryCodeModalOpen}>
        <RecoveryCodeModal
          recoveryCodes={recoveryCodes}
          onDownloadComplete={handleDownloadComplete}
          onClose={closeRecoveryCodeModal}
        />
      </ModalWrapper>
    </>
  );
}
