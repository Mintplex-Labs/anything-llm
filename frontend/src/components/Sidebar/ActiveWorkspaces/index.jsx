import React, { useState, useEffect } from "react";
import { Book, Settings } from "react-feather";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Workspace from "../../../models/workspace";
import ManageWorkspace, {
  useManageWorkspaceModal,
} from "../../Modals/MangeWorkspace";
import paths from "../../../utils/paths";
import { useParams } from "react-router-dom";
// import { GearSix, SquaresFour } from "phosphor-react";
import { GearSix, SquaresFour } from "@phosphor-icons/react";

export default function ActiveWorkspaces() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWs, setSelectedWs] = useState(null);
  const { showing, showModal, hideModal } = useManageWorkspaceModal();

  useEffect(() => {
    async function getWorkspaces() {
      const workspaces = await Workspace.all();
      setLoading(false);
      setWorkspaces(workspaces);
    }
    getWorkspaces();
  }, []);

  if (loading) {
    return (
      <>
        <Skeleton.default
          height={36}
          width="100%"
          count={3}
          baseColor="#292524"
          highlightColor="#4c4948"
          enableAnimation={true}
        />
      </>
    );
  }

  return (
    <>
      {workspaces.map((workspace) => {
        const isActive = workspace.slug === slug;
        return (
          <div
            key={workspace.id}
            className="flex gap-x-2 items-center justify-between"
          >
            <a
              href={isActive ? null : paths.workspace.chat(workspace.slug)}
              className={`flex flex-grow w-[75%] gap-x-2 py-[9px] px-[12px] rounded-lg text-slate-200 justify-start items-center ${
                isActive
                  ? "bg-workspace-item-selected-gradient border border-slate-100 border-opacity-50"
                  : "bg-workspace-item-gradient bg-opacity-60"
              }`}
            >
              <div className="flex flex-row justify-between w-full">
                <div className="flex items-center space-x-2">
                  <SquaresFour className="h-5 w-5 flex-shrink-0" />
                  <p
                    className={`text-white text-sm leading-loose font-medium whitespace-nowrap overflow-hidden ${
                      isActive ? "" : "text-opacity-80"
                    }`}
                  >
                    {workspace.name}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedWs(workspace);
                    showModal();
                  }}
                  className="rounded-md flex items-center justify-center text-white ml-auto"
                >
                  <GearSix hidden={!isActive} className="h-[20px] w-[20px] transition-all duration-300 group-hover:rotate-90" />
                </button>
              </div>
            </a>
          </div>
        );
      })}
      {showing && !!selectedWs && (
        <ManageWorkspace hideModal={hideModal} providedSlug={selectedWs.slug} />
      )}
    </>
  );
}
