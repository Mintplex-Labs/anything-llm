export default function LlamaStackOptions({ settings }) {
    return (
        <div className="w-full flex flex-col gap-y-7">
            <div className="w-full flex items-center gap-[36px] mt-1.5">
                <div className="flex flex-col w-60">
                    <label className="text-white text-sm font-semibold block mb-3">
                        LlamaStack Endpoint
                    </label>
                    <input
                        type="text"
                        name="LlamaStackEndpoint"
                        className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                        placeholder="http://localhost:8321"
                        defaultValue={settings?.LlamaStackEndpoint || "http://localhost:8321"}
                        required={true}
                        autoComplete="off"
                        spellCheck={false}
                    />
                </div>
            </div>
        </div>
    );
}
