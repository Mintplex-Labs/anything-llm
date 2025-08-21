import { Info } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";

export default function PGVectorOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-96">
          <div className="flex items-center gap-x-1 mb-3">
            <label className="text-white text-sm font-semibold block">
              Postgres Connection String
            </label>
            <Info
              size={16}
              className="text-theme-text-secondary cursor-pointer"
              data-tooltip-id="pgvector-connection-string-tooltip"
              data-tooltip-place="right"
            />
            <Tooltip
              delayHide={300}
              id="pgvector-connection-string-tooltip"
              className="max-w-md z-99"
              clickable={true}
            >
              <p className="text-md whitespace-pre-line break-words">
                This is the connection string for the Postgres database in the
                format of <br />
                <code>postgresql://username:password@host:port/database</code>
                <br />
                <br />
                The user for the database must have the following permissions:
                <ul className="list-disc list-inside">
                  <li>Read access to the database</li>
                  <li>Read access to the database schema</li>
                  <li>Create access to the database</li>
                </ul>
                <br />
                <b>
                  You must have the pgvector extension installed on the
                  database.
                </b>
              </p>
            </Tooltip>
          </div>
          <input
            type="text"
            name="PGVectorConnectionString"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="postgresql://username:password@host:port/database"
            defaultValue={
              settings?.PGVectorConnectionString ? "*".repeat(20) : ""
            }
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col w-60">
          <div className="flex items-center gap-x-1 mb-3">
            <label className="text-white text-sm font-semibold block">
              Vector Table Name
            </label>
            <Info
              size={16}
              className="text-theme-text-secondary cursor-pointer"
              data-tooltip-id="pgvector-table-name-tooltip"
              data-tooltip-place="right"
            />
            <Tooltip
              delayHide={300}
              id="pgvector-table-name-tooltip"
              className="max-w-md z-99"
              clickable={true}
            >
              <p className="text-md whitespace-pre-line break-words">
                This is the name of the table in the Postgres database that will
                store the vectors.
                <br />
                <br />
                By default, the table name is <code>anythingllm_vectors</code>.
                <br />
                <br />
                <b>
                  This table must not already exist on the database - it will be
                  created automatically.
                </b>
              </p>
            </Tooltip>
          </div>
          <input
            type="text"
            name="PGVectorTableName"
            autoComplete="off"
            defaultValue={settings?.PGVectorTableName}
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="vector_table"
          />
        </div>
      </div>
    </div>
  );
}
