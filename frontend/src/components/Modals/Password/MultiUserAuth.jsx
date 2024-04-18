import React, { useEffect, useState } from "react";
import System from "../../../models/system";
import { AUTH_TOKEN, AUTH_USER } from "../../../utils/constants";
import useLogo from "../../../hooks/useLogo";
import paths from "../../../utils/paths";
import showToast from "@/utils/toast";
import { DownloadSimple, Key } from "@phosphor-icons/react";
import ModalWrapper from "@/components/ModalWrapper";
import { useModal } from "@/hooks/useModal";

const RecoveryCodeModal = ({ recoveryCodes, onDownloadComplete, onClose }) => {
  const [downloadClicked, setDownloadClicked] = useState(false);

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
const RecoveryForm = ({ onSubmit }) => {
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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center items-center relative rounded-2xl bg-login-gradient shadow-[0_4px_14px_rgba(0,0,0,0.25)] px-8 py-4"
    >
      <div className="flex items-start justify-between pt-11 pb-9 rounded-t">
        <div className="flex flex-col gap-y-4">
          <h3 className="text-md md:text-lg font-bold text-white">
            Password Reset
          </h3>
          <p className="text-sm text-white/90 text-left max-w-[300px]">
            Provide the necessary information below to reset your pasword.
          </p>
        </div>
      </div>
      <div className="px-12 space-y-6 flex h-full w-full">
        <div className="w-full flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-2">
            <label className="text-white text-sm font-bold">Username</label>
            <input
              name="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-zinc-900 text-white placeholder-white/20 text-sm rounded-md p-2.5 w-[300px] h-[34px]"
              required
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="text-white text-sm font-bold">
              Recovery Codes
            </label>
            {recoveryCodeInputs.map((code, index) => (
              <div key={index}>
                <input
                  type="text"
                  name={`recoveryCode${index + 1}`}
                  placeholder={`Recovery Code ${index + 1}`}
                  value={code}
                  onChange={(e) =>
                    handleRecoveryCodeChange(index, e.target.value)
                  }
                  className="bg-zinc-900 text-white placeholder-white/20 text-sm rounded-md p-2.5 w-[300px] h-[34px]"
                  required
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center p-12 space-x-2 border-gray-600 w-full flex-col gap-y-8">
        <button
          type="submit"
          className=" text-sm font-bold focus:ring-4 focus:outline-none rounded-md border-[1.5px] border-[#46C8FF] h-[34px] text-[#222628] bg-[#46C8FF] border-transparent hover:border-[#46C8FF] hover:bg-[#2C2F36] hover:text-[#46C8FF] focus:z-10 w-full"
        >
          Reset Password
        </button>
      </div>
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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center items-center relative rounded-2xl bg-login-gradient shadow-[0_4px_14px_rgba(0,0,0,0.25)] px-12 py-12"
    >
      <div className="flex items-start justify-between pt-11 pb-9 rounded-t">
        <div className="flex items-center flex-col gap-y-4">
          <h3 className="text-md md:text-2xl font-bold text-white text-center">
            Reset Password
          </h3>
          <p className="text-sm text-white/90 text-center">
            Enter your new password.
          </p>
        </div>
      </div>
      <div className="px-12 space-y-6 flex h-full w-full">
        <div className="w-full flex flex-col gap-y-4">
          <div>
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-zinc-900 text-white placeholder-white/20 text-sm rounded-md p-2.5 w-[300px] h-[34px]"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-zinc-900 text-white placeholder-white/20 text-sm rounded-md p-2.5 w-[300px] h-[34px]"
              required
            />
          </div>
        </div>
      </div>
      <div className="flex items-center p-12 space-x-2 border-gray-600 w-full flex-col gap-y-8">
        <button
          type="submit"
          className=" text-sm font-bold focus:ring-4 focus:outline-none rounded-md border-[1.5px] border-[#46C8FF] h-[34px] text-[#222628] bg-[#46C8FF] border-transparent hover:border-[#46C8FF] hover:bg-[#2C2F36] hover:text-[#46C8FF] focus:z-10 w-full"
        >
          Reset Password
        </button>
      </div>
    </form>
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
  const [showRecoveryForm, setShowRecoveryForm] = useState(false);
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);

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

  const handleResetPassword = () => {
    setShowRecoveryForm(true);
  };

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

  if (showRecoveryForm) {
    return <RecoveryForm onSubmit={handleRecoverySubmit} />;
  }

  if (showResetPasswordForm) {
    return <ResetPasswordForm onSubmit={handleResetSubmit} />;
  }

  return (
    <>
      <form onSubmit={handleLogin}>
        <div className="flex flex-col justify-center items-center relative rounded-2xl bg-login-gradient shadow-[0_4px_14px_rgba(0,0,0,0.25)] px-12 py-12">
          <div className="flex items-start justify-between pt-11 pb-9 rounded-t">
            <div className="flex items-center flex-col gap-y-4">
              <h3 className="text-md md:text-2xl font-bold text-white text-center white-space-nowrap ">
                Welcome to AnythingLLM
                {/* <p className="text-[linear-gradient(91.2deg, #75D6FF 48.97%, #FFFFFF 104.38%)]">
                  AnythingLLM
                </p> */}
              </h3>
              <p className="text-sm text-white/90 text-center">
                Sign in to your AnythingLLM account.
              </p>
            </div>
          </div>
          <div className="px-12 space-y-6 flex h-full w-full">
            <div className="w-full flex flex-col gap-y-4">
              <div>
                <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  className="bg-zinc-900 text-white placeholder-white/20 text-sm rounded-md p-2.5 w-[300px] h-[34px]"
                  required={true}
                  autoComplete="off"
                />
              </div>

              <div>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="bg-zinc-900 text-white placeholder-white/20 text-sm rounded-md p-2.5 w-[300px] h-[34px]"
                  required={true}
                  autoComplete="off"
                />
              </div>

              {error && <p className="text-red-400 text-sm">Error: {error}</p>}
            </div>
          </div>
          <div className="flex items-center p-12 space-x-2 border-gray-600 w-full flex-col gap-y-8">
            <button
              disabled={loading}
              type="submit"
              className="text-[#46C8FF] text-sm font-bold focus:ring-4 focus:outline-none rounded-md border-[1.5px] border-[#46C8FF] h-[34px] hover:text-white hover:bg-[#46C8FF] focus:z-10 w-full"
            >
              {loading ? "Validating..." : "Login"}
            </button>
            <button
              type="button"
              className="text-white text-sm flex gap-x-1 hover:text-[#46C8FF] hover:underline"
              onClick={handleResetPassword}
            >
              Forgot password?<b>Reset</b>
            </button>
          </div>
        </div>
      </form>

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
