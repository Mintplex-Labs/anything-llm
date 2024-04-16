import InputField from "@/components/lib/InputField";

export default function MilvusDBOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-4">
        <InputField
          type="text"
          name="MilvusAddress"
          placeholder="http://localhost:19530"
          defaultValue={settings?.MilvusAddress}
          required={true}
          autoComplete="off"
          spellCheck={false}
          label="Milvus DB Address"
          inputClassName="w-full"
          className="w-60"
        />
        <InputField
          type="text"
          name="MilvusUsername"
          placeholder="username"
          defaultValue={settings?.MilvusUsername}
          autoComplete="off"
          spellCheck={false}
          label="Milvus Username"
          inputClassName="w-full"
          className="w-60"
        />
        <InputField
          type="password"
          name="MilvusPassword"
          placeholder="password"
          defaultValue={settings?.MilvusPassword ? "*".repeat(20) : ""}
          autoComplete="off"
          spellCheck={false}
          label="Milvus Password"
          inputClassName="w-full"
          className="w-60"
        />
      </div>
    </div>
  );
}
