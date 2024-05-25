```javascript
import React, { useEffect, useState } from "react";
import System from "../../../models/system";
import { AUTH_TOKEN } from "../../../utils/constants";
import paths from "../../../utils/paths";
import ModalWrapper from "@/components/ModalWrapper";
import { useModal } from "@/hooks/useModal";
import RecoveryCodeModal from "@/components/Modals/DisplayRecoveryCodeModal";

export default function SingleUserAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [token, setToken] = useState(null);
  const [customAppName, setCustomAppName] = useState(null);

  const {
    isOpen: isRecoveryCodeModalOpen,
    openModal: openRecoveryCodeModal,
    closeModal: closeRecoveryCodeModal,
  } = useModal();

  const handleLogin = async (e) => {
    setError(null);
    setLoading(true);
    e.preventDefault();
    const data = {};
    const form = new FormData(e.target);
    for (var [key, value] of form.entries()) data[key] = value;
    const { valid, token, message, recoveryCodes } =
      await System.requestToken(data);
    if (valid && !!token) {
      setToken(token);
      if (recoveryCodes) {
        setRecoveryCodes(recoveryCodes);
        openRecoveryCodeModal();
      } else {
        window.localStorage.setItem(AUTH_TOKEN, token);
        window.location = paths.home();
      }
    } else {
      setError(message);
      setLoading(false);
    }
    setLoading(false);
  };

  const handleDownloadComplete = () => {
    setDownloadComplete(true);
  };

  useEffect(() => {
    if (downloadComplete && token) {
      window.localStorage.setItem(AUTH_TOKEN, token);
      window.location = paths.home();
    }
  }, [downloadComplete, token]);

  useEffect(() => {
    const fetchCustomAppName = async () => {
      const { appName } = await System.fetchCustomAppName();
      setCustomAppName(appName || "");
      setLoading(false);
    };
    fetchCustomAppName();
  }, []);

  return (
    <>
      <form onSubmit={handleLogin}>
        <div className="flex flex-col justify-center items-center relative rounded-2xl md:bg-login-gradient md:shadow-[0_4px_14px_rgba(0,0,0,0.25)] md:px-12 py-12 -mt-36 md:-mt-10">
          <div className="flex items-start justify-between pt-11 pb-9 rounded-t">
            <div className="flex items-center flex-col gap-y-4">
              <div className="flex gap-x-1">
                <h3 className="text-md md:text-2xl font-bold text-white text-center white-space-nowrap hidden md:block">
                  Welcome to
                </h3>
                <p className="text-4xl md:text-2xl font-bold bg-gradient-to-r from-[#75D6FF] via-[#FFFFFF] to-[#FFFFFF] bg-clip-text text-transparent">
                  {customAppName || "AnythingLLM"}
                </p>
              </div>
              <p className="text-sm text-white/90 text-center">
                Sign in to your {customAppName || "AnythingLLM"} instance.
              </p>
            </div>
          </div>
          <div className="w-full px-4 md:px-12">
            <div className="w-full flex flex-col gap-y-4">
              <div className="w-screen md:w-full md:px-0 px-6">
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="bg-zinc-900 text-white placeholder-white/20 text-sm rounded-md p-2.5 w-full h-[48px] md:w-[300px] md:h-[34px]"
                  required={true}
                  autoComplete="off"
                />
              </div>

              {error && <p className="text-red-400 text-sm">Error: {error}</p>}
            </div>
          </div>
          <div className="flex items-center md:p-12 px-10 mt-12 md:mt-0 space-x-2 border-gray-600 w-full flex-col gap-y-8">
            <button
              disabled={loading}
              type="submit"
              className="md:text-[#46C8FF] md:bg-transparent text-[#222628] text-sm font-bold focus:ring-4 focus:outline-none rounded-md border-[1.5px] border-[#46C8FF] md:h-[34px] h-[48px] md:hover:text-white md:hover:bg-[#46C8FF] bg-[#46C8FF] focus:z-10 w-full"
            >
              {loading ? "Validating..." : "Login"}
            </button>
          </div>
        </div>
      </form>

      <ModalWrapper isOpen={isRecoveryCodeModalOpen}>
        <RecoveryCodeModal
          recoveryCodes={recoveryCodes}
          onDownloadComplete={handleDownloadComplete}
          onClose={closeRecoveryCodeModal}
        />
      </ModalWrapper>
    </>
  );
}

```
# Comprehensive Documentation for Login Interface

## Purpose and Usage

The login interface is designed to provide a secure and user-friendly way for users to sign into their {customAppName || "AnythingLLM"} instance. This interface handles token requests, password authentication, and recovery code management.

### Method Documentation

#### handleLogin

* Signature: `handleLogin(e: any): Promise<void>`
* Purpose: Submit the login form and validate the user's credentials.
* Parameters:
	+ e (any): The event object representing the form submission.
* Return type: `Promise<void>`

The method submits the login form, extracts the form data, and sends a request to the server to authenticate the user. If the authentication is successful, it sets the token and recovery codes, and redirects the user to the home page. Otherwise, it displays an error message.

#### handleDownloadComplete

* Signature: `handleDownloadComplete(): void`
* Purpose: Update the download completion state.
* Parameters: None
* Return type: `void`

This method is called when the download process is complete and updates the `downloadComplete` state to reflect this change.

#### useEffect (1)

* Signature: `useEffect(() => { ... }, [downloadComplete, token]): void`
* Purpose: Set the authentication token in local storage and redirect the user to the home page when the download is complete.
* Parameters:
	+ downloadComplete (boolean): The state indicating whether the download is complete.
	+ token (string): The authentication token obtained from the server.
* Return type: `void`

This effect sets the authentication token in local storage and redirects the user to the home page only when the download is complete.

#### useEffect (2)

* Signature: `useEffect(() => { ... }, []): void`
* Purpose: Fetch custom app name and set it as a state variable.
* Parameters: None
* Return type: `void`

This effect fetches the custom app name from the server and sets it as a state variable. It also sets the loading state to false.

## Examples

1. User submits the login form with correct credentials:
```javascript
const formData = new FormData();
formData.append('password', 'correct_password');
handleLogin(formData);
```
2. User submits the login form with incorrect credentials:
```javascript
const formData = new FormData();
formData.append('password', 'incorrect_password');
handleLogin(formData);
```
## Dependencies

The login interface depends on:

* The `System` module for token requests and custom app name fetching.
* The `paths` object for redirecting to the home page.

## Clarity and Consistency

This documentation aims to provide a clear and concise understanding of the login interface's purpose, usage, and methods. It is organized in a consistent style throughout, using headings, paragraphs, and bullet points to convey information effectively.