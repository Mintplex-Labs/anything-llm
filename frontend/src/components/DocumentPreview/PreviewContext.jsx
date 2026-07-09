import { createContext, useCallback, useContext, useState } from "react";
import DocumentPreviewModal from "./index";

/**
 * DocumentPreview context
 * ----------------------------------------------------------------------------
 * Modal xem trước tài liệu toàn cục (giống pattern ImageLightbox có sẵn).
 * Bọc app 1 lần bằng <PreviewProvider> (đặt trong I18nextProvider ở App.jsx),
 * rồi ở bất kỳ đâu:  const { open } = usePreview(); open(file)
 *
 * file: { storageFilename, filename, fileSize? }
 */
const PreviewContext = createContext(null);

export function usePreview() {
  const ctx = useContext(PreviewContext);
  if (!ctx)
    throw new Error("usePreview() phải dùng bên trong <PreviewProvider>");
  return ctx;
}

export function PreviewProvider({ children }) {
  const [current, setCurrent] = useState(null);
  const open = useCallback((file) => setCurrent(file), []);
  const close = useCallback(() => setCurrent(null), []);

  return (
    <PreviewContext.Provider value={{ current, open, close }}>
      {children}
      <DocumentPreviewModal />
    </PreviewContext.Provider>
  );
}

export default PreviewContext;
