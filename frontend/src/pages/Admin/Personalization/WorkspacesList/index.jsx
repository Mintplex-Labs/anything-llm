import { useTranslation } from "react-i18next";
import paths from "@/utils/paths";
import { ArrowSquareOut } from "@phosphor-icons/react";

/**
 * @param {Object} props
 * @param {Object[]} props.workspaces
 * @param {Object[]} props.memories
 */
export default function WorkspacesList({ workspaces, memories }) {
  const { t } = useTranslation();

  return (
    <div>
      <div className="flex flex-col gap-y-1 mb-4">
        <label className="block input-label">
          {t("personalization.workspace.list-title")}
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium">
          {t("personalization.workspace.list-description")}
        </p>
      </div>
      {workspaces.length === 0 ? (
        <p className="text-xs text-theme-text-secondary">
          {t("personalization.workspace.no-workspaces")}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left rounded-lg min-w-[400px] border-spacing-0">
            <thead className="text-theme-text-secondary text-xs leading-[18px] font-bold uppercase border-white/10 border-b">
              <tr>
                <th scope="col" className="px-6 py-3 rounded-tl-lg">
                  {t("personalization.table.workspace")}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t("personalization.table.memories")}
                </th>
                <th scope="col" className="px-6 py-3 rounded-tr-lg">
                  {" "}
                </th>
              </tr>
            </thead>
            <tbody>
              {workspaces.map((ws) => {
                const count = memories.filter(
                  (m) => m.workspaceId === ws.id && m.scope === "workspace"
                ).length;
                return (
                  <tr
                    key={ws.id}
                    className="bg-transparent text-white text-opacity-80 text-xs font-medium border-b border-white/10 h-10"
                  >
                    <th scope="row" className="px-6 whitespace-nowrap">
                      {ws.name}
                    </th>
                    <td className="px-6">{count}</td>
                    <td className="px-6">
                      <a
                        href={paths.workspace.settings.personalization(ws.slug)}
                        className="text-white flex items-center gap-x-1 hover:underline hover:text-sky-400"
                      >
                        {t("personalization.table.manage")}{" "}
                        <ArrowSquareOut size={14} />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
