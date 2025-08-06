import { useEffect, useState } from "react";
import { X, CircleNotch, Warning } from "@phosphor-icons/react";
import Workspace from "@/models/workspace";
import { useParams } from "react-router-dom";
import { nFormatter } from "@/utils/numbers";

export default function ParsedFilesMenu({ workspace, onEmbeddingChange }) {
  const { threadSlug = null } = useParams();
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmbedding, setIsEmbedding] = useState(false);
  const [embedProgress, setEmbedProgress] = useState(1);

  const contextWindow = workspace?.contextWindow || Infinity;
  const currentTokens = workspace?.currentContextTokenCount || 0;
  const isOverflowing = currentTokens >= contextWindow * 0.8;

  useEffect(() => {
    async function fetchFiles() {
      if (!workspace?.slug) return;
      const parsedFiles = await Workspace.getParsedFiles(
        workspace.slug,
        threadSlug
      );
      setFiles(parsedFiles);
      setIsLoading(false);
    }
    fetchFiles();
  }, [workspace, threadSlug]);

  async function handleRemove(file) {
    if (!file?.id) return;
    await Workspace.deleteParsedFile(workspace.slug, file.id);
    setFiles((prev) => prev.filter((f) => f.id !== file.id));
  }

  async function handleEmbed() {
    if (!files.length) return;
    setIsEmbedding(true);
    onEmbeddingChange?.(true);
    setEmbedProgress(1);
    try {
      let completed = 0;
      await Promise.all(
        files.map((file) =>
          Workspace.embedParsedFile(workspace.slug, file.id).then(() => {
            completed++;
            setEmbedProgress(completed + 1);
          })
        )
      );
      setFiles([]);
    } catch (error) {
      console.error("Failed to embed files:", error);
    }
    setIsEmbedding(false);
    onEmbeddingChange?.(false);
    setEmbedProgress(1);
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-theme-text-primary">
          Current Context
        </div>
        <div className="text-xs text-theme-text-secondary">
          {nFormatter(currentTokens)} / {nFormatter(contextWindow)} tokens
        </div>
      </div>
      {isOverflowing && (
        <div className="flex flex-col gap-2 p-2 bg-theme-bg-secondary light:bg-theme-bg-primary rounded">
          <div className="flex items-start gap-2">
            <Warning
              className="flex-shrink-0 mt-1 text-yellow-500 light:text-yellow-600"
              size={16}
            />
            <div className="text-xs text-theme-text-primary">
              Your context window is getting full. Some files may be truncated
              or excluded from chat responses. We recommend embedding these
              files directly into your workspace for better results.
            </div>
          </div>
          <button
            onClick={handleEmbed}
            disabled={isEmbedding}
            className="flex items-center justify-center gap-2 px-3 py-2 text-xs bg-primary-button hover:bg-theme-button-primary-hover text-white font-medium rounded transition-colors shadow-sm"
          >
            {isEmbedding ? (
              <>
                <CircleNotch size={14} className="animate-spin" />
                Embedding {embedProgress} of {files.length} files...
              </>
            ) : (
              "Embed Files into Workspace"
            )}
          </button>
        </div>
      )}
      <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto">
        {files.map((file, i) => (
          <div
            key={i}
            className={
              "flex items-center justify-between gap-2 p-2 text-xs bg-theme-bg-secondary rounded"
            }
          >
            <div className="truncate flex-1 text-theme-text-primary">
              {file.title}
            </div>
            <button
              onClick={() => handleRemove(file)}
              className="text-theme-text-secondary hover:text-theme-text-primary"
              disabled={isEmbedding}
            >
              <X size={16} />
            </button>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-xs text-theme-text-secondary text-center py-2">
            <CircleNotch size={16} className="animate-spin" />
            Loading...
          </div>
        )}
        {!isLoading && files.length === 0 && (
          <div className="text-xs text-theme-text-secondary text-center py-2">
            No files found
          </div>
        )}
      </div>
    </div>
  );
}
