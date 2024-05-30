import { Gauge } from "@phosphor-icons/react";
import { useState } from "react";

export default function NativeTranscriptionOptions({ settings }) {
  const [model, setModel] = useState(settings?.WhisperModelPref);

  return (
    <div className="w-full flex flex-col gap-y-4">
      <LocalWarning model={model} />
      <div className="w-full flex items-center gap-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Model Selection
          </label>
          <select
            name="WhisperModelPref"
            defaultValue={model}
            onChange={(e) => setModel(e.target.value)}
            className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
          >
            {["Xenova/whisper-small", "Xenova/whisper-large"].map(
              (value, i) => {
                return (
                  <option key={i} value={value}>
                    {value}
                  </option>
                );
              }
            )}
          </select>
        </div>
      </div>
    </div>
  );
}

function LocalWarning({ model }) {
  switch (model) {
    case "Xenova/whisper-small":
      return <WhisperSmall />;
    case "Xenova/whisper-large":
      return <WhisperLarge />;
    default:
      return <WhisperSmall />;
  }
}

function WhisperSmall() {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-x-2 text-white mb-4 bg-blue-800/30 w-fit rounded-lg px-4 py-2">
      <div className="gap-x-2 flex items-center">
        <Gauge size={25} />
        <p className="text-sm">
          Running the <b>whisper-small</b> model on a machine with limited RAM
          or CPU can stall AnythingLLM when processing media files.
          <br />
          We recommend at least 2GB of RAM and upload files &lt;10Mb.
          <br />
          <br />
          <i>
            This model will automatically download on the first use. (250mb)
          </i>
        </p>
      </div>
    </div>
  );
}

function WhisperLarge() {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-x-2 text-white mb-4 bg-blue-800/30 w-fit rounded-lg px-4 py-2">
      <div className="gap-x-2 flex items-center">
        <Gauge size={25} />
        <p className="text-sm">
          Using the <b>whisper-large</b> model on machines with limited RAM or
          CPU can stall AnythingLLM when processing media files. This model is
          substantially larger than the whisper-small.
          <br />
          We recommend at least 8GB of RAM and upload files &lt;10Mb.
          <br />
          <br />
          <i>
            This model will automatically download on the first use. (1.56GB)
          </i>
        </p>
      </div>
    </div>
  );
}
