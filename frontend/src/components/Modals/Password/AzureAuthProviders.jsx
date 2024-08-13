import { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import System from "@/models/system";
import logo from "@/media/logo/microsoft-login.png";

export default function AzureAuthProviders({
  setUser,
  setToken,
}) {
  const { instance, accounts } = useMsal();

  useEffect(() => {
    const fetchData = async () => {
      if (accounts.length > 0) {
        const { valid, user, token } = await System.azureAuth(accounts[0]);
        if (valid && !!token && !!user) {
          setUser(user);
          setToken(token);
  
          window.localStorage.setItem(AUTH_USER, JSON.stringify(user));
          window.localStorage.setItem(AUTH_TOKEN, token);
          window.location = paths.home();
        }
        const account = accounts[0];
  
        console.log('User Account:', account);
      }
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
      <div>
        <button type="button" onClick={handleLogin}><img src={logo} alt="Sign in with microsoft" width="300px" /></button>
      </div>
      <p className="text-sm text-white/90 text-center my-2">or</p>
    </>
  );
}