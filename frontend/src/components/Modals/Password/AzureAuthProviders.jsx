import React, { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';

export default function AzureAuthProviders() {
  const { instance, accounts } = useMsal();

  if (accounts.length > 0) {
    instance.setActiveAccount(accounts[0]);
  }

  console.log(accounts);

  useEffect(() => {
    if (accounts && accounts.length > 0) { // Check if accounts is not empty
      instance.acquireTokenSilent({
        scopes: ["user.read"],
        account: accounts[0] // Use the first account in the array
      }).then(response => {
        console.log('Token acquired', response.accessToken);
      }).catch(error => {
        console.error('Error acquiring token', error);
      });
    }
  }, [instance, accounts]);

  const handleLogin = async () => {
    instance.loginRedirect({
      scopes: ["user.read"],
      redirectUri: "http://localhost:3000",
      authority: "https://login.microsoftonline.com/common",
      extraQueryParameters: {
        "prompt": "select_account"
      },
      authenticationScheme: "Bearer",
      tokenQueryParameters: {
        "response_type": "code",
        "response_mode": "query",
        "scope": "openid profile email",
        "state": "12345",
        "nonce": "678910"
      },
      account: accounts[0]
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