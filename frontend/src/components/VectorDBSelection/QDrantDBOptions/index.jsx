import InputField from "@/components/lib/InputField";

export default function QDrantDBOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-4">
        <InputField
          type="url"
          name="QdrantEndpoint"
          placeholder="http://localhost:6633"
          defaultValue={settings?.QdrantEndpoint}
          required={true}
          autoComplete="off"
          spellCheck={false}
          label="QDrant API Endpoint"
          inputClassName="w-full"
          className="w-60"
        />
        <InputField
          type="password"
          name="QdrantApiKey"
          placeholder="wOeqxsYP4....1244sba"
          defaultValue={settings?.QdrantApiKey}
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
