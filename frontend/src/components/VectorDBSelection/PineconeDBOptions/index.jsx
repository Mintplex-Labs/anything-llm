import InputField from "@/components/lib/InputField";

export default function PineconeDBOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-4">
        <InputField
          type="password"
          name="PineConeKey"
          placeholder="Pinecone API Key"
          defaultValue={settings?.PineConeKey ? "*".repeat(20) : ""}
          required={true}
          autoComplete="off"
          spellCheck={false}
          label="Pinecone DB API Key"
          inputClassName="w-full"
          className="w-60"
        />
        <InputField
          type="text"
          name="PineConeIndex"
          placeholder="my-index"
          defaultValue={settings?.PineConeIndex}
          required={true}
          autoComplete="off"
          spellCheck={false}
          label="Pinecone Index Name"
          inputClassName="w-full"
          className="w-60"
        />
      </div>
    </div>
  );
}
