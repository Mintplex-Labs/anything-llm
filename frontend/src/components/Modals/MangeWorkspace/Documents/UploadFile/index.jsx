import { CloudArrowUp } from "@phosphor-icons/react";

export default function UploadFile() {
  return (
    <div>
      <div className="w-[560px] border-2 border-dashed rounded-2xl bg-zinc-900/50 p-3">
        <input
          name="import"
          type="file"
          multiple={false}
          accept=".mbox,.pdf,.odt,.docx,.txt,.md" // TODO: Get dynamically from system
          hidden={true}
        />
        <div className="flex flex-col items-center justify-center">
          <CloudArrowUp className="w-8 h-8 text-white/80" />
          <div className="text-white text-opacity-80 text-sm font-semibold py-1">
            Click to upload or drag and drop
          </div>
          <div className="text-white text-opacity-60 text-xs font-medium py-1">
            Supported file extensions are .mbox .pdf .odt .docx .txt .md
          </div>
        </div>
      </div>
      <div className="mt-6 text-center text-white text-opacity-80 text-xs font-medium w-[560px]">
        These files will be uploaded to the document processor running on this
        AnythingLLM instance. These files are not sent or shared with a third
        party.
      </div>
    </div>
  );
}
