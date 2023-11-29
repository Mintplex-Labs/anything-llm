import React, { useState, useEffect, useRef } from "react";
import { isMobile } from "react-device-detect";
import paths from "../../utils/paths";
import { AUTH_TIMESTAMP, AUTH_TOKEN, AUTH_USER } from "../../utils/constants";
import { Person, Plus, SignOut, X } from "@phosphor-icons/react";
import { userFromStorage } from "../../utils/request";
import useUser from "../../hooks/useUser";
import System from "../../models/system";
import showToast from "../../utils/toast";

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

  console.log(useUser());

  if (user && token) return "multi";
  if (!user && token) return "single";
  return null;
}

function userDisplay() {
  const user = userFromStorage();
  return user?.username?.slice(0, 2) || "AA";
}

function UserButton() {
  const [showMenu, setShowMenu] = useState(false);
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
    document.getElementById("account-modal")?.showModal();
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
            <a
              href={paths.mailToMintplex()}
              className="text-white hover:bg-slate-200/20 w-full text-left px-4 py-1.5 rounded-md"
            >
              Support
            </a>
            <button
              onClick={handleOpenAccountModal}
              className="text-white hover:bg-slate-200/20 w-full text-left px-4 py-1.5 rounded-md"
            >
              Account
            </button>
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
      <AccountModal />
    </div>
  );
}

function AccountModal() {
  const {user} = useUser();
  const hideModal = () => {
    document.getElementById("account-modal")?.close();
  };

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

    showToast("Profile picture uploaded successfully.", "success");
  };

  return (
    <dialog id="account-modal" className="bg-transparent outline-none">
      <div className="relative w-[500px] max-w-2xl max-h-full">
        <div className="relative bg-main-gradient rounded-lg shadow">
          <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-500/50">
            <h3 className="text-xl font-semibold text-white">Edit Account</h3>
            <button
              onClick={hideModal}
              type="button"
              className="transition-all duration-300 text-gray-400 bg-transparent hover:border-white/60 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
              data-modal-hide="staticModal"
            >
              <X className="text-gray-300 text-lg" />
            </button>
          </div>
          <form onSubmit={() => console.log("submitted")}>
            <div className="p-6 space-y-6 flex h-full w-full">
              <div className="flex md:flex-row flex-col items-center">
                <div className="flex flex-row gap-x-8">
                  <div>
                  <label
                  className="mt-5 transition-all duration-300 hover:opacity-60"
                >
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                    <div
                      className="w-36 h-36 py-4 bg-zinc-900/50 rounded-2xl border-2 border-dashed border-white border-opacity-60 justify-center items-center inline-flex cursor-pointer"
                      htmlFor="logo-upload"
                    >
                      <div className="flex flex-col items-center justify-center p-3">
                        <div className="rounded-full bg-white/40">
                          <Plus className="w-6 h-6 text-black/80 m-2" />
                        </div>
                        <div className="text-white text-opacity-80 text-sm font-semibold py-1 mt-3">
                          Profile Picture
                        </div>
                        <div className="text-white text-opacity-60 text-xs font-medium py-1">
                          800 x 800
                        </div>
                      </div>
                    </div>
                  </label>
                  <button
                    // onClick={handleRemoveLogo}
                    className="text-white text-base font-medium hover:text-opacity-60 ml-4"
                  >
                    Delete
                  </button>
                </div>
              </div>
              </div>
            </div>
            <div className="p-6 space-y-6 flex h-full w-full">
              <div className="w-full flex flex-col gap-y-4">
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
                    className="bg-zinc-900 border border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="User's username"
                    minLength={2}
                    defaultValue={user.username}
                    required={true}
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
                    type="text"
                    className="bg-zinc-900 border border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder={`${user.username}'s new password`}
                    minLength={8}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
            <div className="flex w-full justify-between items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
              <button
                onClick={hideModal}
                type="button"
                className="px-4 py-2 rounded-lg text-white hover:bg-stone-900 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
              >
                Update Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}
