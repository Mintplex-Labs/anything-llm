import { memo, useEffect, useState } from "react";
import { saveAs } from "file-saver";
import {
  DownloadSimple,
  Copy,
  Check,
  CircleNotch,
  ImageBroken,
} from "@phosphor-icons/react";
import StorageFiles from "@/models/files";
import showToast from "@/utils/toast";
import { openImageLightbox } from "@/components/ImageLightbox";

/**
 * Renders a generated image returned by the `/img` command. The serve endpoint
 * is auth-protected, so we fetch the image as a blob and render an object URL.
 * @param {{content: {storageFilename: string, filename?: string, prompt?: string}}} props
 */
function ImageGenerationCard({ props }) {
  const { storageFilename, filename, prompt } = props.content || {};
  const [blob, setBlob] = useState(null);
  const [objectUrl, setObjectUrl] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | failed
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let revokeUrl = null;
    async function loadImage() {
      const result = await StorageFiles.image(storageFilename);
      if (!result) return setStatus("failed");
      revokeUrl = URL.createObjectURL(result);
      setBlob(result);
      setObjectUrl(revokeUrl);
      setStatus("ready");
    }
    if (storageFilename) loadImage();
    return () => {
      if (revokeUrl) URL.revokeObjectURL(revokeUrl);
    };
  }, [storageFilename]);

  const handleDownload = () => {
    if (!blob) return;
    saveAs(blob, filename || storageFilename);
  };

  const handleCopy = async () => {
    if (!blob) return;
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("Could not copy image to clipboard.", "error");
    }
  };

  return (
    <div className="my-2">
      <div className="w-full max-w-[280px]">
        <div className="relative group rounded-xl overflow-hidden bg-zinc-800 light:bg-slate-100 light:border light:border-slate-200/50 aspect-square">
          {status === "loading" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <CircleNotch
                size={28}
                weight="bold"
                className="animate-spin text-zinc-400 light:text-slate-500"
              />
            </div>
          )}

          {status === "failed" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-2 text-zinc-400 light:text-slate-500">
              <ImageBroken size={28} weight="bold" />
              <span className="text-xs">Image failed to load</span>
            </div>
          )}

          {status === "ready" && (
            <>
              <img
                src={objectUrl}
                alt={prompt || "Generated image"}
                onClick={() =>
                  openImageLightbox([
                    { contentString: objectUrl, name: filename || prompt },
                  ])
                }
                className="w-full h-full object-cover cursor-pointer"
              />
              <div className="absolute top-2 right-2 flex items-center gap-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={handleCopy}
                  data-tooltip-content="Copy image"
                  className="border-none p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white"
                >
                  {copied ? (
                    <Check size={16} weight="bold" />
                  ) : (
                    <Copy size={16} weight="bold" />
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  data-tooltip-content="Download image"
                  className="border-none p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white"
                >
                  <DownloadSimple size={16} weight="bold" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(ImageGenerationCard);
