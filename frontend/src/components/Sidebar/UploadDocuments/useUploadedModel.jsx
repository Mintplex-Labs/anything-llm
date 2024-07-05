import { useState } from "react";

export function useUploadedModel() {
  const [show, setShow] = useState(false);

  const showUploadModal = () => {
    setShow(true);
  };

  const hideUploadModal = () => {
    setShow(false);
  };

  return { show, showUploadModal, hideUploadModal };
}
