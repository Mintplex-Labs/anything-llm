import React, { useEffect, useState } from "react";
import useLogo from "../../../hooks/useLogo";
import System from "../../../models/system";
import {
  AUTH_TIMESTAMP,
  AUTH_TOKEN,
  AUTH_USER,
} from "../../../utils/constants";
import MultiUserAuth from "./MultiUserAuth";
import SingleUserAuth from "./SingleUserAuth";

export default function PasswordModal({ mode = "single" }) {
  const { loginLogo } = useLogo();
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#111722] overflow-x-hidden font-manrope">
      {/* Animated background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black"></div>
        
        {/* Animated purple blur */}
        <div className="absolute bottom-0 right-0 h-1/2 w-1/2 rounded-full bg-gradient-to-tr from-[#4f33a9] via-transparent to-transparent blur-[100px] opacity-60 animate-float-purple"></div>
        
        {/* Animated pink blur */}
        <div className="absolute top-0 left-0 h-1/2 w-1/2 rounded-full bg-gradient-to-bl from-[#d92d83] via-transparent to-transparent blur-[100px] opacity-60 animate-float-pink"></div>
        
        {/* Animated blue blur */}
        <div className="absolute bottom-0 left-1/4 h-1/3 w-1/3 rounded-full bg-gradient-to-tr from-[#3379e4] via-transparent to-transparent opacity-50 blur-[80px] animate-float-blue"></div>
      </div>
      
      <div className="relative z-10 flex h-full grow flex-col">
        <div className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
          {mode === "single" ? <SingleUserAuth /> : <MultiUserAuth />}
        </div>
      </div>

    </div>
  );
}

export function usePasswordModal(notry = false) {
  const [auth, setAuth] = useState({
    loading: true,
    requiresAuth: false,
    mode: "single",
  });

  useEffect(() => {
    async function checkAuthReq() {
      if (!window) return;

      // If the last validity check is still valid
      // we can skip the loading.
      if (!System.needsAuthCheck() && notry === false) {
        setAuth({
          loading: false,
          requiresAuth: false,
          mode: "multi",
        });
        return;
      }

      const settings = await System.keys();
      if (settings?.MultiUserMode) {
        const currentToken = window.localStorage.getItem(AUTH_TOKEN);
        if (!!currentToken) {
          const valid = notry ? false : await System.checkAuth(currentToken);
          if (!valid) {
            setAuth({
              loading: false,
              requiresAuth: true,
              mode: "multi",
            });
            window.localStorage.removeItem(AUTH_USER);
            window.localStorage.removeItem(AUTH_TOKEN);
            window.localStorage.removeItem(AUTH_TIMESTAMP);
            return;
          } else {
            setAuth({
              loading: false,
              requiresAuth: false,
              mode: "multi",
            });
            return;
          }
        } else {
          setAuth({
            loading: false,
            requiresAuth: true,
            mode: "multi",
          });
          return;
        }
      } else {
        // Running token check in single user Auth mode.
        // If Single user Auth is disabled - skip check
        const requiresAuth = settings?.RequiresAuth || false;
        if (!requiresAuth) {
          setAuth({
            loading: false,
            requiresAuth: false,
            mode: "single",
          });
          return;
        }

        const currentToken = window.localStorage.getItem(AUTH_TOKEN);
        if (!!currentToken) {
          const valid = notry ? false : await System.checkAuth(currentToken);
          if (!valid) {
            setAuth({
              loading: false,
              requiresAuth: true,
              mode: "single",
            });
            window.localStorage.removeItem(AUTH_TOKEN);
            window.localStorage.removeItem(AUTH_USER);
            window.localStorage.removeItem(AUTH_TIMESTAMP);
            return;
          } else {
            setAuth({
              loading: false,
              requiresAuth: false,
              mode: "single",
            });
            return;
          }
        } else {
          setAuth({
            loading: false,
            requiresAuth: true,
            mode: "single",
          });
          return;
        }
      }
    }
    checkAuthReq();
  }, []);

  return auth;
}
