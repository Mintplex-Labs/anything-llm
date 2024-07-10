import { useState } from "react";

export default function WatsonxOptions({ settings }) {
  console.log(settings)
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
            <option value={"sdaia/allam-1-13b-instruct"}>allam-1-13b-instruct</option>
            <option value={"codellama/codellama-34b-instruct-hf"}>codellama-34b-instruct-hf</option>
            <option value={"elyza/elyza-japanese-llama-2-7b-instruct"}>elyza-japanese-llama-2-7b-instruct</option>
            <option value={"google/flan-t5-xxl"}>flan-t5-xxl-11b</option>
            <option value={"google/flan-ul2"}>flan-ul2-20b </option>
            <option value={"ibm/granite-8b-japanese"}>ibm/granite-8b-japanese</option>
            <option value={"ibm/granite-13b-chat-v2"}>granite-13b-chat-v2</option>
            <option value={"ibm/granite-20b-multilingual"}>granite-20b-multilingual</option>
            <option value={"ibm/granite-3b-code-instruct"}>granite-3b-code-instruct</option>
            <option value={"ibm/granite-8b-code-instruct"}>granite-8b-code-instruct</option>
            <option value={"ibm/granite-20b-code-instruct"}>granite-20b-code-instruct</option>
            <option value={"ibm/granite-34b-code-instruct"}>granite-34b-code-instruct</option>
            <option value={"core42/jais-13b-chat"}>jais-13b-chat</option>
            <option value={"meta-llama/llama-3-8b-instruct"}>llama-3-8b-instruct</option>
            <option value={"meta-llama/llama-3-70b-instruct"}>llama-3-70b-instruct</option>
            <option value={"meta-llama/llama-2-13b-chat"}>llama-2-13b-chat</option>
            <option value={"meta-llama/llama-2-70b-chat"}>llama-2-70b-chat</option>
            <option value={"mnci/llama2-13b-dpo-v7"}>llama2-13b-dpo-v7</option>
            <option value={"mistralai/mixtral-8x7b-instruct-v01"}>mixtral-8x7b-instruct-v01</option>
            <option value={"ibm-mistralai/mixtral-8x7b-instruct-v01-q"}>mixtral-8x7b-instruct-v01-q</option>
            <option value={"bigscience/mt0-xxl"}>mt0-xxl</option>
            <option value={"intfloat/multilingual-e5-large"}>multilingual-e5-large</option>
          </select>
        </div>

        
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Chat Model Token Limit
          </label>
          <input
            type="text"
            name="WatsonxTokenLimit"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="Uses max token per default"
            defaultValue={settings?.WatsonxTokenLimit}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
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
