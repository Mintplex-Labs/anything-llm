import { CaretDown, CaretUp } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export default function LogRow({ log }) {
  const [expanded, setExpanded] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [hasMetadata, setHasMetadata] = useState(false);

  useEffect(() => {
    function parseAndSetMetadata() {
      try {
        let data = JSON.parse(log.metadata);
        setHasMetadata(Object.keys(data)?.length > 0);
        setMetadata(data);
      } catch {}
    }
    parseAndSetMetadata();
  }, [log.metadata]);

  const handleRowClick = () => {
    if (log.metadata !== "{}") {
      setExpanded(!expanded);
    }
  };

  return (
    <>
      <tr
        onClick={handleRowClick}
        className={`bg-transparent text-white text-opacity-80 text-sm font-medium ${
          hasMetadata ? "cursor-pointer hover:bg-white/5" : ""
        }`}
      >
        <EventBadge event={log.event} />
        <td className="px-6 py-4 border-transparent transform transition-transform duration-200">
          {log.user.username}
        </td>
        <td className="px-6 py-4 border-transparent transform transition-transform duration-200">
          {log.occurredAt}
        </td>
        {hasMetadata && (
          <>
            {expanded ? (
              <td
                className={`px-2 gap-x-1 flex items-center justify-center transform transition-transform duration-200 hover:scale-105`}
              >
                <CaretUp weight="bold" size={20} />
                <p className="text-xs text-white/50 w-[20px]">hide</p>
              </td>
            ) : (
              <td
                className={`px-2 gap-x-1 flex items-center justify-center transform transition-transform duration-200 hover:scale-105`}
              >
                <CaretDown weight="bold" size={20} />
                <p className="text-xs text-white/50 w-[20px]">show</p>
              </td>
            )}
          </>
        )}
      </tr>
      <EventMetadata metadata={metadata} expanded={expanded} />
    </>
  );
}

const EventMetadata = ({ metadata, expanded = false }) => {
  if (!metadata || !expanded) return null;
  return (
    <tr className="bg-sidebar">
      <td
        colSpan="2"
        className="px-6 py-4 font-medium text-white rounded-l-2xl"
      >
        Event Metadata
      </td>
      <td colSpan="4" className="px-6 py-4 rounded-r-2xl">
        <div className="w-full rounded-lg bg-main-2 p-2 text-white shadow-sm border-white border bg-opacity-10">
          <pre className="overflow-scroll">
            {JSON.stringify(metadata, null, 2)}
          </pre>
        </div>
      </td>
    </tr>
  );
};

const EventBadge = ({ event }) => {
  let colorTheme = { bg: "bg-sky-600/20", text: "text-sky-400 " };
  if (event.includes("update"))
    colorTheme = { bg: "bg-yellow-600/20", text: "text-yellow-400 " };
  if (event.includes("failed_") || event.includes("deleted"))
    colorTheme = { bg: "bg-red-600/20", text: "text-red-400 " };
  if (event === "login_event")
    colorTheme = { bg: "bg-green-600/20", text: "text-green-400 " };

  return (
    <td className="px-6 py-4 font-medium whitespace-nowrap text-white flex items-center">
      <span
        className={`rounded-full ${colorTheme.bg} px-2 py-0.5 text-sm font-medium ${colorTheme.text} shadow-sm`}
      >
        {event}
      </span>
    </td>
  );
};
