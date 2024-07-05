import useUser from "@/hooks/useUser";
import Workspace from "@/models/workspace";
import paths from "@/utils/paths";
import {
  CaretDown,
  CaretRight,
  GearSix,
  MagnifyingGlass,
  SquaresFour,
  UploadSimple,
} from "@phosphor-icons/react";
import React, { useCallback, useEffect, useState } from "react";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link, useMatch, useParams } from "react-router-dom";
import truncate from "truncate";
import ManageWorkspace, {
  useManageWorkspaceModal,
} from "../../Modals/ManageWorkspace";
import ThreadContainer from "./ThreadContainer";

function groupWorkspacesByYear(workspaces) {
  const groupedWorkspaces = workspaces.reduce((acc, item) => {
    const year = new Date(item.createdAt).getFullYear().toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(item);
    return acc;
  }, {});

  // Sort years in descending order
  return Object.keys(groupedWorkspaces)
    .sort((a, b) => b - a)
    .reduce((acc, year) => {
      acc[year] = groupedWorkspaces[year];
      return acc;
    }, {});
}

export default function ActiveWorkspaces() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [groupedWorkspaces, setGroupedWorkspaces] = useState({});
  const [selectedWs, setSelectedWs] = useState(null);
  const [hoverStates, setHoverStates] = useState({});
  const [gearHover, setGearHover] = useState({});
  const [uploadHover, setUploadHover] = useState({});
  const [expandedYears, setExpandedYears] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const { showing, showModal, hideModal } = useManageWorkspaceModal();
  const { user } = useUser();
  const isInWorkspaceSettings = !!useMatch("/workspace/:slug/settings/:tab");

  useEffect(() => {
    async function getWorkspaces() {
      const workspaces = await Workspace.all();
      const groupedWorkspaces = groupWorkspacesByYear(workspaces);
      setLoading(false);
      setGroupedWorkspaces(groupedWorkspaces);
      const initialExpandedState = Object.keys(groupedWorkspaces).reduce(
        (acc, year) => {
          acc[year] = true;
          return acc;
        },
        {}
      );
      setExpandedYears(initialExpandedState);
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

  const toggleYear = useCallback((year) => {
    setExpandedYears((prev) => ({ ...prev, [year]: !prev[year] }));
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredGroupedWorkspaces = Object.entries(groupedWorkspaces).reduce(
    (acc, [year, workspaces]) => {
      const filteredWorkspaces = workspaces.filter((workspace) =>
        workspace.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredWorkspaces.length > 0) {
        acc[year] = filteredWorkspaces;
      }
      return acc;
    },
    {}
  );

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
    <div className="flex flex-col gap-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search workspaces..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 pl-10 border rounded-md bg-gray-700 text-white border-gray-600 focus:outline-none focus:border-blue-500"
        />
        <MagnifyingGlass
          size={20}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
      </div>
      <div
        role="list"
        aria-label="Workspaces"
        className="flex flex-col gap-y-2"
      >
        {Object.keys(filteredGroupedWorkspaces).length === 0 ? (
          <div className="text-white text-center py-4">
            No matching workspaces found.
          </div>
        ) : (
          Object.entries(filteredGroupedWorkspaces).map(
            ([year, workspaces]) => {
              const isExpanded = expandedYears[year];
              return (
                <div
                  key={year}
                  className="flex flex-col w-full gap-y-2"
                  role="listitem"
                >
                  <div
                    className="flex items-center gap-4 text-[14px] leading-loose whitespace-nowrap overflow-hidden text-white cursor-pointer"
                    onClick={() => toggleYear(year)}
                  >
                    <span className="font-medium">{year}</span>
                    <div className="w-5 h-5 text-muted-foreground transition-transform">
                      {isExpanded ? (
                        <CaretDown size={20} />
                      ) : (
                        <CaretRight size={20} />
                      )}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="flex flex-col gap-y-2">
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
                                href={
                                  isActive
                                    ? null
                                    : paths.workspace.chat(workspace.slug)
                                }
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
                                        isActive
                                          ? "text-white "
                                          : "text-zinc-200"
                                      }`}
                                    >
                                      {isActive || isHovered
                                        ? truncate(workspace.name, 15)
                                        : truncate(workspace.name, 20)}
                                    </p>
                                  </div>
                                  {(isActive ||
                                    isHovered ||
                                    gearHover[workspace.id]) &&
                                  user?.role !== "default" ? (
                                    <div className="flex items-center gap-x-[2px]">
                                      <div
                                        className={`flex hover:bg-[#646768] p-[2px] rounded-[4px] text-[#A7A8A9] hover:text-white ${
                                          uploadHover[workspace.id]
                                            ? "bg-[#646768]"
                                            : ""
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
                                            ? paths.workspace.chat(
                                                workspace.slug
                                              )
                                            : paths.workspace.settings.generalAppearance(
                                                workspace.slug
                                              )
                                        }
                                        onMouseEnter={() =>
                                          handleGearMouseEnter(workspace.id)
                                        }
                                        onMouseLeave={() =>
                                          handleGearMouseLeave(workspace.id)
                                        }
                                        className="rounded-md flex items-center justify-center text-[#A7A8A9] hover:text-white ml-auto"
                                        aria-label="General appearance settings"
                                      >
                                        <div className="flex hover:bg-[#646768] p-[2px] rounded-[4px]">
                                          <GearSix
                                            color={
                                              isInWorkspaceSettings &&
                                              workspace.slug === slug
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
                              <ThreadContainer
                                workspace={workspace}
                                isActive={isActive}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
          )
        )}
      </div>
      {showing && (
        <ManageWorkspace
          hideModal={hideModal}
          providedSlug={selectedWs ? selectedWs.slug : null}
        />
      )}
    </div>
  );
}
