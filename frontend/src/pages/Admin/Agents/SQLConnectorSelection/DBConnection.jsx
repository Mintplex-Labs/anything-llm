import PostgreSQLLogo from "./icons/postgresql.png";
import MySQLLogo from "./icons/mysql.png";
import MSSQLLogo from "./icons/mssql.png";
import ODBCLogo from "./icons/odbc.png";
import { X } from "@phosphor-icons/react";

export const DB_LOGOS = {
  postgresql: PostgreSQLLogo,
  mysql: MySQLLogo,
  "sql-server": MSSQLLogo,
  odbc: ODBCLogo,
};

export default function DBConnection({ connection, onRemove, setHasChanges }) {
  const { database_id, engine } = connection;
  function removeConfirmation() {
    if (
      !window.confirm(
        `Delete ${database_id} from the list of available SQL connections? This cannot be undone.`
      )
    ) {
      return false;
    }
    onRemove(database_id);
    setHasChanges(true);
  }

  return (
    <div className="flex gap-x-4 items-center">
      <img
        src={DB_LOGOS?.[engine] ?? null}
        alt={`${engine} logo`}
        className="w-10 h-10 rounded-md"
      />
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col">
          <div className="text-sm font-semibold text-white">{database_id}</div>
          <div className="mt-1 text-xs text-description">{engine}</div>
        </div>
        <button
          type="button"
          onClick={removeConfirmation}
          className="border-none text-white/40 hover:text-red-500"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}
