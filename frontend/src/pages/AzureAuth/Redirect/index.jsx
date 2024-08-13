import React,  { useEffect } from "react";
import { useMsal } from '@azure/msal-react';

export default function Redirect() {
  const { instance } = useMsal();

  useEffect(() => {
    instance.handleRedirectPromise().then(response => {
      if (response) {
        console.log('Login successful', response);
      }
    });
  }, [instance]);

  return <div>Loading...</div>;
}
