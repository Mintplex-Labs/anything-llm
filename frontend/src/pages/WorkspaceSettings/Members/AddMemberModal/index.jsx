import React, { useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import Admin from "@/models/admin";
import showToast from "@/utils/toast";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalPrimaryButton,
} from "@/components/lib/Modal";

export default function AddMemberModal({ closeModal, workspace, users }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState(workspace?.userIds || []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { success, error } = await Admin.updateUsersInWorkspace(
      workspace.id,
      selectedUsers
    );
    if (success) {
      showToast("Users updated successfully.", "success");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
    showToast(error, "error");
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
      setSelectedUsers(filteredUsers.map((user) => user.id));
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

  const filteredUsers = users
    .filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((user) => user.role !== "admin")
    .filter((user) => user.role !== "manager");

  return (
    <form onSubmit={handleUpdate} className="flex flex-col gap-y-5">
      <ModalHeader title="Users" onClose={closeModal}>
        <div className="relative mt-2 w-full">
          <input
            onChange={handleSearch}
            className="w-full h-[34px] bg-zinc-800 light:bg-white border border-zinc-800 light:border-slate-300 rounded-[100px] text-zinc-100 light:text-slate-900 placeholder:text-zinc-400 light:placeholder:text-slate-400 text-sm px-10 pl-10 outline-none focus:border-sky-500 light:focus:border-sky-500"
            placeholder="Search for a user"
          />
          <MagnifyingGlass
            size={16}
            weight="bold"
            className="text-zinc-400 light:text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2"
          />
        </div>
      </ModalHeader>
      <ModalBody>
        <table className="gap-y-[8px] flex flex-col max-h-[385px] overflow-y-auto no-scroll">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="flex items-center gap-x-2 cursor-pointer"
                onClick={() => handleUserSelect(user.id)}
              >
                <div
                  className="shrink-0 w-3 h-3 rounded border-[1px] border-solid border-white light:border-black flex justify-center items-center"
                  role="checkbox"
                  aria-checked={isUserSelected(user.id)}
                  tabIndex={0}
                >
                  {isUserSelected(user.id) && (
                    <div className="w-2 h-2 bg-white light:bg-black rounded-[2px]" />
                  )}
                </div>
                <p className="text-zinc-100 light:text-slate-900 text-sm font-medium">
                  {user.username}
                </p>
              </tr>
            ))
          ) : (
            <p className="text-zinc-400 light:text-slate-500 text-sm font-medium ">
              No users found
            </p>
          )}
        </table>
      </ModalBody>
      <ModalFooter>
        <div className="flex items-center gap-x-2">
          <button
            type="button"
            onClick={handleSelectAll}
            className="border-none bg-transparent flex items-center gap-x-2"
          >
            <div
              className="shrink-0 w-3 h-3 rounded border-[1px] border-white light:border-black flex justify-center items-center cursor-pointer"
              role="checkbox"
              aria-checked={selectedUsers.length === filteredUsers.length}
              tabIndex={0}
            >
              {selectedUsers.length === filteredUsers.length && (
                <div className="w-2 h-2 bg-white light:bg-black rounded-[2px]" />
              )}
            </div>
            <p className="text-zinc-100 light:text-slate-900 text-sm font-medium">
              Select All
            </p>
          </button>
          {selectedUsers.length > 0 && (
            <button
              type="button"
              onClick={handleUnselect}
              className="border-none bg-transparent flex items-center gap-x-2"
            >
              <p className="text-zinc-400 light:text-slate-500 text-sm font-medium hover:text-zinc-100 light:hover:text-slate-900">
                Unselect
              </p>
            </button>
          )}
        </div>
        <ModalPrimaryButton type="submit">Save</ModalPrimaryButton>
      </ModalFooter>
    </form>
  );
}
