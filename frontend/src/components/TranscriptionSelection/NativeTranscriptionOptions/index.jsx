import { Gauge } from "@phosphor-icons/react";
export default function NativeTranscriptionOptions() {
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-x-2 text-white mb-4 bg-blue-800/30 w-fit rounded-lg px-4 py-2">
        <div className="gap-x-2 flex items-center">
          <Gauge size={25} />
          <p className="text-sm">
            Using the local whisper model on machines with limited RAM or CPU
            can stall AnythingLLM when processing media files.
            <br />
            We recommend at least 2GB of RAM and upload files &lt;10Mb.
            <br />
            <br />
            <i>
              The built-in model will automatically download on the first use.
            </i>
          </p>
        </div>
      </div>
      <div className="w-full flex items-center gap-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Model Selection
          </label>
          <select
            disabled={true}
            className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
          >
            <option disabled={true} selected={true}>
              Xenova/whisper-small
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}
