import { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';

export default function AzureAuthProviders() {
  const { instance, accounts } = useMsal();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const response = await instance.handleRedirectPromise();
        if (response) {
          // Successfully handled redirect
          console.log('User Account:', response.account);
        }
      } catch (error) {
        console.error('Error handling redirect:', error);
        // Handle error (e.g., show a message to the user)
      }
    };

    if (accounts.length === 0) {
      handleRedirect();
    } else {
      const account = accounts[0];

      instance.acquireTokenSilent({
        scopes: ["user.read"],
        account: account
      }).then(response => {
        console.log('Access Token:', response.accessToken);
        // You can also use the accessToken to call APIs or fetch user data
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