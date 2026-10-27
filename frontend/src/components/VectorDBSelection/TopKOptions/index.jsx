// @see https://docs.topk.io/regions
const REGIONS = [
  { value: "aws-us-east-1-elastica", label: "AWS us-east-1 (N. Virginia)" },
  { value: "aws-eu-central-1-monstera", label: "AWS eu-central-1 (Frankfurt)" },
  { value: "gcp-us-east4-aloe", label: "GCP us-east4 (N. Virginia)" },
];

export default function TopKOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            API Key
          </label>
          <input
            type="password"
            name="TopKApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="TopK API Key"
            defaultValue={settings?.TopKApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Region
          </label>
          <select
            name="TopKRegion"
            defaultValue={settings?.TopKRegion || REGIONS[0].value}
            className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
          >
            {REGIONS.map((region) => (
              <option key={region.value} value={region.value}>
                {region.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
