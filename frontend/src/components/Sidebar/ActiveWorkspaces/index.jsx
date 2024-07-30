import React, { useState, useEffect, useCallback } from "react";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Workspace from "@/models/workspace";
import ManageWorkspace, {
  useManageWorkspaceModal,
} from "../../Modals/ManageWorkspace";
import paths from "@/utils/paths";
import { useParams } from "react-router-dom";
import { GearSix, SquaresFour, UploadSimple } from "@phosphor-icons/react";
import truncate from "truncate";
import useUser from "@/hooks/useUser";
import ThreadContainer from "./ThreadContainer";
import { Link, useMatch } from "react-router-dom";

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
  const isInWorkspaceSettings = !!useMatch("/workspace/:slug/settings/:tab");

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
    <div role="list" aria-label="Workspaces" className="flex flex-col gap-y-2">
      {workspaces.map((workspace) => {
        const isActive = workspace.slug === slug;
        const isHovered = hoverStates[workspace.id];
        return (
          <div
            className="flex flex-col w-full"
            onMouseEnter={() => handleMouseEnter(workspace.id)}
            onMouseLeave={() => handleMouseLeave(workspace.id)}
            key={workspace.id}
            role="listitem"
          >
            <div
              key={workspace.id}
              className="flex gap-x-2 items-center justify-between"
            >
              <a
                href={isActive ? null : paths.workspace.chat(workspace.slug)}
                aria-current={isActive ? "page" : ""}
                className={`
              transition-all duration-[200ms]
                flex flex-grow w-[75%] gap-x-2 py-[6px] px-[12px] rounded-[4px] text-white justify-start items-center
                hover:bg-workspace-item-selected-gradient hover:font-bold border-2 border-outline
                ${
                  isActive
                    ? "bg-workspace-item-selected-gradient font-bold"
                    : ""
                }`}
              >
                <div className="flex flex-row justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <SquaresFour
                      weight={isActive ? "fill" : "regular"}
                      className="flex-shrink-0"
                      size={24}
                    />
                    <p
                      className={`text-[14px] leading-loose whitespace-nowrap overflow-hidden ${
                        isActive ? "text-white " : "text-zinc-200"
                      }`}
                    >
                      {isActive || isHovered
                        ? truncate(workspace.name, 15)
                        : truncate(workspace.name, 20)}
                    </p>
                  </div>
                  {(isActive || isHovered || gearHover[workspace.id]) &&
                  user?.role !== "default" ? (
                    <div className="flex items-center gap-x-[2px]">
                      <div
                        className={`flex hover:bg-[#646768] p-[2px] rounded-[4px] text-[#A7A8A9] hover:text-white ${
                          uploadHover[workspace.id] ? "bg-[#646768]" : ""
                        }`}
                      >
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
                          className="rounded-md flex items-center justify-center ml-auto"
                        >
                          <UploadSimple
                            className="h-[20px] w-[20px]"
                            weight="bold"
                          />
                        </button>
                      </div>

                      <Link
                        type="button"
                        to={
                          isInWorkspaceSettings
                            ? paths.workspace.chat(workspace.slug)
                            : paths.workspace.settings.generalAppearance(
                                workspace.slug
                              )
                        }
                        onMouseEnter={() => handleGearMouseEnter(workspace.id)}
                        onMouseLeave={() => handleGearMouseLeave(workspace.id)}
                        className="rounded-md flex items-center justify-center text-[#A7A8A9] hover:text-white ml-auto"
                        aria-label="General appearance settings"
                      >
                        <div className="flex hover:bg-[#646768] p-[2px] rounded-[4px]">
                          <GearSix
                            color={
                              isInWorkspaceSettings && workspace.slug === slug
                                ? "#46C8FF"
                                : gearHover[workspace.id]
                                ? "#FFFFFF"
                                : "#A7A8A9"
                            }
                            weight="bold"
                            className="h-[20px] w-[20px]"
                          />
                        </div>
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
    </div>
  );
}
