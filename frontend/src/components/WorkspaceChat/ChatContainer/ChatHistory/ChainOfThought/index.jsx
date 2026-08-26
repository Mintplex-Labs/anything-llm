import { Brain, CaretRight } from "@phosphor-icons/react";
import {
  createContext,
  memo,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const STEP_STATUS_STYLES = {
  complete: "text-zinc-400 light:text-zinc-500",
  active: "text-zinc-50 light:text-zinc-950",
  pending: "text-zinc-400/50 light:text-zinc-500/50",
};

const ChainOfThoughtContext = createContext(null);

const useChainOfThought = () => {
  const context = useContext(ChainOfThoughtContext);
  if (!context) {
    throw new Error(
      "ChainOfThought components must be used within ChainOfThought"
    );
  }
  return context;
};

/**
 * @param {Object} props
 * @param {boolean} [props.open] - controlled open state
 * @param {boolean} [props.defaultOpen] - uncontrolled initial open state
 * @param {(open: boolean) => void} [props.onOpenChange]
 */
export function ChainOfThought({
  className,
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  ...props
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = open ?? uncontrolledOpen;
  const contentId = useId();

  const chainOfThoughtContext = useMemo(
    () => ({
      isOpen,
      contentId,
      setIsOpen: (next) => {
        setUncontrolledOpen(next);
        onOpenChange?.(next);
      },
    }),
    [isOpen, contentId, onOpenChange]
  );

  return (
    <ChainOfThoughtContext.Provider value={chainOfThoughtContext}>
      <div
        className={cn("not-prose max-w-prose space-y-4 mt-2 mb-1", className)}
        {...props}
      >
        {children}
      </div>
    </ChainOfThoughtContext.Provider>
  );
}

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.icon] - leading indicator, defaults to a brain glyph
 * @param {boolean} [props.pending] - sweeps a shine across the label while work is in flight
 */
export function ChainOfThoughtHeader({
  className,
  icon,
  pending = false,
  children,
  ...props
}) {
  const { isOpen, setIsOpen, contentId } = useChainOfThought();

  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-controls={contentId}
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        "border-none bg-transparent p-0 flex w-full items-center gap-2 text-md text-zinc-400 transition-colors hover:text-zinc-50 light:text-zinc-500 light:hover:text-zinc-950",
        className
      )}
      {...props}
    >
      {icon ?? <Brain className="size-4 flex-shrink-0" />}
      {/*
        No `flex-1` here: the caret should sit next to the label rather than
        out at the container edge. The label still shrinks and truncates when
        the row runs out of room.
      */}
      <span
        className={cn(
          "min-w-0 truncate text-left",
          pending &&
            "animate-shimmer bg-[length:200%_100%] bg-clip-text text-transparent bg-[linear-gradient(90deg,theme(colors.zinc.500),theme(colors.zinc.100),theme(colors.zinc.500))] light:bg-[linear-gradient(90deg,theme(colors.zinc.400),theme(colors.zinc.900),theme(colors.zinc.400))]"
        )}
      >
        {children ?? "Thoughts"}
      </span>
      <CaretRight
        className={cn(
          "size-3 flex-shrink-0 transition-transform",
          isOpen ? "rotate-90" : "rotate-0"
        )}
      />
    </button>
  );
}

/**
 * @param {Object} props
 * @param {React.ElementType} [props.icon] - marker icon, defaults to a dot
 * @param {React.ReactNode} props.label - keep this a primitive (string) where
 *   possible so the memo on this component can skip unchanged steps.
 * @param {React.ReactNode} [props.description]
 * @param {"complete" | "active" | "pending"} [props.status]
 */
export const ChainOfThoughtStep = memo(function ChainOfThoughtStep({
  className,
  icon: Icon,
  label,
  description,
  status = "complete",
  children,
  ...props
}) {
  return (
    <div
      className={cn(
        "group relative flex gap-2 text-sm",
        STEP_STATUS_STYLES[status],
        "fade-in-0 slide-in-from-top-2 animate-in",
        className
      )}
      {...props}
    >
      {/*
        Spans the gap to the next step so the rail is continuous. Anchored to
        the row rather than the marker, which is only as tall as the marker
        itself and would give the rule no height to fill. The offset reaches
        past the `space-y-3` gap between steps plus half a marker, so the rule
        meets the next marker instead of stopping short.
      */}
      <div className="absolute left-[7.5px] top-[15px] bottom-[calc(-0.75rem-6.5px)] w-px bg-zinc-800 group-last:hidden light:bg-zinc-200" />
      {/* h-5 matches the text-sm line height so the marker centers on the first line */}
      <div className="relative flex h-5 w-4 flex-shrink-0 items-center justify-center">
        {Icon ? (
          <Icon className="size-4" />
        ) : (
          <span className="size-[7px] rounded-full bg-current opacity-60" />
        )}
      </div>
      <div className="flex-1 space-y-2 overflow-hidden">
        <div>{label}</div>
        {description && (
          <div className="text-xs text-zinc-400 light:text-zinc-500">
            {description}
          </div>
        )}
        {children}
      </div>
    </div>
  );
});

export function ChainOfThoughtContent({ className, children, ...props }) {
  const { isOpen, contentId } = useChainOfThought();
  const [isPresent, setIsPresent] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setIsPresent(true);
  }, [isOpen]);

  if (!isPresent) return null;

  return (
    <div
      id={contentId}
      data-state={isOpen ? "open" : "closed"}
      // Keeps the closed content mounted until its exit animation finishes,
      // matching how radix unmounts a collapsible. Steps animate too, so only
      // the region's own animation may end the presence.
      onAnimationEnd={(event) => {
        if (event.target !== event.currentTarget || isOpen) return;
        setIsPresent(false);
      }}
      className={cn(
        "mt-2 space-y-3",
        "text-zinc-50 outline-none light:text-zinc-950 data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 data-[state=closed]:animate-out data-[state=open]:animate-in",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
