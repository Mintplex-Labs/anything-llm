import { useState } from "react";

export default function LocalWhisperOptions({ settings }) {
  return (
    <>
      <p className="text-sm font-base text-white text-opacity-60 mb-4">
        All local Whisper models will run locally. This can be resource
        intensive on lower-end devices.
      </p>
      <div className="flex gap-x-4 items-center">
        <WhisperSTTModelSelection settings={settings} />
      </div>
    </>
  );
}

const MODELS = {
  // Do not allow others as it will likely be killed due to memory issues and WASM limits.
  "Xenova/whisper-tiny": {
    size: "60MB",
    multilingual: true,
  },
  // 'Xenova/whisper-small': {
  //   size: '150Mb',
  //   multilingual: true,
  // },
  // 'Xenova/whisper-base': {
  //   size: '200Mb',
  //   multilingual: true,
  // },
  // 'Xenova/whisper-large': {
  //   size: '4GB',
  //   multilingual: true,
  // }
};
function WhisperSTTModelSelection({ settings }) {
  const [selectedModel, setSelectedModel] = useState(
    settings?.SpeechToTextLocalWhisperModel ?? "Xenova/whisper-tiny"
  );

  return (
    <div className="flex flex-col w-fit">
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Model Selection
        </label>
        <div className="flex items-center w-fit gap-x-4 mb-2">
          <select
            name="SpeechToTextLocalWhisperModel"
            required={true}
            onChange={(e) => setSelectedModel(e.target.value)}
            value={selectedModel}
            className="border-none flex-shrink-0 bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
          >
            {Object.entries(MODELS).map(([key, props]) => {
              return (
                <option key={key} value={key}>
                  {key} ({props.size}) Multilingual
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </div>
  );
}
