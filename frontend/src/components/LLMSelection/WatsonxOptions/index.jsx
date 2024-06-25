import { useState } from "react";

export default function WatsonxOptions({ settings }) {
  const [GuardRailsEnabled, setGuardRailsEnabled] = useState(settings?.WatsonxGuardRailsEnabled === "False" ? false : true || false);
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Watsonx.ai Endpoint
          </label>
          <input
            type="url"
            name="WatsonxEndpoint"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="https://eu-de.ml.cloud.ibm.com"
            defaultValue={settings?.WatsonxEndpoint}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            API Key
          </label>
          <input
            type="password"
            name="IBMIAMKey"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="IBM IAM API Key"
            defaultValue={settings?.IBMIAMKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Project ID
          </label>
          <input
            type="text"
            name="WatsonxProjectID"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="Watsonx.ai Project ID"
            defaultValue={settings?.WatsonxProjectID}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>

      <div className="w-full flex items-center gap-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Chat Model
          </label>
          <select
            name="WatsonxModel"
            defaultValue={settings?.WatsonxModel || "ibm/granite-20b-multilingual"}
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            required={true}
          >
            <option value={"granite-13b-chat-v2"}>granite-13b-chat-v2 </option>
            <option value={"jais-13b-chat"}>jais-13b-chat </option>
            <option value={"merlinite-7b"}>merlinite-7b </option>
            <option value={"granite-13b-instruct-v2"}>granite-13b-instruct-v2</option>
            <option value={"ibm/granite-20b-multilingual"}>granite-20b-multilingual</option>
            <option value={"llama-2-13b-chat"}>llama-2-13b-chat</option>
            <option value={"llama-2-70b-chat"}>llama-2-70b-chat</option>
            <option value={"llama-3-70b-instruct"}>llama-3-70b-instruct</option>
            <option value={"llama-3-8b-instruct"}>llama-3-8b-instruct </option>
            <option value={"mixtral-8x7b-instruct-v01"}>mixtral-8x7b-instruct-v01</option>
            <option value={"allam-1-13b-instruct"}>allam-1-13b-instruct</option>
          </select>
        </div>

        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Embedding Deployment Name
          </label>
          <input
            type="text"
            name="WatsonxEmbeddingModelPref"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="Watsonx embedding model deployment name"
            defaultValue={settings?.WatsonxEmbeddingModelPref || "baai/bge-large-en-v1"}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex-flex-col w-60"><label className="text-white text-sm font-semibold block mb-4">
            Enable GuardRails
          </label>
            <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  onClick={() => setGuardRailsEnabled(!GuardRailsEnabled)}
                  checked={GuardRailsEnabled}
                  className="peer sr-only pointer-events-none"
                  defaultChecked={GuardRailsEnabled}
                  name="WatsonxGuardRailsEnabled"
                  //required={true}
                />
                <div
                  className="pointer-events-none peer h-6 w-11 rounded-full bg-stone-400 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border after:border-gray-600 after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-lime-300 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800"
                ></div>
          </label>
        </div>
      </div>
    </div>
  );
}
