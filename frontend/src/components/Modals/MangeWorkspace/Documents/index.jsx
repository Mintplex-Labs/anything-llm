import { ArrowsDownUp, CloudArrowUp, Plus } from "@phosphor-icons/react";
import DocumentRow from "./DocumentRow";

export default function DocumentSettings({ workspace }) {
  const documents = [
    {
      name: "Document 2.pdf",
      date: "Sep 19",
      size: "12 MB",
      kind: "PDF",
      cached: true,
    },
    {
      name: "very long file name 12jfidjsfdsijfiodsjoi.pdf",
      date: "Sep 12",
      size: "39 MB",
      kind: "PDF",
      cached: true,
    },
    {
      name: "Sample Folder",
      date: "Sep 12",
      size: "39 MB",
      kind: "Folder",
      cached: false,
    },
    {
      name: "document jdisfjf.pdf",
      date: "Sep 12",
      size: "39 MB",
      kind: "PDF",
      cached: "No",
    },
  ];

  const workspaceDocuments = [
    {
      name: "test book.pdf",
      date: "Sep 19",
      size: "12 MB",
      kind: "PDF",
      cached: true,
    },
    {
      name: "Testing Workspace folder",
      date: "Sep 12",
      size: "39 MB",
      kind: "Folder",
      cached: false,
    },
    {
      name: "document jdisfjf.pdf",
      date: "Sep 12",
      size: "39 MB",
      kind: "PDF",
      cached: false,
    },
    {
      name: "webster dictionary edition 394.pdf",
      date: "Sep 19",
      size: "12 MB",
      kind: "PDF",
      cached: true,
    },
  ];

  return (
    <div className="flex gap-x-6 justify-center">
      {/* My Document */}
      <div className="px-8 pb-8">
        <div className="flex flex-col gap-y-6">
          <div className="flex items-center justify-between w-[560px] px-5">
            <h3 className="text-white text-base font-bold">My Documents</h3>
            <div className="flex items-center text-white/80 gap-x-1">
              <Plus className="text-base font-bold w-4 h-4" />
              <p>New Folder</p>
            </div>
          </div>

          <div className="w-[560px] h-[310px] bg-zinc-900 rounded-2xl">
            <div className="text-white/80 text-xs grid grid-cols-12 py-2 px-8 border-b border-white/20">
              <p className="col-span-4">Name</p>
              <p className="col-span-2">Date</p>
              <p className="col-span-2">Size</p>
              <p className="col-span-2">Kind</p>
              <p className="col-span-2">Cached</p>
            </div>
            {documents.length > 0 ? (
              documents.map((document) => <DocumentRow document={document} />)
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white text-opacity-40 text-sm font-medium">
                  No Documents
                </p>
              </div>
            )}
          </div>

          {/* Upload file */}
          <div className="w-[560px] border-2 border-dashed rounded-2xl bg-zinc-900/50 p-3">
            <input
              name="import"
              type="file"
              multiple="false"
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
          <div>
            <div className="text-center text-white text-opacity-80 text-xs font-medium w-[560px]">
              These files will be uploaded to the document processor running on
              this AnythingLLM instance. These files are not sent or shared with
              a third party.
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <ArrowsDownUp className="text-white text-base font-bold rotate-90 w-11 h-11" />
      </div>

      {/* Current Workspace */}
      <div className="px-8">
        <div className="flex items-center justify-start w-[560px]">
          <h3 className="text-white text-base font-bold ml-5">
            {workspace.name}
          </h3>
        </div>
        <div className="w-[560px] h-[445px] bg-zinc-900 rounded-2xl mt-5">
          <div className="text-white/80 text-xs grid grid-cols-12 py-1.5 px-8 border-b border-white/20">
            <p className="col-span-4">Name</p>
            <p className="col-span-2">Date</p>
            <p className="col-span-2">Size</p>
            <p className="col-span-2">Kind</p>
            <p className="col-span-2">Cached</p>
          </div>
          {workspaceDocuments.length > 0 ? (
              workspaceDocuments.map((document) => <DocumentRow document={document} />)
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white text-opacity-40 text-sm font-medium">
                  No Documents
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
