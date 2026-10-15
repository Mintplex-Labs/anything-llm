import { useCallback, useEffect, useRef, useState } from "react";
import {
  QUESTION_PANEL_MAX_LIST_HEIGHT,
  QUESTION_PANEL_PADDING,
  QUESTION_PANEL_VISIBLE_ROWS,
  QUESTION_ROW_HEIGHT,
} from "@/utils/chat/questionIndex";

/**
 * Palette measured from the reference chat UI at a 150% display scale
 * (device pixels / 1.5). The rail floats above the transcript, so it cannot
 * inherit the message colours without losing contrast; both themes are
 * therefore spelled out here.
 *
 * A row has three states, each measured: idle, the question being read (blue,
 * with the longer dash) and the row under the pointer (the strongest neutral
 * text of the theme, and a dash in that same colour).
 */
const DASH_IDLE = "bg-white/20 light:bg-[#D6D6D6]";
const DASH_CURRENT = "bg-[#669BFE] light:bg-[#3964FE]";
// The dash of the row under the pointer. It is driven by state rather than a
// CSS hover so that pointing at a panel row lights its dash up too - the two
// are one indicator. Light mode uses a slightly softer neutral here than the
// label uses.
const DASH_HOVERED = "bg-[#F9F7FB] light:bg-[#181A1E]";
const LABEL_IDLE = "text-[#ADB0B8] light:text-[#81858C]";
const LABEL_CURRENT = "text-[#669BFE] light:text-[#3964FE]";
const LABEL_HOVERED = "font-semibold text-[#F9F7FB] light:text-[#0F1115]";

/**
 * The dash keeps a fixed slot and grows around its own centre, so a question's
 * label never shifts sideways when it becomes the current one. The panel rows
 * reserve the same slot without drawing in it - the rail's dashes sit there.
 */
const DASH_SLOT = "w-3 shrink-0";
const ROW = "flex items-center gap-4 text-right transition-colors";

/**
 * The rail shows as many questions as the reference panel does before it
 * scrolls: a thread longer than that keeps the current dash in view instead of
 * growing past the chat area.
 */
const RAIL_MAX_HEIGHT = QUESTION_ROW_HEIGHT * QUESTION_PANEL_VISIBLE_ROWS;

/**
 * Below this width the rail steps aside: the transcript keeps a 750px column,
 * the panel needs 240px next to it and the rail needs its own 40px gutter, so
 * under ~1100px the panel would start eating into the conversation itself.
 * Kept as a class string so the breakpoint can be tuned in one place.
 */
const RAIL_VISIBILITY = "hidden min-[1100px]:flex";

/**
 * How long the full-question card waits before it appears. It is a hover-intent
 * delay: sweeping the pointer down the list should not flash a card on every row
 * it crosses. The question being read never gets a card at all - it is already on
 * screen.
 */
const CARD_DELAY = 1000;

/**
 * Right-side index of the questions in the open chat.
 *
 * One entry per user question, in order: click to scroll to that question, and
 * hover the rail for the full list. It reads the thread already on the page -
 * no model call, no generated headings, no persisted state.
 *
 * @param {Object} props
 * @param {Array<{order: number, messageIndex: number, label: string}>} props.items
 * @param {number} props.currentIndex - the question the reader is on
 * @param {(index: number) => void} props.onJump - scroll to a question
 * @param {boolean} [props.enabled] - renders nothing when the feature is off
 */
