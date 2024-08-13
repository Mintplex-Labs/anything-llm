import { useMsal } from '@azure/msal-react';

export default function AzureAuthProviders() {
  const { instance, accounts } = useMsal();

  console.log(accounts);

  const handleLogin = async () => {
    instance.loginRedirect({
      scopes: ["user.read"],
      redirectUri: "http://localhost:3000",
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