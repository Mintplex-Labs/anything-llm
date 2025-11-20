import { ArrowSquareOut, Info } from "@phosphor-icons/react";
import { AWS_REGIONS } from "./regions";
import { useState } from "react";

export default function AwsBedrockLLMOptions({ settings }) {
  const [connectionMethod, setConnectionMethod] = useState(
    settings?.AwsBedrockLLMConnectionMethod ?? "iam"
  );

  return (
    <div className="w-full flex flex-col">
      {!settings?.credentialsOnly && connectionMethod !== "apiKey" && (
        <div className="flex flex-col md:flex-row md:items-center gap-x-2 text-white mb-4 bg-blue-800/30 w-fit rounded-lg px-4 py-2">
          <div className="gap-x-2 flex items-center">
            <Info size={40} />
            <p className="text-base">
              You should use a properly defined IAM user for inferencing.
              <br />
              <a
                href="https://docs.anythingllm.com/setup/llm-configuration/cloud/aws-bedrock"
                target="_blank"
                className="underline flex gap-x-1 items-center"
                rel="noreferrer"
              >
                Read more on how to use AWS Bedrock in AnythingLLM
                <ArrowSquareOut size={14} />
              </a>
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-y-2 mb-2">
        <input
          type="hidden"
          name="AwsBedrockLLMConnectionMethod"
          value={connectionMethod}
        />
        <div className="flex flex-col w-full">
          <label className="text-theme-text-primary text-sm font-semibold block mb-3">
            Authentication Method
          </label>
          <p className="text-theme-text-secondary text-sm">
            Select the method to authenticate with AWS Bedrock.
          </p>
        </div>
        <select
          name="AwsBedrockLLMConnectionMethod"
          value={connectionMethod}
          required={true}
          onChange={(e) => setConnectionMethod(e.target.value)}
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-fit p-2.5"
        >
          <option value="iam">IAM (Explicit Credentials)</option>
          <option value="sessionToken">
            Session Token (Temporary Credentials)
          </option>
          <option value="iam_role">IAM Role (Implied Credentials)</option>
          <option value="apiKey">Bedrock API Key</option>
        </select>
      </div>

      <div className="w-full flex items-center gap-[36px] my-1.5">
        {["iam", "sessionToken"].includes(connectionMethod) && (
          <>
            <div className="flex flex-col w-60">
              <label className="text-white text-sm font-semibold block mb-3">
                AWS Bedrock IAM Access ID
              </label>
              <input
                type="password"
                name="AwsBedrockLLMAccessKeyId"
                className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                placeholder="AWS Bedrock IAM User Access ID"
                defaultValue={
                  settings?.AwsBedrockLLMAccessKeyId ? "*".repeat(20) : ""
                }
                required={true}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <div className="flex flex-col w-60">
              <label className="text-white text-sm font-semibold block mb-3">
                AWS Bedrock IAM Access Key
              </label>
              <input
                type="password"
                name="AwsBedrockLLMAccessKey"
                className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                placeholder="AWS Bedrock IAM User Access Key"
                defaultValue={
                  settings?.AwsBedrockLLMAccessKey ? "*".repeat(20) : ""
                }
                required={true}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </>
        )}
        {connectionMethod === "sessionToken" && (
          <div className="flex flex-col w-60">
            <label className="text-theme-text-primary text-sm font-semibold block mb-3">
              AWS Bedrock Session Token
            </label>
            <input
              type="password"
              name="AwsBedrockLLMSessionToken"
              className="border-none bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="AWS Bedrock Session Token"
              defaultValue={
                settings?.AwsBedrockLLMSessionToken ? "*".repeat(20) : ""
              }
              required={true}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        )}
        {connectionMethod === "apiKey" && (
          <div className="flex flex-col w-60">
            <label className="text-theme-text-primary text-sm font-semibold block mb-3">
              AWS Bedrock API Key
            </label>
            <input
              type="password"
              name="AwsBedrockLLMAPIKey"
              className="border-none bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="AWS Bedrock API Key"
              defaultValue={settings?.AwsBedrockLLMAPIKey ? "*".repeat(20) : ""}
              required={true}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        )}
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            AWS region
          </label>
          <select
            name="AwsBedrockLLMRegion"
            defaultValue={settings?.AwsBedrockLLMRegion || "us-west-2"}
            required={true}
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          >
            {AWS_REGIONS.map((region) => {
              return (
                <option key={region.code} value={region.code}>
                  {region.name} ({region.code})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="w-full flex items-center gap-[36px] my-1.5">
        {!settings?.credentialsOnly && (
          <>
            <div className="flex flex-col w-60">
              <label className="text-white text-sm font-semibold block mb-3">
                Model ID
              </label>
              <input
                type="text"
                name="AwsBedrockLLMModel"
                className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                placeholder="Model id from AWS eg: meta.llama3.1-v0.1"
                defaultValue={settings?.AwsBedrockLLMModel}
                required={true}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <div className="flex flex-col w-60">
              <label className="text-white text-sm font-semibold block mb-3">
                Model context window
              </label>
              <input
                type="number"
                name="AwsBedrockLLMTokenLimit"
                className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                placeholder="Content window limit (eg: 8192)"
                min={1}
                onScroll={(e) => e.target.blur()}
                defaultValue={settings?.AwsBedrockLLMTokenLimit}
                required={true}
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col w-60">
              <label className="text-white text-sm font-semibold block mb-3">
                Model max output tokens
              </label>
              <input
                type="number"
                name="AwsBedrockLLMMaxOutputTokens"
                className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                placeholder="Max output tokens (eg: 4096)"
                min={1}
                onScroll={(e) => e.target.blur()}
                defaultValue={settings?.AwsBedrockLLMMaxOutputTokens}
                required={true}
                autoComplete="off"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
