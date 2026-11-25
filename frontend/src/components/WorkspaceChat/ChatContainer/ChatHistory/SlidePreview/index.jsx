import { memo, useCallback, useEffect, useRef, useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { openImageLightbox } from "@/components/ImageLightbox";

const THUMB_W = 128;
const THUMB_H = 72;

/**
 * A compact row of a presentation's slides while the agent builds it,
 * filled in from "pptxSlidePreview" socket events. Each slide arrives as an
 * image the server baked, so no page style touches it. New slides fade in
 * and the row follows them until the user scrolls or clicks it; arrows
 * appear on whichever side has more to scroll, and a slide opens in the
 * lightbox. It exists for this session only; the downloadable file is the
 * lasting result.
 * @param {{content: {slides: (string|undefined)[], done: boolean}}} props - slides are image data URLs, by position in the deck
 */
function SlidePreviewCard({ props }) {
  const { slides = [], done = false } = props.content || {};
  const rowRef = useRef(null);
  // The row follows new slides until the user scrolls, clicks or uses the
  // arrows, so a new batch never pulls them away from where they are.
  const followRef = useRef(true);
  const stopFollowing = () => {
    followRef.current = false;
  };
  const [edges, setEdges] = useState({ left: false, right: false });
  const ready = slides
    .map((image, index) => ({ image, index }))
    .filter(({ image }) => !!image);

  const updateEdges = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    setEdges({
      left: row.scrollLeft > 1,
      right: row.scrollLeft + row.clientWidth < row.scrollWidth - 1,
    });
  }, []);

  // Follows each new slide while the deck is being built.
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    if (!done && followRef.current)
      row.scrollTo({ left: row.scrollWidth, behavior: "smooth" });
    updateEdges();
  }, [ready.length, done, updateEdges]);

  useEffect(() => {
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges]);

  const scrollBy = (direction) => {
    stopFollowing();
    const row = rowRef.current;
    if (!row) return;
    row.scrollBy({
      left: direction * row.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  const openSlide = (position) =>
    openImageLightbox(
      ready.map(({ image, index }) => ({
        contentString: image,
        name: `Slide ${index + 1}`,
      })),
      position
    );

  // A deck whose previews never arrived shows nothing.
  if (done && ready.length === 0) return null;

  return (
    <div className="flex justify-center w-full my-2">
      <div className="relative w-full max-w-[750px] mr-4">
        <div
          ref={rowRef}
          onScroll={updateEdges}
          onWheel={stopFollowing}
          onPointerDown={stopFollowing}
          className="flex gap-x-2 overflow-x-auto rounded-xl p-2 bg-zinc-800 light:bg-slate-100 light:border light:border-slate-200/50 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {ready.map(({ image, index }, position) => (
            <button
              type="button"
              key={index}
              onClick={() => openSlide(position)}
              className="flex-shrink-0 rounded-md overflow-hidden border-none p-0 cursor-pointer ring-1 ring-white/10 light:ring-slate-300 hover:ring-white/40 light:hover:ring-slate-400 transition-shadow animate-fade-in"
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                width={THUMB_W}
                height={THUMB_H}
                draggable={false}
                className="block"
                style={{ width: THUMB_W, height: THUMB_H }}
              />
            </button>
          ))}
          {!done && (
            <div
              style={{ width: THUMB_W, height: THUMB_H }}
              className="flex-shrink-0 rounded-md bg-zinc-700 light:bg-slate-200 animate-pulse"
            />
          )}
        </div>
        {edges.left && (
          <ScrollButton direction={-1} onClick={() => scrollBy(-1)} />
        )}
        {edges.right && (
          <ScrollButton direction={1} onClick={() => scrollBy(1)} />
        )}
      </div>
    </div>
  );
}

function ScrollButton({ direction, onClick }) {
  const Icon = direction < 0 ? CaretLeft : CaretRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction < 0 ? "Scroll left" : "Scroll right"}
      className={`absolute top-1/2 -translate-y-1/2 ${
        direction < 0 ? "left-3" : "right-3"
      } flex items-center justify-center w-8 h-8 rounded-full border-none cursor-pointer shadow-md bg-zinc-900/80 hover:bg-zinc-900 text-white light:bg-white/90 light:hover:bg-white light:text-slate-800 light:ring-1 light:ring-slate-300 transition-colors`}
    >
      <Icon size={16} weight="bold" />
    </button>
  );
}

export default memo(SlidePreviewCard);
