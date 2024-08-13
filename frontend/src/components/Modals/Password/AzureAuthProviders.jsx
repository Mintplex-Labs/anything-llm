import { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';

export default function AzureAuthProviders() {
  const { instance, accounts } = useMsal();

  useEffect(() => {
    if (accounts.length > 0) {
      const account = accounts[0];
      console.log('User Account:', account);
      instance.acquireTokenSilent({
        scopes: ["user.read"],
        account: account
      }).then(response => {
        console.log('Access Token:', response.accessToken);
      }).catch(error => {
        console.error('Token acquisition failed', error);
      });
    }
  }, [accounts, instance]);

  const handleLogin = async () => {
    instance.loginRedirect({
      scopes: ["user.read"],
    });
  };

  return (
    <>
      <div>
        <button type="button" onClick={handleLogin}>Sign in</button>
      </div>
      <p className="text-sm text-white/90 text-center my-2">or</p>
    </>
  );
}