export default function QuestionIndex({
  items = [],
  currentIndex = 0,
  onJump,
  enabled = true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  // A row only offers the full question when its own line is truncated, and only
  // while the pointer is inside the panel - not while running along the rail.
  const [hoveredInPanel, setHoveredInPanel] = useState(false);
  const [overflowingLabel, setOverflowingLabel] = useState(null);
  const closeTimerRef = useRef(null);
  const cardTimerRef = useRef(null);
  // Whether a card is on screen: the scroll handlers use it to move the card
  // without letting a scroll bring one forward ahead of its delay.
  const cardShownRef = useRef(false);
  const listRef = useRef(null);
  const railRef = useRef(null);

  const openPanel = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsOpen(true);
  }, []);

  // Delay closing so the pointer can travel from a rail dash into the panel
  // without the panel vanishing from under it.
  const scheduleClose = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null;
      setIsOpen(false);
      setHoveredIndex(null);
      setHoveredInPanel(false);
      setOverflowingLabel(null);
    }, 140);
  }, []);

  useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      if (cardTimerRef.current) clearTimeout(cardTimerRef.current);
    },
    []
  );

  const highlightedIndex = hoveredIndex ?? currentIndex;

  /**
   * Where the card beside a truncated row belongs, or null when that row already
   * says everything it needs to say. Measured from the rendered row rather than
   * derived from its index: the list can be scrolled, and then an index-derived
   * position would not agree with it.
   */
  const computeCard = useCallback(() => {
    const list = listRef.current;
    const panelElement = list?.parentElement;
    const row =
      hoveredInPanel && hoveredIndex !== null
        ? list?.children[hoveredIndex]
        : null;
    if (!panelElement || !row) return null;
    const label = row.querySelector("span");
    if (!label || label.scrollWidth <= label.clientWidth) return null;
    const rowBox = row.getBoundingClientRect();
    const panelBox = panelElement.getBoundingClientRect();
    return {
      label: items[hoveredIndex].label,
      centre: rowBox.top - panelBox.top + rowBox.height / 2,
    };
  }, [hoveredInPanel, hoveredIndex, items]);

  const setCard = useCallback((next) => {
    cardShownRef.current = next !== null;
    // Keep the previous object when nothing moved: this is called on every
    // scroll event, and a fresh object would re-render for each of them.
    setOverflowingLabel((previous) =>
      previous &&
      next &&
      previous.label === next.label &&
      Math.abs(previous.centre - next.centre) < 0.5
        ? previous
        : next
    );
  }, []);

  // Follow a card that is already up. Called from the scroll handlers, which
  // must not bring one forward early - that is the effect below's job.
  const repositionCard = useCallback(() => {
    if (cardShownRef.current) setCard(computeCard());
  }, [computeCard, setCard]);

  /**
   * When the card appears. The question being read gets none - it is already on
   * screen, so a card would only repeat it. Every other row waits a second, so
   * sweeping the pointer down the list does not flash a card on the way. A card
   * already up comes down at once when the pointer moves on, since it belongs to
   * the row just left.
   */
  useEffect(() => {
    if (cardTimerRef.current) {
      clearTimeout(cardTimerRef.current);
      cardTimerRef.current = null;
    }
    if (
      !isOpen ||
      !hoveredInPanel ||
      hoveredIndex === null ||
      hoveredIndex === currentIndex
    ) {
      setCard(null);
      return undefined;
    }
    setCard(null);
    cardTimerRef.current = setTimeout(() => {
      cardTimerRef.current = null;
      setCard(computeCard());
    }, CARD_DELAY);
    return () => {
      if (cardTimerRef.current) {
        clearTimeout(cardTimerRef.current);
        cardTimerRef.current = null;
      }
    };
  }, [
    isOpen,
    hoveredInPanel,
    hoveredIndex,
    currentIndex,
    computeCard,
    setCard,
  ]);

  /**
   * Scroll one list to the row in question. The rail and the panel show the
   * same rows - a dash opposite each line of text - and have the same content
   * and viewport heights, so they share a single scroll position. Scrolling
   * them separately drifts every dash off its own row as soon as a thread is
   * longer than the panel can show.
   */
  const scrollRowIntoView = useCallback((container, index) => {
    if (!container || index === null || index === undefined) return;
    const row = container.children[index];
    if (!row) return;
    const top = row.offsetTop;
    const bottom = top + row.offsetHeight;
    if (top < container.scrollTop) container.scrollTop = top;
    else if (bottom > container.scrollTop + container.clientHeight)
      container.scrollTop = bottom - container.clientHeight;
  }, []);

  // Copying an offset that already matches is a no-op, which is what stops the
  // two scroll events from chasing each other.
  const syncScroll = useCallback((from, to) => {
    if (!from || !to || to.scrollTop === from.scrollTop) return;
    to.scrollTop = from.scrollTop;
  }, []);

  const onRailScroll = useCallback(() => {
    syncScroll(railRef.current, listRef.current);
    repositionCard();
  }, [repositionCard, syncScroll]);

  const onListScroll = useCallback(() => {
    syncScroll(listRef.current, railRef.current);
    repositionCard();
  }, [repositionCard, syncScroll]);

  // Keep the row being read (or pointed at) in view, bring the other list with
  // it and place the card on the same line.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    scrollRowIntoView(rail, isOpen ? highlightedIndex : currentIndex);
    syncScroll(rail, listRef.current);
    repositionCard();
  }, [
    isOpen,
    highlightedIndex,
    currentIndex,
    items.length,
    repositionCard,
    scrollRowIntoView,
    syncScroll,
  ]);

  if (!enabled || items.length === 0) return null;

  return (
    <div
      className={`absolute right-6 top-1/2 z-20 -translate-y-1/2 md:flex-col ${RAIL_VISIBILITY}`}
      style={{ maxHeight: RAIL_MAX_HEIGHT }}
      onMouseEnter={openPanel}
      onMouseLeave={scheduleClose}
      // Keyboard users get the same list: focusing a dash opens the panel, and
      // it closes only once focus has left the widget entirely.
      onFocus={openPanel}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) scheduleClose();
      }}
    >
      <div
        ref={railRef}
        // The rail is the only place dashes are drawn: the open panel lays its
        // text out beside them and leaves a matching gap, so hovering never
        // shows two sets. Painting above the panel keeps every dash exactly
        // where it was.
        className="relative z-10 flex min-h-0 flex-col items-center overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={onRailScroll}
      >
        {items.map((item, index) => {
          const isCurrent = index === currentIndex;
          const isHovered = index === hoveredIndex;
          return (
            <button
              key={item.messageIndex}
              type="button"
              aria-label={item.label}
              aria-current={isCurrent ? "true" : undefined}
              // shrink-0: as flex items these rows would otherwise be squeezed
              // to fit the rail's capped height, and every dash would then sit
              // 7.5px above the line of text it belongs to (and never scroll).
              className={`${ROW} w-4 shrink-0 justify-center`}
              style={{ height: QUESTION_ROW_HEIGHT }}
              onMouseEnter={() => {
                setHoveredIndex(index);
                setHoveredInPanel(false);
              }}
              onFocus={() => {
                setHoveredIndex(index);
                setHoveredInPanel(false);
              }}
              onClick={() => onJump?.(index)}
            >
              <span
                aria-hidden="true"
                className={`rounded-full transition-all ${
                  isCurrent
                    ? `h-[3px] w-3 ${DASH_CURRENT}`
                    : `h-[2px] w-2 ${isHovered ? DASH_HOVERED : DASH_IDLE}`
                }`}
              />
            </button>
          );
        })}
      </div>

      {isOpen && (
        <div
          // The panel slides out from under the rail: its surface reaches 6px
          // past the rail's own edge, so the rail's dashes sit inside it and
          // never move or duplicate.
          // 240 css px: a sub-pixel edge estimate of the reference still (the
          // point where a pixel is as close to the page as to the panel) gives
          // 362 device px at 150% = 241.3, so 240 is the round value it implies.
          className="absolute -right-[6px] top-1/2 z-0 w-[240px] -translate-y-1/2 rounded-2xl bg-[#232224] shadow-[0_4px_16px_rgba(0,0,0,0.35)] light:bg-white light:shadow-[0_6px_20px_rgba(0,0,0,0.10)]"
          style={{
            padding: QUESTION_PANEL_PADDING,
            // The list carries its own 6px scrollbar, which together with this
            // 2px inset lands the text 8px inside the panel.
            paddingRight: 0,
          }}
        >
          <div
            ref={listRef}
            className="overflow-y-auto pr-[2px] [scrollbar-color:#3C3B3D_transparent] [scrollbar-width:thin] light:[scrollbar-color:#E5E5E5_transparent] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#3C3B3D] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-[6px] light:[&::-webkit-scrollbar-thumb]:bg-[#E5E5E5]"
            style={{ maxHeight: QUESTION_PANEL_MAX_LIST_HEIGHT }}
            onScroll={onListScroll}
          >
            {items.map((item, index) => {
              const isCurrent = index === currentIndex;
              const isHovered = index === hoveredIndex;
              return (
                <button
                  key={item.messageIndex}
                  type="button"
                  aria-label={item.label}
                  aria-current={isCurrent ? "true" : undefined}
                  className={`${ROW} w-full justify-end text-sm ${
                    isHovered
                      ? LABEL_HOVERED
                      : isCurrent
                        ? LABEL_CURRENT
                        : LABEL_IDLE
                  }`}
                  style={{ height: QUESTION_ROW_HEIGHT }}
                  onMouseEnter={() => {
                    setHoveredIndex(index);
                    setHoveredInPanel(true);
                  }}
                  onFocus={() => {
                    setHoveredIndex(index);
                    setHoveredInPanel(true);
                  }}
                  onClick={() => onJump?.(index)}
                >
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {/* Keeps the text clear of the rail's dashes. */}
                  <span className={DASH_SLOT} aria-hidden="true" />
                </button>
              );
            })}
          </div>

          {/* A question too long for one line is spelled out beside the panel.
              The reference tucks its card 17px under the panel's left edge,
              which lands on the first character of the question; this takes half
              that. The right padding is wider than the left on purpose: the card
              always sits against the panel's left edge, so that extra air is what
              keeps a full line of the card's text off the panel's own text - on
              a wrapped question a line really can fill the card's width. It is
              12px text on an 18px line, clamped to five lines, and dark in both
              themes (#43444A on a dark page, the deeper #2C2C2E on a light one).
              Colours are explicit rather than the `text-white` utility, which
              this app re-colours in light mode. */}
          {overflowingLabel && (
            <div
              aria-hidden="true"
              className="absolute right-full z-20 -mr-2 line-clamp-5 w-max max-w-[280px] -translate-y-1/2 break-words rounded-lg bg-[#43444A] py-1 pl-2 pr-4 text-xs leading-[18px] text-[#F9F7FB] shadow-[0_4px_16px_rgba(0,0,0,0.35)] light:bg-[#2C2C2E] light:text-[#FFFFFF] light:shadow-none"
              style={{ top: overflowingLabel.centre }}
            >
              {overflowingLabel.label}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
