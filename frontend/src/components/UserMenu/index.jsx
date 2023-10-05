import { useState } from "react";
import { isMobile } from "react-device-detect";
import paths from "../../utils/paths";
import { AUTH_TIMESTAMP, AUTH_TOKEN, AUTH_USER } from "../../utils/constants";
import { Person, SignOut } from "@phosphor-icons/react";
import { userFromStorage } from "../../utils/request";

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
  const user = userFromStorage();
  return user?.username?.slice(0, 2) || "AA";
}

function UserButton() {
  const [showMenu, setShowMenu] = useState(false);
  const mode = useLoginMode();

  if (mode === null) return null;
  return (
    <div className="absolute top-9 right-10 w-fit h-fit z-99">
      <button
        onClick={() => setShowMenu(!showMenu)}
        type="button"
        className="uppercase transition-all duration-300 w-[35px] h-[35px] text-base font-semibold rounded-full flex items-center bg-sidebar-button hover:bg-menu-item-selected-gradient justify-center text-white p-2 hover:border-slate-100 hover:border-opacity-50 border-transparent border"
      >
        {mode === "multi" ? userDisplay() : <Person size={14} />}
      </button>

      {showMenu && (
        <div className="w-fit rounded-lg absolute top-12 right-0 bg-sidebar p-4 flex items-center-justify-center">
          <div className="flex flex-col gap-y-2">
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
    </div>
  );
}
