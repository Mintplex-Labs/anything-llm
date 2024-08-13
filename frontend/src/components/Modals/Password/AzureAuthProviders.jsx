import { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import System from "@/models/system";
import logo from "@/media/logo/microsoft-login.png";
import { AUTH_TOKEN, AUTH_USER } from "@/utils/constants";
import paths from "@/utils/paths";

export default function AzureAuthProviders({
  setError,
  setLoading,
  setUser,
  setToken,
}) {
  const [settings, setSettings] = useState(null);
  const { instance, accounts } = useMsal();

  useEffect(() => {
    async function fetchSettings() {
      const _settings = await System.keys();
      setSettings(_settings);
    }
    fetchSettings();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (accounts.length > 0) {
          setError(null);
          setLoading(true);
          const account = accounts[0];
  
          const response = await instance.acquireTokenSilent({
            scopes: ["user.read"],
            account: account
          });
  
          const accessToken = response.accessToken;
          const { valid, user, token } = await System.azureAuth({'accessToken': accessToken});
          
          if (valid && token && user) {
            setUser(user);
            setToken(token);

            console.log('User:', user);
            console.log('Token:', token);
            console.log('Valid:', valid);
  
            window.localStorage.setItem(AUTH_USER, JSON.stringify(user));
            window.localStorage.setItem(AUTH_TOKEN, token);

            const items = [];
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key.includes('login.windows.net') || key.includes('msal.token.keys' || key.includes('msal.account.keys'))){
                window.localStorage.removeItem(key);
              }
            }
            window.location = paths.home();
          }
        }
      } catch (error) {
        setError('Error fetching data or acquiring token:', error);
      }
      setLoading(false);
    };
    
    fetchData();
  }, [accounts, instance]);

  const handleLogin = async () => {
    instance.loginRedirect({
      scopes: ["user.read"],
    });
  };

  return (
    <>
      {settings?.AzureADClientId && (
        <>
          <div>
            <button type="button" onClick={handleLogin}><img src={logo} alt="Sign in with microsoft" width="300px" /></button>
          </div>
          <p className="text-sm text-white/90 text-center my-2">or</p>
        </>
      )}
    </>
  );
}