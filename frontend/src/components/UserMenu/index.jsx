import React, { useState, useEffect, useRef } from "react";
import { isMobile } from "react-device-detect";
import paths from "@/utils/paths";
import { AUTH_TIMESTAMP, AUTH_TOKEN, AUTH_USER } from "@/utils/constants";
import { Person, Plus, X } from "@phosphor-icons/react";
import { userFromStorage } from "@/utils/request";
import useUser from "@/hooks/useUser";
import System from "@/models/system";
import showToast from "@/utils/toast";
import usePfp from "@/hooks/usePfp";

export default function UserMenu({ children }) {
  if (isMobile) return <>{children}</>;
  return (
    <div className="w-auto h-auto">
      <UserButton />

      {children}
    </div>
  );
}

function useLoginMode() {
  const user = !!window.localStorage.getItem(AUTH_USER);
  const token = !!window.localStorage.getItem(AUTH_TOKEN);

  if (user && token) return "multi";
  if (!user && token) return "single";
  return null;
}

function userDisplay() {
  const { pfp } = usePfp();
  const user = userFromStorage();

  if (pfp) {
    return (
      <div className="w-[35px] h-[35px] rounded-full flex-shrink-0 overflow-hidden transition-all duration-300 bg-gray-100 hover:border-slate-100 hover:border-opacity-50 border-transparent border hover:opacity-60">
        <img
          src={pfp}
          alt="User profile picture"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return user?.username?.slice(0, 2) || "AA";
}

function UserButton() {
  const { user } = useUser();
  const [showMenu, setShowMenu] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const mode = useLoginMode();
  const menuRef = useRef();
  const buttonRef = useRef();
  const handleClose = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      !buttonRef.current.contains(event.target)
    ) {
      setShowMenu(false);
    }
  };

  const handleOpenAccountModal = () => {
    setShowAccountSettings(true);
    setShowMenu(false);
  };

  useEffect(() => {
    if (showMenu) {
      document.addEventListener("mousedown", handleClose);
    }
    return () => document.removeEventListener("mousedown", handleClose);
  }, [showMenu]);

  if (mode === null) return null;

  return (
    <div className="absolute top-9 right-10 w-fit h-fit z-99">
      <button
        ref={buttonRef}
        onClick={() => setShowMenu(!showMenu)}
        type="button"
        className="uppercase transition-all duration-300 w-[35px] h-[35px] text-base font-semibold rounded-full flex items-center bg-sidebar-button hover:bg-menu-item-selected-gradient justify-center text-white p-2 hover:border-slate-100 hover:border-opacity-50 border-transparent border"
      >
        {mode === "multi" ? userDisplay() : <Person size={14} />}
      </button>

      {showMenu && (
        <div
          ref={menuRef}
          className="w-fit rounded-lg absolute top-12 right-0 bg-sidebar p-4 flex items-center-justify-center"
        >
          <div className="flex flex-col gap-y-2">
            {mode === "multi" && !!user && (
              <button
                onClick={handleOpenAccountModal}
                className="text-white hover:bg-slate-200/20 w-full text-left px-4 py-1.5 rounded-md"
              >
                Account
              </button>
            )}
            <a
              href={paths.mailToMintplex()}
              className="text-white hover:bg-slate-200/20 w-full text-left px-4 py-1.5 rounded-md"
            >
              Support
            </a>
            <button
              onClick={() => {
                window.localStorage.removeItem(AUTH_USER);
                window.localStorage.removeItem(AUTH_TOKEN);
                window.localStorage.removeItem(AUTH_TIMESTAMP);
                window.location.replace(paths.home());
              }}
              type="button"
              className="text-white hover:bg-slate-200/20 w-full text-left px-4 py-1.5 rounded-md"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
      {user && showAccountSettings && (
        <AccountModal
          user={user}
          hideModal={() => setShowAccountSettings(false)}
        />
      )}
    </div>
  );
}

function AccountModal({ user, hideModal }) {
  const { pfp, setPfp } = usePfp();
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return false;

    const formData = new FormData();
    formData.append("file", file);
    const { success, error } = await System.uploadPfp(formData);
    if (!success) {
      showToast(`Failed to upload profile picture: ${error}`, "error");
      return;
    }

    const pfpUrl = await System.fetchPfp(user.id);
    setPfp(pfpUrl);

    showToast("Profile picture uploaded successfully.", "success");
  };

  const handleRemovePfp = async () => {
    const { success, error } = await System.removePfp();
    if (!success) {
      showToast(`Failed to remove profile picture: ${error}`, "error");
      return;
    }

    setPfp(null);
    showToast("Profile picture removed successfully.", "success");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const data = {};
    const form = new FormData(e.target);
    for (var [key, value] of form.entries()) {
      if (!value || value === null) continue;
      data[key] = value;
    }

    const { success, error } = await System.updateUser(data);
    if (success) {
      let storedUser = JSON.parse(localStorage.getItem(AUTH_USER));

      if (storedUser) {
        storedUser.username = data.username;
        localStorage.setItem(AUTH_USER, JSON.stringify(storedUser));
      }
      window.location.reload();
    } else {
      showToast(`Failed to update user: ${error}`, "error");
    }
  };

  return (
    <div
      id="account-modal"
      className="bg-black/20 fixed top-0 left-0 outline-none w-screen h-screen flex items-center justify-center"
    >
      <div className="relative w-[500px] max-w-2xl max-h-full bg-main-gradient rounded-lg shadow">
        <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-500/50">
          <h3 className="text-xl font-semibold text-white">Edit Account</h3>
          <button
            onClick={hideModal}
            type="button"
            className="text-gray-400 bg-transparent hover:border-white/60 rounded-lg p-1.5 ml-auto inline-flex items-center hover:bg-menu-item-selected-gradient hover:border-slate-100 border-transparent"
          >
            <X className="text-lg" />
          </button>
        </div>
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex flex-col items-center">
              <label className="w-48 h-48 flex flex-col items-center justify-center bg-zinc-900/50 transition-all duration-300 rounded-full mt-8 border-2 border-dashed border-white border-opacity-60 cursor-pointer hover:opacity-60">
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                {pfp ? (
                  <img
                    src={pfp}
                    alt="User profile picture"
                    className="w-48 h-48 rounded-full object-cover bg-white"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-3">
                    <Plus className="w-8 h-8 text-white/80 m-2" />
                    <span className="text-white text-opacity-80 text-sm font-semibold">
                      Profile Picture
                    </span>
                    <span className="text-white text-opacity-60 text-xs">
                      800 x 800
                    </span>
                  </div>
                )}
              </label>
              {pfp && (
                <button
                  type="button"
                  onClick={handleRemovePfp}
                  className="mt-3 text-white text-opacity-60 text-sm font-medium hover:underline"
                >
                  Remove Profile Picture
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-y-4 px-6">
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-white"
              >
                Username
              </label>
              <input
                name="username"
                type="text"
                className="bg-zinc-900 border border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
                placeholder="User's username"
                minLength={2}
                defaultValue={user.username}
                required
                autoComplete="off"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-white"
              >
                New Password
              </label>
              <input
                name="password"
                type="password"
                className="bg-zinc-900 border border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
                placeholder={`${user.username}'s new password`}
              />
            </div>
          </div>
          <div className="flex justify-between items-center border-t border-gray-500/50 pt-4 p-6">
            <button
              onClick={hideModal}
              type="button"
              className="px-4 py-2 rounded-lg text-white bg-transparent hover:bg-stone-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-white bg-transparent border border-slate-200 hover:bg-slate-200 hover:text-slate-800"
            >
              Update Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
