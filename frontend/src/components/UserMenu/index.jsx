import React, { useState, useEffect, useRef } from "react";
import paths from "@/utils/paths";
import { AUTH_TIMESTAMP, AUTH_TOKEN, AUTH_USER } from "@/utils/constants";
import { Person } from "@phosphor-icons/react";
import { userFromStorage } from "@/utils/request";
import { Link } from "react-router-dom";

function useLoginMode() {
  const user = !!window.localStorage.getItem(AUTH_USER);
  const token = !!window.localStorage.getItem(AUTH_TOKEN);

  if (user && token) return "multi";
  if (!user && token) return "single";
  return null;
}

function userDisplay() {
  const user = userFromStorage();
  return user?.username?.slice(0, 2) || "AA";
}

export default function UserButton() {
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

  useEffect(() => {
    if (showMenu) {
      document.addEventListener("mousedown", handleClose);
    }
    return () => document.removeEventListener("mousedown", handleClose);
  }, [showMenu]);

  if (mode === null) return null;

  return (
    <div className="frame-header-action relative">
      <button
        ref={buttonRef}
        onClick={() => setShowMenu(!showMenu)}
        type="button"
        className="uppercase transition-all duration-300 w-[35px] h-[35px] text-base font-semibold rounded-full flex items-center hover:bg-menu-item-selected-gradient justify-center text-white hover:border-slate-100 hover:border-opacity-50 border-transparent border"
      >
        {mode === "multi" ? userDisplay() : <Person size={14} />}
      </button>

      {showMenu && (
        <div
          ref={menuRef}
          className="z-99 border border-zinc-600 w-[120px] rounded-lg absolute top-10 right-0 bg-sidebar p-4 flex items-center justify-center"
        >
          <div className="w-full flex flex-col gap-y-2">
            <Link
              to={paths.mailToMintplex()}
              className="text-sm border-none text-white hover:bg-slate-200/20 w-full text-left px-4 py-1.5 rounded-md"
            >
              Support
            </Link>
            <button
              onClick={() => {
                window.localStorage.removeItem(AUTH_USER);
                window.localStorage.removeItem(AUTH_TOKEN);
                window.localStorage.removeItem(AUTH_TIMESTAMP);
                window.location.hash = paths.home();
              }}
              type="button"
              className="text-sm border-none text-white hover:bg-slate-200/20 w-full text-left px-4 py-1.5 rounded-md"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
