import { useState } from "react";
import System from "@/models/system";

export default function GithubCopilotOptions({ settings }) {
  return (
    <div className="flex flex-col gap-y-7">
      <div className="flex gap-[36px] mt-1.5 flex-wrap">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            GH Token
          </label>
          <input
            type="password"
            name="GithubCopilotToken"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="GitHub personal access token"
            defaultValue={
              settings?.GithubCopilotToken ? "*".repeat(20) : ""
            }
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Model
          </label>
          <select
            name="GithubCopilotModelPref"
            defaultValue={settings?.GithubCopilotModelPref || "auto"}
            className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          >
            <option value="auto">Auto (recommended)</option>
            <option value="gpt-5.6-sol">GPT-5.6 Sol</option>
            <option value="gpt-5.6-terra">GPT-5.6 Terra</option>
            <option value="gpt-5.6-luna">GPT-5.6 Luna</option>
            <option value="gpt-5.5">GPT-5.5</option>
            <option value="gpt-5.4">GPT-5.4</option>
            <option value="gpt-5.4-mini">GPT-5.4 mini</option>
            <option value="gpt-5.3-codex">GPT-5.3-Codex</option>
            <option value="gpt-5-mini">GPT-5 mini</option>
            <option value="claude-sonnet-5">Claude Sonnet 5</option>
            <option value="claude-sonnet-4.6">Claude Sonnet 4.6</option>
            <option value="claude-sonnet-4.5">Claude Sonnet 4.5</option>
            <option value="claude-haiku-4.5">Claude Haiku 4.5</option>
            <option value="claude-opus-4.8">Claude Opus 4.8</option>
            <option value="claude-opus-4.7">Claude Opus 4.7</option>
            <option value="claude-opus-4.6">Claude Opus 4.6</option>
            <option value="claude-opus-4.5">Claude Opus 4.5</option>
            <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro</option>
          </select>
        </div>
        <GithubCopilotAuth settings={settings} />
      </div>
      <div className="flex gap-[36px] flex-wrap">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Model context window
          </label>
          <input
            type="number"
            name="GithubCopilotTokenLimit"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Content window limit (eg: 4096)"
            min={1}
            onScroll={(e) => e.target.blur()}
            defaultValue={settings?.GithubCopilotTokenLimit || "4096"}
            required={true}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * GitHub Copilot device OAuth component.
 * Shows a "Connect with GitHub" button → initiates device flow → displays code → polls → saves token.
 */
function GithubCopilotAuth({ settings }) {
  const [phase, setPhase] = useState(
    settings?.GithubCopilotToken ? "done" : "idle"
  );
  const [deviceAuth, setDeviceAuth] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const startDeviceAuth = async () => {
    setPhase("loading");
    setError("");
    const res = await System.initCopilotDeviceAuth();
    if (res.error) {
      setError(res.error);
      setPhase("error");
      return;
    }
    setDeviceAuth(res);
    setPhase("show-code");
    pollForToken(res.device_code);
  };

  const pollForToken = async (deviceCode) => {
    setPhase("polling");
    const res = await System.completeCopilotDeviceAuth(deviceCode);
    if (res.access_token) {
      setPhase("done");
      const input = document.querySelector(
        'input[name="GithubCopilotToken"]'
      );
      if (input) {
        const nativeSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        ).set;
        nativeSetter.call(input, res.access_token);
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    } else if (res.error) {
      if (res.error.includes("timed out")) {
        setError("Device authorization timed out. Please try again.");
        setPhase("error");
      } else {
        setTimeout(() => pollForToken(deviceCode), 3000);
      }
    } else {
      setTimeout(() => pollForToken(deviceCode), 3000);
    }
  };

  const copyCode = () => {
    if (deviceAuth?.user_code) {
      navigator.clipboard.writeText(deviceAuth.user_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (phase === "done") {
    return (
      <div className="flex flex-col w-fit">
        <label className="text-white text-sm font-semibold block mb-3">
          Connection
        </label>
        <div className="flex items-center gap-x-2 bg-theme-settings-input-bg rounded-lg p-2.5 border border-green-500/50">
          <span className="text-green-400 text-sm">✓ Connected</span>
          <button
            type="button"
            onClick={() => {
              setPhase("idle");
              setDeviceAuth(null);
              const input = document.querySelector(
                'input[name="GithubCopilotToken"]'
              );
              if (input) {
                const nativeSetter = Object.getOwnPropertyDescriptor(
                  window.HTMLInputElement.prototype,
                  "value"
                ).set;
                nativeSetter.call(input, "");
                input.dispatchEvent(new Event("input", { bubbles: true }));
              }
            }}
            className="text-xs text-gray-400 hover:text-white underline ml-2"
          >
            Reconnect
          </button>
        </div>
      </div>
    );
  }

  if (phase === "loading") {
    return (
      <div className="flex flex-col w-fit">
        <label className="text-white text-sm font-semibold block mb-3">
          Authentication
        </label>
        <div className="bg-theme-settings-input-bg rounded-lg p-2.5">
          <span className="text-gray-400 text-sm animate-pulse">
            Connecting to GitHub...
          </span>
        </div>
      </div>
    );
  }

  if (phase === "idle" || phase === "error") {
    return (
      <div className="flex flex-col w-fit">
        <label className="text-white text-sm font-semibold block mb-3">
          Authentication
        </label>
        <button
          type="button"
          onClick={startDeviceAuth}
          className="bg-primary-button text-white text-sm px-6 py-2.5 rounded-lg hover:bg-primary-button/90 transition-all flex items-center gap-x-2"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          Connect with GitHub
        </button>
        {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-fit">
      <label className="text-white text-sm font-semibold block mb-3">
        Authentication
      </label>
      <div className="bg-theme-settings-input-bg rounded-lg p-4 border border-primary-button/20 max-w-xs">
        <p className="text-white text-xs mb-2">
          1. Visit{" "}
          <span className="text-blue-400 font-mono">
            {deviceAuth?.verification_uri}
          </span>
        </p>
        <p className="text-white text-xs mb-3">2. Enter this code:</p>
        <div className="flex items-center gap-x-2 mb-3">
          <code className="bg-black/30 text-primary-button text-2xl font-bold font-mono px-4 py-2 rounded-lg tracking-[0.2em] select-all">
            {deviceAuth?.user_code}
          </code>
          <button
            type="button"
            onClick={copyCode}
            className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded transition-all"
          >
            {copied ? "✓" : "Copy"}
          </button>
        </div>
        <div className="flex items-center gap-x-2">
          {phase === "polling" ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-button border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-400 text-xs">
                Waiting for authorization...
              </span>
            </>
          ) : (
            <span className="text-green-400 text-xs">
              Code displayed. Authorize on GitHub.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
