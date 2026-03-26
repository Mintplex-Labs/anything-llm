import { memo, useCallback, useState } from "react";
import { saveAs } from "file-saver";
import { CircleNotch, DownloadSimple } from "@phosphor-icons/react";
import { safeJsonParse } from "@/utils/request";
import renderMarkdown from "@/utils/chat/markdown";
import DOMPurify from "@/utils/chat/purify";

function MCPImageContent({ props }) {
  const content =
    typeof props.content === "string"
      ? safeJsonParse(props.content, null)
      : props.content;
  if (!content?.images?.length) return null;

  const caption = content.caption || content.description || "";

  return (
    <div className="flex justify-start w-full">
      <div className="py-2 px-4 w-full flex flex-col md:max-w-[80%]">
        <div className="flex flex-col gap-4">
          {content.images.map((image, index) => (
            <MCPImage key={index} image={image} index={index} />
          ))}
        </div>
        {caption && (
          <span
            className="flex flex-col gap-y-1 mt-2"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(renderMarkdown(caption)),
            }}
          />
        )}
      </div>
    </div>
  );
}

function MCPImage({ image, index }) {
  const [loading, setLoading] = useState(false);
  const src = `data:${image.mimeType};base64,${image.data}`;

  const handleDownload = useCallback(async () => {
    setLoading(true);
    try {
      const ext = image.mimeType.split("/")[1] || "png";
      const byteString = atob(image.data);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: image.mimeType });
      saveAs(blob, `mcp-image-${index}.${ext}`);
    } catch (e) {
      console.error("Failed to download image:", e);
    }
    setLoading(false);
  }, [image, index]);

  return (
    <div className="relative w-full">
      <div className="absolute top-3 right-3 z-50 cursor-pointer">
        <div className="p-1 rounded-full border-none">
          {loading ? (
            <CircleNotch
              className="text-theme-text-primary w-5 h-5 animate-spin"
              aria-label="Downloading image..."
            />
          ) : (
            <DownloadSimple
              weight="bold"
              className="text-theme-text-primary w-5 h-5 hover:text-theme-text-primary"
              onClick={handleDownload}
              aria-label="Download image"
            />
          )}
        </div>
      </div>
      <img
        src={src}
        alt={`MCP tool result image ${index + 1}`}
        className="max-w-full max-h-[500px] rounded-lg object-contain"
      />
    </div>
  );
}

export default memo(MCPImageContent);
