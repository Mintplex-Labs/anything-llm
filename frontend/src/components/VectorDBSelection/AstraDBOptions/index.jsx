import InputField from "@/components/lib/InputField";

export default function AstraDBOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-4">
        <InputField
          type="url"
          name="AstraDBEndpoint"
          placeholder="Astra DB API endpoint"
          defaultValue={settings?.AstraDBEndpoint}
          required={true}
          autoComplete="off"
          spellCheck={false}
          label="Astra DB Endpoint"
          inputClassName="w-full"
          className="w-60"
        />
        <InputField
          type="password"
          name="AstraDBApplicationToken"
          placeholder="AstraCS:..."
          defaultValue={settings?.AstraDBApplicationToken ? "*".repeat(20) : ""}
          required={true}
          autoComplete="off"
          spellCheck={false}
          label="Astra DB Application Token"
          inputClassName="w-full"
          className="w-60"
        />
      </div>
    </div>
  );
}
