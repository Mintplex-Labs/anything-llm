import InputField from "@/components/lib/InputField";

export default function ChromaDBOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-4">
        <InputField
          type="url"
          name="ChromaEndpoint"
          placeholder="http://localhost:8000"
          defaultValue={settings?.ChromaEndpoint}
          required={true}
          autoComplete="off"
          spellCheck={false}
          label="Chroma Endpoint"
          inputClassName="w-full"
          className="w-60"
        />
        <InputField
          type="text"
          name="ChromaApiHeader"
          placeholder="X-Api-Key"
          defaultValue={settings?.ChromaApiHeader}
          autoComplete="off"
          label="API Header"
          inputClassName="w-full"
          className="w-60"
        />
        <InputField
          type="password"
          name="ChromaApiKey"
          placeholder="sk-myApiKeyToAccessMyChromaInstance"
          defaultValue={settings?.ChromaApiKey ? "*".repeat(20) : ""}
          autoComplete="off"
          label="API Key"
          inputClassName="w-full"
          className="w-60"
        />
      </div>
    </div>
  );
}
