import React, { useState, useEffect, useRef, useCallback } from "react";
import ManageWorkspace, {
  useManageWorkspaceModal,
} from "@/components/Modals/ManageWorkspace";
import NewWorkspaceModal, {
  useNewWorkspaceModal,
} from "@/components/Modals/NewWorkspace";
import Workspace from "@/models/workspace";
import { useNavigate } from "react-router-dom";
import { ChecklistItem } from "./ChecklistItem";
import showToast from "@/utils/toast";
import {
  CHECKLIST_HIDDEN,
  CHECKLIST_STORAGE_KEY,
  CHECKLIST_ITEMS,
  CHECKLIST_UPDATED_EVENT,
} from "./constants";
import ConfettiExplosion from "react-confetti-explosion";
import { safeJsonParse } from "@/utils/request";
import { useTranslation } from "react-i18next";

const MemoizedChecklistItem = React.memo(ChecklistItem);
export default function Checklist() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [isHidden, setIsHidden] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const {
    showModal: showNewWsModal,
    hideModal: hideNewWsModal,
    showing: showingNewWsModal,
  } = useNewWorkspaceModal();
  const { showModal: showManageWsModal, hideModal: hideManageWsModal } =
    useManageWorkspaceModal();

  const createItemHandler = useCallback(
    (item) => {
      return () =>
        item.handler({
          workspaces,
          navigate,
          setSelectedWorkspace,
          showManageWsModal,
          showToast,
          showNewWsModal,
        });
    },
    [
      workspaces,
      navigate,
      setSelectedWorkspace,
      showManageWsModal,
      showToast,
      showNewWsModal,
    ]
  );

  useEffect(() => {
    async function initialize() {
      try {
        const hidden = window.localStorage.getItem(CHECKLIST_HIDDEN);
        setIsHidden(!!hidden);
        // If the checklist is hidden, don't bother evaluating it.
        if (hidden) return;

        // If the checklist is completed then dont continue and just show the completed state.
        const checklist = window.localStorage.getItem(CHECKLIST_STORAGE_KEY);
        const existingChecklist = checklist ? safeJsonParse(checklist, {}) : {};
        const isCompleted =
          Object.keys(existingChecklist).length === CHECKLIST_ITEMS().length;
        setIsCompleted(isCompleted);
        if (isCompleted) return;

        // Otherwise, we can fetch workspaces for our checklist tasks as well
        // as determine if the create_workspace task is completed for pre-checking.
        const workspaces = await Workspace.all();
        setWorkspaces(workspaces);
        if (workspaces.length > 0) {
          existingChecklist["create_workspace"] = true;
          window.localStorage.setItem(
            CHECKLIST_STORAGE_KEY,
            JSON.stringify(existingChecklist)
          );
        }

        evaluateChecklist(); // Evaluate checklist on mount.
        window.addEventListener(CHECKLIST_UPDATED_EVENT, evaluateChecklist);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    initialize();
    return () => {
      window.removeEventListener(CHECKLIST_UPDATED_EVENT, evaluateChecklist);
    };
  }, []);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const workspaces = await Workspace.all();
      setWorkspaces(workspaces);
    };
    fetchWorkspaces();
  }, []);

  useEffect(() => {
    if (isCompleted) {
      setTimeout(() => {
        handleClose();
      }, 5_000);
    }
  }, [isCompleted]);

  const evaluateChecklist = useCallback(() => {
    try {
      const checklist = window.localStorage.getItem(CHECKLIST_STORAGE_KEY);
      if (!checklist) return;
      const completedItems = safeJsonParse(checklist, {});
      setCompletedCount(Object.keys(completedItems).length);
      setIsCompleted(
        Object.keys(completedItems).length === CHECKLIST_ITEMS().length
      );
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleClose = useCallback(() => {
    window.localStorage.setItem(CHECKLIST_HIDDEN, "true");
    if (containerRef?.current) containerRef.current.style.height = "0px";
  }, []);
  if (isHidden || loading) return null;

  return (
    <div
      ref={containerRef}
      className="transition-height duration-300 h-[100%] overflow-y-hidden relative"
    >
      <div
        className={`${isCompleted ? "checklist-completed" : "hidden"} absolute top-0 left-0 w-full h-full p-2 z-10 transition-all duration-300`}
      >
        {isCompleted && (
          <div className="flex w-full items-center justify-center">
            <ConfettiExplosion force={0.25} duration={3000} />
          </div>
        )}
        <div
          style={{}}
          className="bg-[rgba(54,70,61,0.5)] light:bg-[rgba(216,243,234,0.5)] w-full h-full flex items-center justify-center bg-theme-checklist-item-completed-bg/50 rounded-lg"
        >
          <p className="text-theme-checklist-item-completed-text text-lg font-bold">
            {t("main-page.checklist.completed")}
          </p>
        </div>
      </div>

      <div
        className={`rounded-lg p-4 lg:p-6 bg-theme-home-bg-card relative ${isCompleted ? "blur-sm" : ""}`}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-x-3">
            <h1 className="text-theme-home-text uppercase text-sm font-semibold">
              {t("main-page.checklist.title")}
            </h1>
            {CHECKLIST_ITEMS().length - completedCount > 0 && (
              <p className="text-theme-home-text-secondary text-xs">
                {CHECKLIST_ITEMS().length - completedCount}{" "}
                {t("main-page.checklist.tasksLeft")}
              </p>
            )}
          </div>

          <div className="flex items-center gap-x-2">
            <button
              onClick={handleClose}
              className="text-theme-home-text-secondary bg-theme-home-bg-button px-3 py-1 rounded-xl hover:bg-white/10 transition-colors text-xs light:bg-black-100"
            >
              {t("main-page.checklist.dismiss")}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHECKLIST_ITEMS().map((item) => (
            <MemoizedChecklistItem
              key={item.id}
              id={item.id}
              title={item.title}
              action={item.action}
              icon={item.icon}
              completed={item.completed}
              onAction={createItemHandler(item)}
            />
          ))}
        </div>
      </div>
      {showingNewWsModal && <NewWorkspaceModal hideModal={hideNewWsModal} />}
      {selectedWorkspace && (
        <ManageWorkspace
          providedSlug={selectedWorkspace.slug}
          hideModal={() => {
            setSelectedWorkspace(null);
            hideManageWsModal();
          }}
        />
      )}
    </div>
  );
}
