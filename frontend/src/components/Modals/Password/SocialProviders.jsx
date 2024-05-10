import System from "@/models/system";
import { AUTH_TOKEN, AUTH_USER } from "@/utils/constants";
import paths from "@/utils/paths";
import { GoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";

export default function SocialProviders({
  setError,
  setLoading,
  setUser,
  setToken,
}) {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    async function fetchSettings() {
      const _settings = await System.keys();
      setSettings(_settings);
    }
    fetchSettings();
  }, []);

  const handleGoogleLogin = async (data) => {
    setError(null);
    setLoading(true);
    const { valid, user, token, message } = await System.socialLogin(
      data,
      "google"
    );
    if (valid && !!token && !!user) {
      setUser(user);
      setToken(token);

      window.localStorage.setItem(AUTH_USER, JSON.stringify(user));
      window.localStorage.setItem(AUTH_TOKEN, token);
      window.location = paths.home();
    } else {
      setError(message);
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <>
      {settings?.GoogleAuthClientId && (
        <>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              handleGoogleLogin(credentialResponse);
            }}
            onError={() => {
              setError("Something went wrong");
            }}
            theme={"filled_black"}
          />
          {/* Add here other social providers */}
          <p className="text-sm text-white/90 text-center my-2">or</p>
        </>
      )}
    </>
  );
}
