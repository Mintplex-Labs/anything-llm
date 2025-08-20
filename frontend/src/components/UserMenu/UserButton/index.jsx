import useLoginMode from "@/hooks/useLoginMode";
import usePfp from "@/hooks/usePfp";
import useUser from "@/hooks/useUser";
import System from "@/models/system";
import paths from "@/utils/paths";
import { userFromStorage } from "@/utils/request";
import { Person } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import AccountModal from "../AccountModal";
import { AUTH_TIMESTAMP, AUTH_TOKEN, AUTH_USER } from "@/utils/constants";
import { useTranslation } from "react-i18next";

export default function UserButton() {
  const { t } = useTranslation();
  const mode = useLoginMode();
  const { user } = useUser();
  const menuRef = useRef();
  const buttonRef = useRef();
  const [showMenu, setShowMenu] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [supportEmail, setSupportEmail] = useState("");

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

  useEffect(() => {
    const fetchSupportEmail = async () => {
      const supportEmail = await System.fetchSupportEmail();
      setSupportEmail(
        supportEmail?.email
          ? `mailto:${supportEmail.email}`
          : paths.mailToMintplex()
      );
    };
    fetchSupportEmail();
  }, []);

  if (mode === null) return null;
  return (
    <div className="absolute top-3 right-4 md:top-9 md:right-10 w-fit h-fit z-40">
      <div className="menu">
        <button
          ref={buttonRef}
          onClick={() => setShowMenu(!showMenu)}
          type="button"
          className="uppercase transition-all duration-300 w-[35px] h-[35px] text-base font-semibold rounded-full flex items-center bg-theme-action-menu-bg hover:bg-theme-action-menu-item-hover justify-center text-[var(--text)] p-2 border border-transparent hover:border-[var(--border)]"
        >
          {mode === "multi" ? <UserDisplay /> : <Person size={14} />}
        </button>

        {showMenu && (
          <div ref={menuRef} className="menu__popover">
            <div className="flex flex-col gap-y-2">
              {mode === "multi" && !!user && (
                <button onClick={handleOpenAccountModal} className="menu__item">
                  {t("profile_settings.account")}
                </button>
              )}
              <a href={supportEmail} className="menu__item">
                {t("profile_settings.support")}
              </a>
              <button
                onClick={() => {
                  window.localStorage.removeItem(AUTH_USER);
                  window.localStorage.removeItem(AUTH_TOKEN);
                  window.localStorage.removeItem(AUTH_TIMESTAMP);
                  window.location.replace(paths.home());
                }}
                type="button"
                className="menu__item"
              >
                {t("profile_settings.signout")}
              </button>
            </div>
          </div>
        )}
      </div>
      {user && showAccountSettings && (
        <AccountModal
          user={user}
          hideModal={() => setShowAccountSettings(false)}
        />
      )}
    </div>
  );
}

function UserDisplay() {
  const { pfp } = usePfp();
  const user = userFromStorage();

  if (pfp) {
    return (
      <div className="w-[35px] h-[35px] rounded-full flex-shrink-0 overflow-hidden transition-all duration-300 bg-[var(--card)] border border-transparent hover:border-[var(--border)] hover:border-opacity-50 hover:opacity-60">
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
