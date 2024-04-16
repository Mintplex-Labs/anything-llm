import InputField from "@/components/lib/InputField";

export default function ZillizCloudOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-4">
        <InputField
          type="text"
          name="ZillizEndpoint"
          placeholder="https://sample.api.gcp-us-west1.zillizcloud.com"
          defaultValue={settings?.ZillizEndpoint}
          required={true}
          autoComplete="off"
          spellCheck={false}
          label="Cluster Endpoint"
          inputClassName="w-full"
          className="w-60"
        />
        <InputField
          type="password"
          name="ZillizApiToken"
          placeholder="Zilliz cluster API Token"
          defaultValue={settings?.ZillizApiToken ? "*".repeat(20) : ""}
          autoComplete="off"
          spellCheck={false}
          label="API Token"
          inputClassName="w-full"
          className="w-60"
        />
      </div>
    </div>
  );
}
