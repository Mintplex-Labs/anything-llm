import React, { useState, useEffect } from "react";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Workspace from "@/models/workspace";
import ManageWorkspace, {
  useManageWorkspaceModal,
} from "../../Modals/ManageWorkspace";
import paths from "@/utils/paths";
import { useParams } from "react-router-dom";
import {
  GearSix,
  UploadSimple,
  DotsSixVertical,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react";
import useUser from "@/hooks/useUser";
import ThreadContainer from "./ThreadContainer";
import { Link, useMatch } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import showToast from "@/utils/toast";

export default function ActiveWorkspaces() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState(() =>
    Workspace.getSavedSearchFilter()
  );
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

  // Save search term to localStorage whenever it changes
  useEffect(() => {
    Workspace.storeSearchFilter(searchTerm);
  }, [searchTerm]);

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

  const filteredWorkspaces = workspaces.filter((workspace) =>
    workspace.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    Workspace.storeSearchFilter("");
  };

  return (
    <>
      <div className="mb-1 relative px-0.5">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <MagnifyingGlass
            size={16}
            color="var(--theme-sidebar-item-workspace-active)"
          />
        </div>
        <input
          type="text"
          placeholder="Search workspaces..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full bg-theme-sidebar-item-default text-white border border-theme-sidebar-item-hover rounded-md pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
          aria-label="Search workspaces"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
            aria-label="Clear search"
          >
            <X size={16} weight="bold" />
          </button>
        )}
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="workspaces">
          {(provided) => (
            <div
              role="list"
              aria-label="Workspaces"
              className="flex flex-col gap-y-2"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {filteredWorkspaces.map((workspace, index) => {
                const isActive = workspace.slug === slug;
                return (
                  <Draggable
                    key={workspace.id}
                    draggableId={workspace.id.toString()}
                    index={index}
                    isDragDisabled={user?.role === "default"}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex flex-col w-full group ${
                          snapshot.isDragging ? "opacity-50" : ""
                        }`}
                        role="listitem"
                      >
                        <div className="flex gap-x-2 items-center justify-between">
                          <a
                            href={
                              isActive
                                ? null
                                : paths.workspace.chat(workspace.slug)
                            }
                            aria-current={isActive ? "page" : ""}
                            className={`
                            transition-all duration-[200ms]
                            flex flex-grow w-[75%] gap-x-2 py-[6px] pl-[4px] pr-[6px] rounded-[4px] text-white justify-start items-center
                            bg-theme-sidebar-item-default
                            hover:bg-theme-sidebar-subitem-hover hover:font-bold
                            ${isActive ? "bg-theme-sidebar-item-selected font-bold light:outline-2 light:outline light:outline-blue-400 light:outline-offset-[-2px]" : ""}
                          `}
                          >
                            <div className="flex flex-row justify-between w-full items-center">
                              {user?.role !== "default" && (
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-grab mr-[3px]"
                                >
                                  <DotsSixVertical
                                    size={20}
                                    color="var(--theme-sidebar-item-workspace-active)"
                                    weight="bold"
                                  />
                                </div>
                              )}
                              <div className="flex items-center space-x-2 overflow-hidden flex-grow">
                                <div className="w-[130px] overflow-hidden">
                                  <p
                                    className={`
                                  text-[14px] leading-loose whitespace-nowrap overflow-hidden text-white
                                  ${isActive ? "font-bold" : "font-medium"} truncate
                                  w-full group-hover:w-[100px] group-hover:font-bold group-hover:duration-200
                                `}
                                  >
                                    {workspace.name}
                                  </p>
                                </div>
                              </div>
                              {user?.role !== "default" && (
                                <div
                                  className={`flex items-center gap-x-[2px] transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
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
                                    <UploadSimple
                                      className="h-[20px] w-[20px]"
                                      // weight="bold"
                                    />
                                  </button>
                                  <Link
                                    to={
                                      isInWorkspaceSettings
                                        ? paths.workspace.chat(workspace.slug)
                                        : paths.workspace.settings.generalAppearance(
                                            workspace.slug
                                          )
                                    }
                                    className="rounded-md flex items-center justify-center text-[#A7A8A9] hover:text-white ml-auto p-[2px] hover:bg-[#646768]"
                                    aria-label="General appearance settings"
                                  >
                                    <GearSix
                                      color={
                                        isInWorkspaceSettings &&
                                        workspace.slug === slug
                                          ? "#46C8FF"
                                          : undefined
                                      }
                                      // weight="bold"
                                      className="h-[20px] w-[20px]"
                                    />
                                  </Link>
                                </div>
                              )}
                            </div>
                          </a>
                        </div>
                        {isActive && (
                          <ThreadContainer
                            workspace={workspace}
                            isActive={isActive}
                          />
                        )}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
              {showing && (
                <ManageWorkspace
                  hideModal={hideModal}
                  providedSlug={selectedWs ? selectedWs.slug : null}
                />
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}
