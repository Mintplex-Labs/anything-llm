import React, { useState, useEffect, useCallback } from "react";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Workspace from "@/models/workspace";
import ManageWorkspace, {
  useManageWorkspaceModal,
} from "../../Modals/MangeWorkspace";
import paths from "@/utils/paths";
import { useParams } from "react-router-dom";
import { GearSix, SquaresFour, UploadSimple } from "@phosphor-icons/react";
import truncate from "truncate";
import useUser from "@/hooks/useUser";
import ThreadContainer from "./ThreadContainer";
import { Link } from "react-router-dom";

export default function ActiveWorkspaces() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWs, setSelectedWs] = useState(null);
  const [hoverStates, setHoverStates] = useState({});
  const [gearHover, setGearHover] = useState({});
  const [uploadHover, setUploadHover] = useState({});
  const { showing, showModal, hideModal } = useManageWorkspaceModal();
  const { user } = useUser();

  useEffect(() => {
    async function getWorkspaces() {
      const workspaces = await Workspace.all();
      setLoading(false);
      setWorkspaces(workspaces);
    }
    getWorkspaces();
  }, []);
  const handleMouseEnter = useCallback((workspaceId) => {
    setHoverStates((prev) => ({ ...prev, [workspaceId]: true }));
  }, []);

  const handleMouseLeave = useCallback((workspaceId) => {
    setHoverStates((prev) => ({ ...prev, [workspaceId]: false }));
  }, []);
  const handleGearMouseEnter = useCallback((workspaceId) => {
    setGearHover((prev) => ({ ...prev, [workspaceId]: true }));
  }, []);

  const handleGearMouseLeave = useCallback((workspaceId) => {
    setGearHover((prev) => ({ ...prev, [workspaceId]: false }));
  }, []);

  const handleUploadMouseEnter = useCallback((workspaceId) => {
    setUploadHover((prev) => ({ ...prev, [workspaceId]: true }));
  }, []);

  const handleUploadMouseLeave = useCallback((workspaceId) => {
    setUploadHover((prev) => ({ ...prev, [workspaceId]: false }));
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
        const isHovered = hoverStates[workspace.id];
        return (
          <div
            className="flex flex-col w-full"
            onMouseEnter={() => handleMouseEnter(workspace.id)}
            onMouseLeave={() => handleMouseLeave(workspace.id)}
            key={workspace.id}
          >
            <div
              key={workspace.id}
              className="flex gap-x-2 items-center justify-between"
            >
              <a
                href={isActive ? null : paths.workspace.chat(workspace.slug)}
                className={`
              transition-all duration-[200ms]
                flex flex-grow w-[75%] gap-x-2 py-[6px] px-[12px] rounded-lg text-slate-200 justify-start items-center 
                hover:bg-workspace-item-selected-gradient 
                ${
                  isActive
                    ? "border-2 bg-workspace-item-selected-gradient border-white"
                    : "border bg-workspace-item-gradient bg-opacity-60 border-transparent hover:border-slate-100 hover:border-opacity-50"
                }`}
              >
                <div className="flex flex-row justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <SquaresFour
                      weight={isActive ? "fill" : "regular"}
                      className="h-5 w-5 flex-shrink-0"
                    />
                    <p
                      className={`text-white text-sm leading-loose font-medium whitespace-nowrap overflow-hidden ${
                        isActive ? "" : "text-opacity-80"
                      }`}
                    >
                      {isActive || isHovered
                        ? truncate(workspace.name, 17)
                        : truncate(workspace.name, 20)}
                    </p>
                  </div>
                  {isActive ||
                  isHovered ||
                  gearHover[workspace.id] ||
                  user?.role === "default" ? (
                    <div className="flex items-center gap-x-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedWs(workspace);
                          showModal();
                        }}
                        onMouseEnter={() =>
                          handleUploadMouseEnter(workspace.id)
                        }
                        onMouseLeave={() =>
                          handleUploadMouseLeave(workspace.id)
                        }
                        className="rounded-md flex items-center justify-center text-white ml-auto"
                      >
                        <UploadSimple
                          weight={
                            uploadHover[workspace.id] ? "fill" : "regular"
                          }
                          className="h-[20px] w-[20px] transition-all duration-300"
                        />
                      </button>

                      <Link
                        type="button"
                        to={paths.workspace.settings.generalAppearance(
                          workspace.slug
                        )}
                        onMouseEnter={() => handleGearMouseEnter(workspace.id)}
                        onMouseLeave={() => handleGearMouseLeave(workspace.id)}
                        className="rounded-md flex items-center justify-center text-white ml-auto"
                      >
                        <GearSix
                          weight={gearHover[workspace.id] ? "fill" : "regular"}
                          className="h-[20px] w-[20px] transition-all duration-300"
                        />
                      </Link>
                    </div>
                  ) : null}
                </div>
              </a>
            </div>
            {isActive && (
              <ThreadContainer workspace={workspace} isActive={isActive} />
            )}
          </div>
        );
      })}
      {showing && (
        <ManageWorkspace
          hideModal={hideModal}
          providedSlug={selectedWs ? selectedWs.slug : null}
        />
      )}
    </>
  );
}
