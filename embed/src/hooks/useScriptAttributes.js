import { useEffect, useState } from "react";
import { embedderSettings } from "../main";

const DEFAULT_SETTINGS = {
  embedId: null, //required
  baseApiUrl: null, // required

  // Override properties that can be defined.
  prompt: null, // override
  model: null, // override
  temperature: null, //override

  // style parameters
  chatIcon: "plus",
  brandImageUrl: null, // will be forced into 100x50px container
  greeting: null, // empty chat window greeting.
  buttonColor: "#262626", // must be hex color code
  userBgColor: "#2C2F35", // user text bubble color
  assistantBgColor: "#2563eb", // assistant text bubble color
  noSponsor: null, // Shows sponsor in footer of chat
  sponsorText: "Powered by AnythingLLM", // default sponsor text
  sponsorLink: "https://useanything.com", // default sponsor link
  position: "bottom-right", // position of chat button/window

  // behaviors
  openOnLoad: "off", // or "on"
  supportEmail: null, // string of email for contact
};

export default function useGetScriptAttributes() {
  const [settings, setSettings] = useState({
    loaded: false,
    ...DEFAULT_SETTINGS,
  });

  useEffect(() => {
    function fetchAttribs() {
      if (!document) return false;
      if (
        !embedderSettings.settings.baseApiUrl ||
        !embedderSettings.settings.embedId
      )
        throw new Error(
          "[AnythingLLM Embed Module::Abort] - Invalid script tag setup detected. Missing required parameters for boot!"
        );

      setSettings({
        ...DEFAULT_SETTINGS,
        ...embedderSettings.settings,
        loaded: true,
      });
    }
    fetchAttribs();
  }, [document]);

  return settings;
}
