/**
 * Opens Azure AD sign-in (popup) and returns the ID token for server exchange.
 * @param {{ AzureAdTenantId: string|null, AzureAdClientId: string|null, AzureAdRedirectUri: string|null }} settings From System.keys()
 * @returns {Promise<string>}
 */
export async function fetchAzureIdTokenInteractive(settings) {
  const { PublicClientApplication } = await import("@azure/msal-browser");
  const tenant = settings?.AzureAdTenantId;
  const clientId = settings?.AzureAdClientId;
  if (!tenant || !clientId) {
    throw new Error("Azure AD is not configured.");
  }

  const redirectUri =
    settings?.AzureAdRedirectUri || `${window.location.origin}/`;

  const pca = new PublicClientApplication({
    auth: {
      clientId,
      authority: `https://login.microsoftonline.com/${tenant}`,
      redirectUri,
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: true,
    },
  });

  await pca.initialize();

  const loginRequest = {
    scopes: ["openid", "profile", "email"],
  };

  const result = await pca.loginPopup(loginRequest);
  const idToken = result?.idToken;
  if (!idToken) {
    throw new Error("No ID token returned from Microsoft.");
  }
  return idToken;
}
