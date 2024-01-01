import React, {useState, useEffect, useCallback} from "react";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Workspace from "@/models/workspace";
import ManageWorkspace, {
  useManageWorkspaceModal,
} from "../../Modals/MangeWorkspace";
import paths from "@/utils/paths";
import {useParams} from "react-router-dom";
import {GearSix, PencilSimple, SquaresFour} from "@phosphor-icons/react";
import truncate from "truncate";
import useUser from "@/hooks/useUser";
import NewThreadModal, {useNewThreadModal} from "@/components/Modals/NewThread.jsx";
import workspace from "@/models/workspace";

export default function ActiveWorkspaces() {
  const {slug, thread: threadId} = useParams();
  const [loading, setLoading] = useState(true);
  const [settingHover, setSettingHover] = useState({});
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWs, setSelectedWs] = useState(null);
  const [hoverStates, setHoverStates] = useState({});
  const {showing, showModal, hideModal} = useManageWorkspaceModal();
  const [expandedState, setExpandedState] = useState({});

  const {user} = useUser();

  useEffect(() => {
    async function getWorkspaces() {
      const workspaces = await Workspace.all();
      setLoading(false);
      setWorkspaces(workspaces);
      const current = workspaces.find((w) => w.slug === slug);
      if (current) {
        setExpandedState((prev) => ({[current.id]: true}));
      }
    }

    getWorkspaces();
  }, []);

  const updateThread = useCallback((thread) => {
    setWorkspaces((prev) => {
      return prev.map((w) => {
        let updatedWorkspace = {...w};
        if (updatedWorkspace.id === thread.workspace_id) {
          updatedWorkspace.threads = updatedWorkspace.threads.map((t) => {
            if (t.id === thread.id) {
              return thread;
            }
            return t;
          });
        }
        return updatedWorkspace;
      });
    });
  }, []);

  const handleMouseEnter = useCallback((workspaceId) => {
    setHoverStates((prev) => ({...prev, [workspaceId]: true}));
  }, []);

  const handleMouseLeave = useCallback((workspaceId) => {
    setHoverStates((prev) => ({...prev, [workspaceId]: false}));
  }, []);

  const handleGearMouseEnter = useCallback((workspaceId) => {
    setSettingHover((prev) => ({...prev, [workspaceId]: true}));
  }, []);

  const handleGearMouseLeave = useCallback((workspaceId) => {
    setSettingHover((prev) => ({...prev, [workspaceId]: false}));
  }, []);

  const handleWorkspaceClick = useCallback((workspaceId) => {
    setExpandedState((prev) => ({...prev, [workspaceId]: !prev[workspaceId]}));
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
        const isExpanded = expandedState[workspace.id];
        const isHovered = hoverStates[workspace.id];
        const isGearHovered = settingHover[workspace.id];
        return (
          <div
            key={workspace.id}
            className={`
                transition-all duration-[200ms]
                flex flex-col overflow-y-scroll no-scroll justify-between rounded-lg  border
                hover:bg-workspace-item-selected-gradient hover:border-slate-100 hover:border-opacity-50
                ${
              isActive
                ? "bg-workspace-item-selected-gradient border-slate-100 border-opacity-50"
                : "bg-workspace-item-gradient bg-opacity-60 border-transparent"
            }`}
            onMouseEnter={() => handleMouseEnter(workspace.id)}
            onMouseLeave={() => handleMouseLeave(workspace.id)}
          >
            <div className="flex gap-x-2 items-center justify-between">
              <a
                onClick={() => handleWorkspaceClick(workspace.id)}
                className={`
                  flex flex-grow w-[75%] gap-x-2 py-[6px] px-[12px] rounded-lg text-slate-200 justify-start items-center cursor-pointer
                `}
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
                      {isActive
                        ? truncate(workspace.name, 17)
                        : truncate(workspace.name, 20)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedWs(workspace);
                      showModal();
                    }}
                    onMouseEnter={() => handleGearMouseEnter(workspace.id)}
                    onMouseLeave={() => handleGearMouseLeave(workspace.id)}
                    className="rounded-md flex items-center justify-center text-white ml-auto"
                  >
                    <GearSix
                      weight={isGearHovered ? "fill" : "regular"}
                      hidden={
                        (!isActive && !isHovered) || user?.role === "default"
                      }
                      className="h-[20px] w-[20px] transition-all duration-300"
                    />
                  </button>
                </div>
              </a>
            </div>
            <ThreadList
              threads={workspace.threads}
              isExpanded={isExpanded}
              currentThreadId={threadId}
              workspace={workspace.slug}
              onUpdatedThread={updateThread}
            />
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

function ThreadList({currentThreadId, threads, workspace, isExpanded, onUpdatedThread}) {
  const {
    showing: showingNewThreadModal,
    workspace: newThreadWorkspace,
    thread: updatingThread,
    showCreateModal: showNewThreadModal,
    showUpdateModal: showUpdateThreadModal,
    hideModal: hideNewThreadModal,
  } = useNewThreadModal();

  return (
    <>
      <div className={`flex flex-col gap-y-2 overflow-y-scroll no-scroll
                  transition-all duration-[200ms]
                  ${isExpanded ? "max-h-screen" : "max-h-0"}
               `}>
        {threads.map((thread) => {
          return (
            <Thread
              key={thread.id}
              workspace={workspace}
              thread={thread}
              isActiveThread={thread.id === Number(currentThreadId)}
              onSettingsClick={() => showUpdateThreadModal(workspace, thread.id, onUpdatedThread)}
            />
          );
        })}
        <a
          onClick={() => showNewThreadModal(workspace)}
          className={`
                      flex flex-grow w-[100%] gap-x-2 py-[6px] px-[12px] rounded-lg text-emerald-200 justify-start items-center
                      hover:bg-workspace-item-gradient cursor-pointer`}
        >
          Create
        </a>
      </div>
      {showingNewThreadModal && <NewThreadModal hideModal={hideNewThreadModal} workspace={newThreadWorkspace} thread={updatingThread}/>}
    </>
  );
}

function Thread({thread, isActiveThread, workspace, onSettingsClick}) {
  const [isHoveredThread, setHoveredThread] = useState(false);
  const [isIconHovered, setIconHovered] = useState(false);
  return (
    <a
      href={isActiveThread ? null : paths.workspace.thread(workspace, thread.id)}
      onMouseEnter={() => setHoveredThread(true)}
      onMouseLeave={() => setHoveredThread(false)}
      className={`
                      flex flex-grow w-[100%] gap-x-2 py-[6px] px-[12px] rounded-lg text-slate-200 justify-start items-center
                      hover:bg-workspace-item-gradient
                      ${isActiveThread ? "bg-workspace-item-gradient" : ""}
                    `}
    >
      <div className="flex flex-row justify-between w-full">
        <div className="flex items-center space-x-2">
          <p
            className={`text-white text-sm leading-loose font-medium whitespace-nowrap overflow-hidden ${
              isActiveThread ? "" : "text-opacity-80"
            }`}
          >
            {isActiveThread || isHoveredThread
              ? truncate(thread.name, 20)
              : truncate(thread.name, 24)}
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onSettingsClick();
          }}
          className="rounded-md flex items-center justify-center text-white ml-auto"
        >
          <PencilSimple
            weight={isIconHovered ? "fill" : "regular"}
            hidden={
              (!isActiveThread && !isHoveredThread)
            }
            onMouseEnter={() => setIconHovered(true)}
            onMouseLeave={() => setIconHovered(false)}
            className="h-[20px] w-[20px] transition-all duration-300"
          />
        </button>
      </div>
    </a>
  );
}
