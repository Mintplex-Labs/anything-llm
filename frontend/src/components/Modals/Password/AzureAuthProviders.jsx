import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';

export default function AzureAuthProviders({}) {
  const msalConfig = {
    auth: {
      clientId: 'YOUR_CLIENT_ID', // Replace with your client ID
      authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID', // Replace with your tenant ID
      redirectUri: 'http://localhost:3000/', // Replace with your app's redirect URI
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false,
    },
  };

  const pca = new PublicClientApplication(msalConfig);

  return (
    <>
      <MsalProvider instance={pca}>
        <App />
      </MsalProvider>
    </>
  );
}