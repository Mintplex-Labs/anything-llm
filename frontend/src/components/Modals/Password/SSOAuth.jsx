import React, { useEffect, useState } from "react";
import System from "../../../models/system";

export default function SSOButton() {
  const [ssoUrl, setSsoUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSSO() {
      const { url, error } = await System.fetchssoButton();
      if (!error && typeof url === "string") {
        setSsoUrl(url);
      }
      setLoading(false);
    }
    fetchSSO();
  }, []);

  if (loading || ssoUrl === "") return null;

  const handleSSORedirect = () => {
    window.location.href = ssoUrl;
  };

  return (
    <button
      type="button"
      onClick={handleSSORedirect}
      className="appearance-none leading-normal md:text-primary-button md:bg-transparent text-dark-text text-sm font-bold focus:ring-4 focus:outline-none rounded-md border-[1.5px] border-primary-button md:h-[34px] h-[48px] md:hover:text-white md:hover:bg-primary-button bg-primary-button focus:z-10 w-full md:w-[300px]"
    >
      Sign in with SSO
    </button>
  );
}
