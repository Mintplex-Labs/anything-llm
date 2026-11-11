import { memo, useEffect, useRef } from "react";
import Slide from "./Slide";

const THUMB_W = 128;
const THUMB_H = 72;

/**
 * A compact row of thumbnails of a presentation the agent is building,
 * filled in slide by slide from "pptxSlidePreview" socket events and
 * scrolled to the newest one. It only shows the work in progress: it exists
 * for this session alone and the downloadable file is the lasting result.
 * @param {{content: {slides: ({background: string, items: object[]}|undefined)[], done: boolean}}} props
 */
function SlidePreviewCard({ props }) {
  const { slides = [], done = false } = props.content || {};
  const rowRef = useRef(null);
  const count = slides.filter(Boolean).length;

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    row.scrollTo({ left: row.scrollWidth, behavior: "smooth" });
  }, [count, done]);

  return (
    <div className="flex justify-center w-full my-2">
      <div className="w-full max-w-[750px] mr-4">
        <div
          ref={rowRef}
          className="flex gap-x-2 overflow-x-auto rounded-xl p-2 bg-zinc-800 light:bg-slate-100 light:border light:border-slate-200/50 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map(
            (slide, index) =>
              slide && (
                <div
                  key={index}
                  className="flex-shrink-0 rounded-md overflow-hidden ring-1 ring-white/10 light:ring-slate-300"
                >
                  <Slide slide={slide} width={THUMB_W} />
                </div>
              )
          )}
          {!done && (
            <div
              style={{ width: THUMB_W, height: THUMB_H }}
              className="flex-shrink-0 rounded-md bg-zinc-700 light:bg-slate-200 animate-pulse"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(SlidePreviewCard);
