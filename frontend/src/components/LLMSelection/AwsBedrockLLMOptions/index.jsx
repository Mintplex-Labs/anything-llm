import { ArrowSquareOut, Info } from "@phosphor-icons/react";
import { AWS_REGIONS } from "./regions";
import { useState } from "react";

export default function AwsBedrockLLMOptions({ settings }) {
  const [useIamRole, setUseIamRole] = useState(
    settings?.AwsBedrockLLMConnectionMethod === "iam_role"
  );

  return (
    <div className="w-full flex flex-col">
      {!settings?.credentialsOnly && (
        <div className="flex flex-col md:flex-row md:items-center gap-x-2 text-white mb-4 bg-blue-800/30 w-fit rounded-lg px-4 py-2">
          <div className="gap-x-2 flex items-center">
            <Info size={40} />
            <p className="text-base">
              You should use a properly defined IAM role for inferencing.
              <br />
              <a
                href="https://docs.anythingllm.com/setup/llm-configuration/cloud/aws-bedrock"
                target="_blank"
                className="underline flex gap-x-1 items-center"
              >
                Read more on how to use AWS Bedrock in AnythingLLM
                <ArrowSquareOut size={14} />
              </a>
            </p>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-y-2">
        <input
          type="hidden"
          name="AwsBedrockLLMConnectionMethod"
          value={useIamRole ? "iam_role" : "iam_user"}
        />
        <div className="flex flex-col w-full">
          <label className="text-white text-sm font-semibold block mb-3">
            Use IAM Role
          </label>
          <p className="text-white/50 text-sm">
            Select the method to authenticate with AWS Bedrock.
          </p>
        </div>
        <div className="flex items-center justify-start gap-x-4 bg-zinc-900 p-2.5 rounded-lg w-fit">
          <span
            className={`text-sm ${!useIamRole ? "text-white" : "text-white/50"}`}
          >
            Explicit Credentials
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={useIamRole}
              onChange={(e) => setUseIamRole(e.target.checked)}
            />
            <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-button"></div>
          </label>
          <span
            className={`text-sm ${useIamRole ? "text-white" : "text-white/50"}`}
          >
            IAM Role
          </span>
        </div>
      </div>
      {!useIamRole && (
        <div className="w-full flex items-center gap-[36px] my-1.5">
          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-3">
              AWS Bedrock IAM Access ID
            </label>
            <input
              type="password"
              name="AwsBedrockLLMAccessKeyId"
              className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="AWS Bedrock IAM User Access ID"
              defaultValue={
                settings?.AwsBedrockLLMAccessKeyId ? "*".repeat(20) : ""
              }
              required={!useIamRole}
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
              className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="AWS Bedrock IAM User Access Key"
              defaultValue={
                settings?.AwsBedrockLLMAccessKey ? "*".repeat(20) : ""
              }
              required={!useIamRole}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>
      )}
      <div className="w-full flex items-center gap-[36px] my-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            AWS region
          </label>
          <select
            name="AwsBedrockLLMRegion"
            defaultValue={settings?.AwsBedrockLLMRegion || "us-west-2"}
            required={true}
            className="border-none bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
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
                className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
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
                className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                placeholder="Content window limit (eg: 4096)"
                min={1}
                onScroll={(e) => e.target.blur()}
                defaultValue={settings?.AwsBedrockLLMTokenLimit}
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
