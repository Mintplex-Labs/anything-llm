import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { FullScreenLoader } from "../Preloader";
import validateSessionTokenForUser from "../../utils/session";
import paths from "../../utils/paths";
import { AUTH_TOKEN, AUTH_USER } from "../../utils/constants";
import { userFromStorage } from "../../utils/request";
import System from "../../models/system";
import UserMenu from "../UserMenu";

// Used only for Multi-user mode only as we permission specific pages based on auth role.
// When in single user mode we just bypass any authchecks.
function useIsAuthenticated() {
  const [isAuthd, setIsAuthed] = useState(null);

  useEffect(() => {
    const validateSession = async () => {
      const { MultiUserMode, RequiresAuth } = await System.keys();
      if (!MultiUserMode && !RequiresAuth) {
        setIsAuthed(true);
        return;
      }

      // Single User password mode check
      if (!MultiUserMode && RequiresAuth) {
        const localAuthToken = localStorage.getItem(AUTH_TOKEN);
        if (!localAuthToken) {
          setIsAuthed(false);
          return;
        }

        const isValid = await validateSessionTokenForUser();
        setIsAuthed(isValid);
        return;
      }

      const localUser = localStorage.getItem(AUTH_USER);
      const localAuthToken = localStorage.getItem(AUTH_TOKEN);
      if (!localUser || !localAuthToken) {
        setIsAuthed(false);
        return;
      }

      const isValid = await validateSessionTokenForUser();
      if (!isValid) {
        localStorage.removeItem(AUTH_USER);
        localStorage.removeItem(AUTH_TOKEN);
        setIsAuthed(false);
        return;
      }

      setIsAuthed(true);
    };
    validateSession();
  }, []);

  return isAuthd;
}

export function AdminRoute({ Component }) {
  const authed = useIsAuthenticated();
  if (authed === null) return <FullScreenLoader />;

  const user = userFromStorage();
  return authed && user?.role === "admin" ? (
    <Component />
  ) : (
    <Navigate to={paths.home()} />
  );
}

export default function PrivateRoute({ Component }) {
  const authed = useIsAuthenticated();
  if (authed === null) return <FullScreenLoader />;

  return authed ? (
    <UserMenu>
      <Component />
    </UserMenu>
  ) : (
    <Navigate to={paths.home()} />
  );
}
