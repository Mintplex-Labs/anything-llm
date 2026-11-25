import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, CaretLeft, CaretRight } from "@phosphor-icons/react";

const OPEN_EVENT = "open-image-lightbox";

/**
 * Opens the image lightbox from anywhere in the app.
 * @param {{contentString: string, name: string}[]} images
 * @param {number} initialIndex
 */
export function openImageLightbox(images, initialIndex = 0) {
  window.dispatchEvent(
    new CustomEvent(OPEN_EVENT, { detail: { images, initialIndex } })
  );
}

export default function ImageLightbox() {
  const [images, setImages] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    function handleOpen(e) {
      setImages(e.detail.images);
      setCurrentIndex(e.detail.initialIndex);
    }
    window.addEventListener(OPEN_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_EVENT, handleOpen);
  }, []);

  function close() {
    setImages(null);
  }

  function handlePrevious() {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }

  function handleNext() {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }

  useEffect(() => {
    if (!images) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") handlePrevious();
      else if (e.key === "ArrowRight") handleNext();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images]);

  if (!images || images.length === 0) return null;
  const safeIndex = Math.min(currentIndex, images.length - 1);
  const currentImage = images[safeIndex];
  if (!currentImage) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90"
      onClick={close}
    >
      <button
        type="button"
        onClick={close}
        className="absolute top-4 right-4 p-2 text-white light:text-white hover:text-white/70 transition-colors rounded-full bg-white/10 hover:bg-white/20 border-none cursor-pointer"
        aria-label="Close lightbox"
      >
        <X size={24} weight="bold" />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-4 p-3 text-white light:text-white hover:text-white/70 transition-colors rounded-full bg-white/10 hover:bg-white/20 border-none cursor-pointer"
            aria-label="Previous image"
          >
            <CaretLeft size={24} weight="bold" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 p-3 text-white light:text-white hover:text-white/70 transition-colors rounded-full bg-white/10 hover:bg-white/20 border-none cursor-pointer"
            aria-label="Next image"
          >
            <CaretRight size={24} weight="bold" />
          </button>
        </>
      )}

      <img
        src={currentImage.contentString}
        alt={currentImage.name || "attachment"}
        className="max-w-[90vw] max-h-[90vh] object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm bg-black/50 px-3 py-1 rounded-full">
          {safeIndex + 1} / {images.length}
        </div>
      )}
    </div>,
    document.getElementById("root")
  );
}
