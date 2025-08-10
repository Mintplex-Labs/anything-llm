import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { humanFileSize } from "../../../../../../utils/numbers";

export default function PreflightModal({ files = [], onConfirm, onCancel }) {
  const { t } = useTranslation();
  const [policy, setPolicy] = useState("overwrite");

  const totalSize = files.reduce((sum, f) => sum + (f.size || 0), 0);

  const tree = useMemo(() => {
    const paths = files.slice(0, 50).map((f) => f.path || f.name);
    const root = {};
    paths.forEach((p) => {
      const parts = p.split(/[\\/]/).filter(Boolean);
      let node = root;
      parts.forEach((part) => {
        node[part] = node[part] || {};
        node = node[part];
      });
    });
    return root;
  }, [files]);

  const renderTree = (node) => (
    <ul className="ml-4 list-disc">
      {Object.entries(node).map(([key, value]) => (
        <li key={key} className="text-xs text-white light:text-theme-text-primary">
          {key}
          {Object.keys(value || {}).length > 0 && renderTree(value)}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40">
      <div className="bg-theme-bg-primary light:bg-white rounded-lg p-6 w-[360px] shadow-xl">
        <h2 className="text-white light:text-theme-text-primary text-lg font-bold mb-4">
          {t("connectors.upload.preflight.title", "Ready to upload?")}
        </h2>
        <p className="text-white/80 light:text-theme-text-secondary text-sm mb-4">
          {t(
            "connectors.upload.preflight.summary",
            {
              count: files.length,
              size: humanFileSize(totalSize),
            },
            `${files.length} files, total size ${humanFileSize(totalSize)}`
          )}
        </p>
        <div className="max-h-40 overflow-auto mb-4">
          {renderTree(tree)}
        </div>
        <div className="mb-6">
          <p className="text-white light:text-theme-text-primary text-sm font-semibold mb-2">
            {t("connectors.upload.preflight.conflict", "If a file exists:")}
          </p>
          <label className="flex items-center gap-x-2 text-white light:text-theme-text-primary text-sm">
            <input
              type="radio"
              name="conflictPolicy"
              value="overwrite"
              checked={policy === "overwrite"}
              onChange={() => setPolicy("overwrite")}
            />
            {t("connectors.upload.preflight.overwrite", "Overwrite it")}
          </label>
          <label className="flex items-center gap-x-2 text-white light:text-theme-text-primary text-sm mt-2">
            <input
              type="radio"
              name="conflictPolicy"
              value="skip"
              checked={policy === "skip"}
              onChange={() => setPolicy("skip")}
            />
            {t("connectors.upload.preflight.skip", "Skip it")}
          </label>
        </div>
        <div className="flex justify-end gap-x-2">
          <button
            type="button"
            className="bg-transparent border border-white light:border-theme-modal-border text-white light:text-theme-text-primary rounded-md px-4 py-1 text-sm"
            onClick={onCancel}
          >
            {t("common.cancel", "Cancel")}
          </button>
          <button
            type="button"
            className="bg-primary-button text-white rounded-md px-4 py-1 text-sm disabled:opacity-50"
            onClick={() => onConfirm(policy)}
          >
            {t("common.confirm", "Upload")}
          </button>
        </div>
      </div>
    </div>
  );
}

