import { useRef, useState } from "react";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import useScrollActiveItemIntoView from "@/hooks/useScrollActiveItemIntoView";

/**
 * Searchable dropdown panel shared by every provider selection menu.
 * Renders the backdrop, search field and filtered list - the caller renders
 * the closed state of the menu and each row.
 * @param {object} props
 * @param {Array<{name: string}>} props.items - options to list, filtered by name
 * @param {string} props.placeholder - search field placeholder
 * @param {(item: object) => React.ReactNode} props.renderItem - row renderer for a single item
 * @param {() => void} props.onClose - close the menu
 */
export default function ProviderSearchMenu({
  items,
  placeholder,
  renderItem,
  onClose,
}) {
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const listRef = useRef(null);
  const results = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  function search(value) {
    setQuery(value);
    setHighlightedIndex(0);
  }

  function handleXButton() {
    if (query.length > 0) return search("");
    onClose();
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") return onClose();
    if (e.key === "Enter") {
      e.preventDefault();
      // Rows own what selecting them does (some open a setup modal first),
      // so the highlighted row is clicked rather than selected from here.
      listRef.current?.children[highlightedIndex]?.firstElementChild?.click();
      return;
    }

    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    if (results.length === 0) return;
    setHighlightedIndex((prev) =>
      e.key === "ArrowDown"
        ? (prev + 1) % results.length
        : (prev - 1 + results.length) % results.length
    );
  }

  return (
    <>
      <div
        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 backdrop-blur-sm z-10"
        onClick={onClose}
      />
      <div className="absolute top-0 left-0 w-full max-w-[640px] max-h-[310px] min-h-[64px] bg-theme-settings-input-bg rounded-lg flex flex-col justify-between cursor-pointer border-2 border-primary-button z-20">
        <div className="w-full flex flex-col gap-y-1">
          <div className="flex items-center sticky top-0 z-10 border-b border-[#9CA3AF] mx-4 bg-theme-settings-input-bg">
            <MagnifyingGlass
              size={20}
              weight="bold"
              className="absolute left-4 z-30 text-theme-text-primary -ml-4 my-2"
            />
            <input
              type="search"
              autoFocus
              autoComplete="off"
              data-1p-ignore
              data-lpignore="true"
              data-form-type="other"
              placeholder={placeholder}
              value={query}
              onChange={(e) => search(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-none -ml-4 my-2 bg-transparent z-20 pl-12 h-[38px] w-full px-4 py-1 text-sm outline-none text-theme-text-primary placeholder:text-theme-text-primary placeholder:font-medium [&::-webkit-search-cancel-button]:appearance-none"
            />
            <X
              size={20}
              weight="bold"
              className="cursor-pointer text-theme-text-primary hover:text-x-button"
              onClick={handleXButton}
            />
          </div>
          {results.length === 0 && (
            <p className="text-center text-sm text-theme-text-secondary py-6">
              No results found
            </p>
          )}
          <div
            ref={listRef}
            className="flex-1 pl-4 pr-2 flex flex-col gap-y-1 overflow-y-auto white-scrollbar pb-4 max-h-[245px]"
          >
            {results.map((item, index) => (
              <MenuItem
                key={item.name}
                highlighted={index === highlightedIndex}
              >
                {renderItem(item)}
              </MenuItem>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function MenuItem({ highlighted, children }) {
  const { ref } = useScrollActiveItemIntoView({
    isActive: highlighted,
    behavior: "instant",
    block: "nearest",
  });

  return (
    <div
      ref={ref}
      className={`rounded-md ${highlighted ? "bg-zinc-700/50 light:bg-white" : ""}`}
    >
      {children}
    </div>
  );
}
