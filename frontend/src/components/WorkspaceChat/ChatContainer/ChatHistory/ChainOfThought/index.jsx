import { Brain, CaretDown } from "@phosphor-icons/react";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const cn = (...classes) => classes.filter(Boolean).join(" ");

function useControllableState({ prop, defaultProp, onChange }) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultProp);
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolledValue;

  const setValue = useCallback(
    (next) => {
      const resolved = typeof next === "function" ? next(value) : next;
      if (!isControlled) setUncontrolledValue(resolved);
      if (resolved !== value) onChange?.(resolved);
    },
    [isControlled, onChange, value]
  );

  return [value, setValue];
}

const CollapsibleContext = createContext(null);

function Collapsible({ open, onOpenChange, children }) {
  const collapsibleContext = useMemo(
    () => ({ open, onOpenChange }),
    [open, onOpenChange]
  );

  return (
    <CollapsibleContext.Provider value={collapsibleContext}>
      <div data-state={open ? "open" : "closed"}>{children}</div>
    </CollapsibleContext.Provider>
  );
}

function CollapsibleTrigger({ className, children, ...props }) {
  const { open, onOpenChange } = useContext(CollapsibleContext);

  return (
    <button
      type="button"
      aria-expanded={open}
      data-state={open ? "open" : "closed"}
      onClick={() => onOpenChange?.(!open)}
      className={cn("border-none bg-transparent p-0", className)}
      {...props}
    >
      {children}
    </button>
  );
}

function CollapsibleContent({ className, children, ...props }) {
  const { open } = useContext(CollapsibleContext);
  const [isPresent, setIsPresent] = useState(open);

  useEffect(() => {
    if (open) setIsPresent(true);
  }, [open]);

  if (!isPresent) return null;

  return (
    <div
      data-state={open ? "open" : "closed"}
      // Keeps the closed content mounted until its exit animation finishes,
      // matching how radix unmounts a collapsible. Steps animate too, so only
      // the region's own animation may end the presence.
      onAnimationEnd={(event) => {
        if (event.target !== event.currentTarget || open) return;
        setIsPresent(false);
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}

function Badge({ className, children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-transparent px-2.5 py-0.5 font-semibold text-xs transition-colors",
        "bg-zinc-800 text-zinc-50 hover:bg-zinc-800/80 light:bg-zinc-100 light:text-zinc-900 light:hover:bg-zinc-100/80",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

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
export const ChainOfThought = memo(
  ({
    className,
    open,
    defaultOpen = false,
    onOpenChange,
    children,
    ...props
  }) => {
    const [isOpen, setIsOpen] = useControllableState({
      prop: open,
      defaultProp: defaultOpen,
      onChange: onOpenChange,
    });

    const chainOfThoughtContext = useMemo(
      () => ({ isOpen, setIsOpen }),
      [isOpen, setIsOpen]
    );

    return (
      <ChainOfThoughtContext.Provider value={chainOfThoughtContext}>
        <div
          className={cn("not-prose max-w-prose space-y-4", className)}
          {...props}
        >
          {children}
        </div>
      </ChainOfThoughtContext.Provider>
    );
  }
);

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.icon] - leading indicator, defaults to a brain glyph
 * @param {boolean} [props.pending] - sweeps a shine across the label while work is in flight
 */
export const ChainOfThoughtHeader = memo(
  ({ className, icon, pending = false, children, ...props }) => {
    const { isOpen, setIsOpen } = useChainOfThought();

    return (
      <Collapsible onOpenChange={setIsOpen} open={isOpen}>
        <CollapsibleTrigger
          className={cn(
            "flex w-full items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-50 light:text-zinc-500 light:hover:text-zinc-950",
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
            {children ?? "Chain of Thought"}
          </span>
          <CaretDown
            className={cn(
              "size-4 flex-shrink-0 transition-transform",
              isOpen ? "rotate-180" : "rotate-0"
            )}
          />
        </CollapsibleTrigger>
      </Collapsible>
    );
  }
);

/**
 * @param {Object} props
 * @param {React.ElementType} [props.icon] - marker icon, defaults to a dot
 * @param {React.ReactNode} props.label
 * @param {React.ReactNode} [props.description]
 * @param {"complete" | "active" | "pending"} [props.status]
 */
export const ChainOfThoughtStep = memo(
  ({
    className,
    icon: Icon,
    label,
    description,
    status = "complete",
    children,
    ...props
  }) => {
    const statusStyles = {
      complete: "text-zinc-400 light:text-zinc-500",
      active: "text-zinc-50 light:text-zinc-950",
      pending: "text-zinc-400/50 light:text-zinc-500/50",
    };

    return (
      <div
        className={cn(
          "group relative flex gap-2 text-sm mb-1",
          statusStyles[status],
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
  }
);

export const ChainOfThoughtSearchResults = memo(({ className, ...props }) => (
  <div
    className={cn("flex flex-wrap items-center gap-2", className)}
    {...props}
  />
));

export const ChainOfThoughtSearchResult = memo(
  ({ className, children, ...props }) => (
    <Badge
      className={cn("gap-1 px-2 py-0.5 font-normal text-xs", className)}
      {...props}
    >
      {children}
    </Badge>
  )
);

export const ChainOfThoughtContent = memo(
  ({ className, children, ...props }) => {
    const { isOpen } = useChainOfThought();

    return (
      <Collapsible open={isOpen}>
        <CollapsibleContent
          className={cn(
            "mt-2 space-y-3",
            "text-zinc-50 outline-none light:text-zinc-950 data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 data-[state=closed]:animate-out data-[state=open]:animate-in",
            className
          )}
          {...props}
        >
          {children}
        </CollapsibleContent>
      </Collapsible>
    );
  }
);

/**
 * @param {Object} props
 * @param {string} [props.caption]
 */
export const ChainOfThoughtImage = memo(
  ({ className, children, caption, ...props }) => (
    <div className={cn("mt-2 space-y-2", className)} {...props}>
      <div className="relative flex max-h-[22rem] items-center justify-center overflow-hidden rounded-lg bg-zinc-800 p-3 light:bg-zinc-100">
        {children}
      </div>
      {caption && (
        <p className="text-xs text-zinc-400 light:text-zinc-500">{caption}</p>
      )}
    </div>
  )
);

ChainOfThought.displayName = "ChainOfThought";
ChainOfThoughtHeader.displayName = "ChainOfThoughtHeader";
ChainOfThoughtStep.displayName = "ChainOfThoughtStep";
ChainOfThoughtSearchResults.displayName = "ChainOfThoughtSearchResults";
ChainOfThoughtSearchResult.displayName = "ChainOfThoughtSearchResult";
ChainOfThoughtContent.displayName = "ChainOfThoughtContent";
ChainOfThoughtImage.displayName = "ChainOfThoughtImage";
