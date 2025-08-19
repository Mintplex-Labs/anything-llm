import React, { useState, useEffect } from "react";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Workspace from "@/models/workspace";
import ManageWorkspace, {
  useManageWorkspaceModal,
} from "../../Modals/ManageWorkspace";
import paths from "@/utils/paths";
import { useParams, useNavigate } from "react-router-dom";
import { GearSix, UploadSimple, DotsSixVertical } from "@phosphor-icons/react";
import useUser from "@/hooks/useUser";
import ThreadContainer from "./ThreadContainer";
import { useMatch } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import showToast from "@/utils/toast";
import { cn } from "@/lib/utils";

export default function ActiveWorkspaces() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWs, setSelectedWs] = useState(null);
  const { showing, showModal, hideModal } = useManageWorkspaceModal();
  const { user } = useUser();
  const isInWorkspaceSettings = !!useMatch("/workspace/:slug/settings/:tab");

  useEffect(() => {
    async function getWorkspaces() {
      const workspaces = await Workspace.all();
      setLoading(false);
      setWorkspaces(Workspace.orderWorkspaces(workspaces));
    }
    getWorkspaces();
  }, []);

  if (loading) {
    return (
      <Skeleton.default
        height={40}
        width="100%"
        count={5}
        baseColor="var(--theme-sidebar-item-default)"
        highlightColor="var(--theme-sidebar-item-hover)"
        enableAnimation={true}
        className="my-1"
      />
    );
  }

  /**
   * Reorders workspaces in the UI via localstorage on client side.
   * @param {number} startIndex - the index of the workspace to move
   * @param {number} endIndex - the index to move the workspace to
   */
  function reorderWorkspaces(startIndex, endIndex) {
    const reorderedWorkspaces = Array.from(workspaces);
    const [removed] = reorderedWorkspaces.splice(startIndex, 1);
    reorderedWorkspaces.splice(endIndex, 0, removed);
    setWorkspaces(reorderedWorkspaces);
    const success = Workspace.storeWorkspaceOrder(
      reorderedWorkspaces.map((w) => w.id)
    );
    if (!success) {
      showToast("Failed to reorder workspaces", "error");
      Workspace.all().then((workspaces) => setWorkspaces(workspaces));
    }
  }

  const onDragEnd = (result) => {
    if (!result.destination) return;
    reorderWorkspaces(result.source.index, result.destination.index);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="workspaces">
        {(provided) => (
          <ul
            role="list"
            aria-label="Workspaces"
            className="nav flex flex-col gap-y-2"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {workspaces.map((workspace, index) => {
              const isActive = workspace.slug === slug;
              return (
                <React.Fragment key={workspace.id}>
                  <Draggable
                    draggableId={workspace.id.toString()}
                    index={index}
                    isDragDisabled={user?.role === "default"}
                  >
                    {(provided, snapshot) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "group nav-item item flex items-center gap-2 px-3 py-2 rounded-lg",
                          isActive && "active font-semibold",
                          snapshot.isDragging && "opacity-50"
                        )}
                        role="listitem"
                      >
                        {user?.role !== "default" && (
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab"
                          >
                            <DotsSixVertical
                              size={20}
                              weight="bold"
                              className="text-[var(--theme-sidebar-item-workspace-active)]"
                            />
                          </div>
                        )}
                        <a
                          href={
                            isActive
                              ? null
                              : paths.workspace.chat(workspace.slug)
                          }
                          aria-current={isActive ? "page" : ""}
                          className="flex flex-grow overflow-hidden"
                        >
                          <span className="truncate w-[130px]">
                            {workspace.name}
                          </span>
                        </a>
                        {user?.role !== "default" && (
                          <div
                            className={cn(
                              "flex items-center gap-x-[2px] transition-opacity duration-200",
                              isActive
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                            )}
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedWs(workspace);
                                showModal();
                              }}
                              className="border-none rounded-md flex items-center justify-center ml-auto p-[2px] hover:bg-[#646768] text-[#A7A8A9] hover:text-white"
                            >
                              <UploadSimple className="h-[20px] w-[20px]" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigate(
                                  isInWorkspaceSettings
                                    ? paths.workspace.chat(workspace.slug)
                                    : paths.workspace.settings.generalAppearance(
                                        workspace.slug
                                      )
                                );
                              }}
                              className="rounded-md flex items-center justify-center text-[#A7A8A9] hover:text-white ml-auto p-[2px] hover:bg-[#646768]"
                              aria-label="General appearance settings"
                            >
                              <GearSix
                                className={cn(
                                  "h-[20px] w-[20px]",
                                  isInWorkspaceSettings &&
                                    workspace.slug === slug &&
                                    "text-[#46C8FF]"
                                )}
                              />
                            </button>
                          </div>
                        )}
                      </li>
                    )}
                  </Draggable>
                  {isActive && (
                    <ThreadContainer
                      workspace={workspace}
                      isActive={isActive}
                    />
                  )}
                </React.Fragment>
              );
            })}
            {provided.placeholder}
            {showing && (
              <ManageWorkspace
                hideModal={hideModal}
                providedSlug={selectedWs ? selectedWs.slug : null}
              />
            )}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}
