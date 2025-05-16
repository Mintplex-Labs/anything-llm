export default function FlowiseAiOptions({ settings }) {
  return (
    <div className="flex gap-[36px] mt-1.5">
      <div className="flex flex-col w-60">
        <div className="flex justify-between items-center mb-2">
          <label className="text-white text-sm font-semibold">
            Flowise Base URL
          </label>
        </div>
        <input
          type="url"
          name="FlowiseLLMBasePath"
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder="http://localhost:3000/v1"
          defaultValue={settings?.FlowiseLLMBasePath}
          required={true}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <div className="flex flex-col w-30">
        <div className="flex justify-between items-center mb-2">
          <label className="text-white text-sm font-semibold">
            Flowise Chatflow ID
          </label>
        </div>
        <input
          type="text"
          name="FlowiseLLMChatflowId"
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder=""
          defaultValue={settings?.FlowiseLLMChatflowId}
          required={true}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <div className="flex flex-col w-30">
        <div className="flex justify-between items-center mb-2">
          <label className="text-white text-sm font-semibold">
            Flowise Token Limit
          </label>
        </div>
        <input
          type="number"
          name="FlowiseLLMTokenLimit"
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder=""
          defaultValue={settings?.FlowiseLLMTokenLimit}
          required={true}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
