import { CaretDown } from "@phosphor-icons/react";
import { useState } from "react";

export default function LogRow({ log }) {
  const [expanded, setExpanded] = useState(false);

  const handleRowClick = () => {
    if (log.metadata !== "{}") {
      setExpanded(!expanded);
    }
  };

  return (
    <>
      <tr
        onClick={handleRowClick}
        className="bg-transparent text-white text-opacity-80 text-sm font-medium cursor-pointer"
      >
        <td className="px-6 py-4 font-medium whitespace-nowrap text-white">
          {log.id}
        </td>
        {/* <td className="px-6 py-4 font-medium whitespace-nowrap text-white flex items-center">
          <span className="rounded-full bg-sky-600/20 px-2 py-0.5 text-sm font-medium text-sky-400 shadow-sm">
            {log.event}
          </span>
        </td> */}
        <EventBadge event={log.event} />
        <td className="px-6 py-4 border-transparent transform transition-transform duration-200">
          {log.user.username}
        </td>
        <td className="px-6 py-4 border-transparent transform transition-transform duration-200">
          {log.occurredAt}
        </td>
        {log.metadata !== "{}" && (
          <td
            className={`flex items-center justify-center transform transition-transform duration-200 hover:scale-105 ${
              expanded ? "rotate-0" : "rotate-90"
            }`}
          >
            <CaretDown weight="bold" size={20} />
          </td>
        )}
      </tr>
      {expanded && (
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
                {JSON.stringify(JSON.parse(log.metadata), null, 2)}
              </pre>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

const EventBadge = ({ event }) => {
  if (event.includes("attempted")) {
    return (
      <td className="px-6 py-4 font-medium whitespace-nowrap text-white flex items-center">
        <span className="rounded-full bg-red-600/20 px-2 py-0.5 text-sm font-medium text-red-400 shadow-sm">
          {event}
        </span>
      </td>
    );
  }

  if (event.includes("login_event")) {
    return (
      <td className="px-6 py-4 font-medium whitespace-nowrap text-white flex items-center">
        <span className="rounded-full bg-green-600/20 px-2 py-0.5 text-sm font-medium text-green-400 shadow-sm">
          {event}
        </span>
      </td>
    );
  }
  return (
    <td className="px-6 py-4 font-medium whitespace-nowrap text-white flex items-center">
      <span className="rounded-full bg-sky-600/20 px-2 py-0.5 text-sm font-medium text-sky-400 shadow-sm">
        {event}
      </span>
    </td>
  );
};
