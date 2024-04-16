import InputField from "@/components/lib/InputField";

export default function WeaviateDBOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-4">
        <InputField
          type="url"
          name="WeaviateEndpoint"
          placeholder="http://localhost:8080"
          defaultValue={settings?.WeaviateEndpoint}
          required={true}
          autoComplete="off"
          spellCheck={false}
          label="Weaviate Endpoint"
          inputClassName="w-full"
          className="w-60"
        />
        <InputField
          type="password"
          name="WeaviateApiKey"
          placeholder="sk-123Abcweaviate"
          defaultValue={settings?.WeaviateApiKey}
          autoComplete="off"
          spellCheck={false}
          label="API Key"
          inputClassName="w-full"
          className="w-60"
        />
      </div>
    </div>
  );
}
