import React, { useState } from "react";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
// import Admin from "@/models/admin";
// import showToast from "@/utils/toast";

export default function AddMemberModal({ closeModal, groups = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    // const { success, error } = await Admin.updateUsersInWorkspace(
    //   workspace.id,
    //   selectedUsers
    // );
    // if (success) {
    //   showToast("Users updated successfully.", "success");
    //   setTimeout(() => {
    //     window.location.reload();
    //   }, 1000);
    // }
    // showToast(error, "error");
  };

  const handleUserSelect = (userId) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(userId)) {
        return prevSelectedUsers.filter((id) => id !== userId);
      } else {
        return [...prevSelectedUsers, userId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((group) => group.id));
    }
  };

  const handleUnselect = () => {
    setSelectedUsers([]);
  };

  const isUserSelected = (userId) => {
    return selectedUsers.includes(userId);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = groups?.filter((group) =>
    group?.groupname?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  return (
    <div className="relative w-full max-w-[550px] max-h-full">
      <div className="w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border overflow-hidden custom-theme-bg-tertiary">
        <div className="flex items-center justify-between p-6 border-b rounded-t border-theme-modal-border">
          <div className="flex items-center gap-x-4">
            <h3 className="text-base font-semibold text-white custom-text-secondary">
              Groups
            </h3>
            <div className="relative">
              <input
                onChange={handleSearch}
                className="w-[400px] h-[34px] bg-theme-bg-primary rounded-[100px] text-white text-sm px-10 pl-10 custom-theme-bg-tertiary custom-text-secondary custom-border-secondary"
                placeholder="Search group"
              />
              <MagnifyingGlass
                size={16}
                weight="bold"
                className="text-white text-lg absolute left-3 top-1/2 transform -translate-y-1/2 custom-text-secondary"
              />
            </div>
          </div>
          <button
            onClick={closeModal}
            type="button"
            className="border-none bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center bg-sidebar-button hover:border-opacity-50 border-transparent border"
          >
            <X className="text-white text-lg custom-text-secondary" />
          </button>
        </div>
        <form onSubmit={handleUpdate}>
          <div className="py-[17px] px-[20px]">
            <table className="gap-y-[8px] flex flex-col max-h-[385px] overflow-y-auto no-scroll">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((group) => (
                  <tr
                    key={group.id}
                    className="flex items-center gap-x-2 cursor-pointer"
                    onClick={() => handleUserSelect(group.id)}
                  >
                    <div
                      className="shrink-0 w-3 h-3 rounded border-[1px] border-solid border-white light:border-black flex justify-center items-center custom-border-secondary"
                      role="checkbox"
                      aria-checked={isUserSelected(group.id)}
                      tabIndex={0}
                    >
                      {isUserSelected(group.id) && (
                        <div className="w-2 h-2 bg-white light:bg-black rounded-[2px] custom-theme-bg-quad" />
                      )}
                    </div>
                    <p className="text-theme-text-primary text-sm font-medium custom-text-secondary">
                      {group?.groupname}
                    </p>
                  </tr>
                ))
              ) : (
                <p className="text-theme-text-secondary text-sm font-medium custom-text-secondary">
                  No groups found
                </p>
              )}
            </table>
          </div>
          <div className="flex w-full justify-between items-center p-3 space-x-2 border-t rounded-b border-gray-500/50">
            <div className="flex items-center gap-x-2">
              <button
                type="button"
                onClick={handleSelectAll}
                className="flex items-center gap-x-2 ml-2"
              >
                <div
                  className="shrink-0 w-3 h-3 rounded border-[1px] border-white flex justify-center items-center cursor-pointer custom-border-secondary"
                  role="checkbox"
                  aria-checked={selectedUsers.length === filteredUsers.length}
                  tabIndex={0}
                >
                  {selectedUsers.length === filteredUsers.length && (
                    <div className="w-2 h-2 bg-white rounded-[2px] custom-theme-bg-quad" />
                  )}
                </div>
                <p className="text-white text-sm font-medium custom-text-secondary">
                  Select All
                </p>
              </button>
              {selectedUsers.length > 0 && (
                <button
                  type="button"
                  onClick={handleUnselect}
                  className="flex items-center gap-x-2 ml-2"
                >
                  <p className="text-theme-text-secondary text-sm font-medium hover:text-theme-text-primary custom-text-secondary">
                    Unselect
                  </p>
                </button>
              )}
            </div>
            <button
              type="submit"
              className="transition-all duration-300 text-xs px-2 py-1 font-semibold rounded-lg bg-primary-button border-2 border-transparent h-[32px] w-[68px] -mr-8 whitespace-nowrap shadow-[0_4px_14px_rgba(0,0,0,0.25)] custom-theme-bg-quad custom-theme-color-quad"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
