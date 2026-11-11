import { memo, useState } from "react";
import Slide from "./Slide";

// Thumbnails shown once the deck is done; the rest sit behind a "+N" tile.
const COLLAPSED_COUNT = 6;

/**
 * Live thumbnails of a presentation the agent is building, filled in slide
 * by slide from "pptxSlidePreview" socket events. They exist only for this
 * session; the downloadable file is the lasting result. Clicking a
 * thumbnail shows it large.
 * @param {{content: {slides: ({background: string, items: object[]}|undefined)[], done: boolean}}} props
 */
function SlidePreviewCard({ props }) {
  const { slides = [], done = false } = props.content || {};
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const ready = slides
    .map((slide, index) => ({ slide, index }))
    .filter(({ slide }) => !!slide);
  const collapsed = done && !expanded && ready.length > COLLAPSED_COUNT + 1;
  const shown = collapsed ? ready.slice(0, COLLAPSED_COUNT) : ready;
  const big = selected !== null ? slides[selected] : null;

  return (
    <div className="flex justify-center w-full my-2">
      <div className="w-full max-w-[750px] mr-4 flex flex-col gap-y-2">
        {big && (
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="block w-full rounded-lg overflow-hidden ring-1 ring-white/10 light:ring-slate-300"
          >
            <Slide slide={big} />
          </button>
        )}
        <div className="grid grid-cols-3 gap-2">
          {shown.map(({ slide, index }) => (
            <button
              type="button"
              key={index}
              onClick={() => setSelected(selected === index ? null : index)}
              className={`block rounded-md overflow-hidden transition-opacity hover:opacity-90 ${
                selected === index
                  ? "ring-2 ring-sky-400"
                  : "ring-1 ring-white/10 light:ring-slate-300"
              }`}
            >
              <Slide slide={slide} />
            </button>
          ))}
          {collapsed && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="aspect-video rounded-md flex items-center justify-center bg-zinc-800 light:bg-slate-100 ring-1 ring-white/10 light:ring-slate-300 text-white light:text-slate-700 text-lg font-semibold hover:opacity-90"
            >
              +{ready.length - COLLAPSED_COUNT}
            </button>
          )}
          {!done && (
            <div className="aspect-video rounded-md bg-zinc-800 light:bg-slate-200 animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(SlidePreviewCard);
