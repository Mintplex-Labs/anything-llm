import React, { memo } from "react";
import usePfp from "../../hooks/usePfp";
import UserDefaultPfp from "./user.svg?react";
import WorkspaceDefaultPfp from "./workspace.svg?react";

const UserIcon = memo(({ role }) => {
  const { pfp } = usePfp();

  return (
    <div className="relative w-[35px] h-[35px] rounded-full flex-shrink-0 overflow-hidden">
      {role === "user" && <RenderUserPfp pfp={pfp} />}
      {role !== "user" && (
        <WorkspaceDefaultPfp className="flex items-center justify-center rounded-full border-solid border border-white/40 light:border-theme-sidebar-border light:bg-theme-bg-chat-input" />
      )}
    </div>
  );
});

function RenderUserPfp({ pfp }) {
  if (!pfp) return <UserDefaultPfp className="rounded-full border-none" />;

  return (
    <img
      src={pfp}
      alt="User profile picture"
      className="absolute top-0 left-0 w-full h-full object-cover rounded-full border-none"
    />
  );
}

export default UserIcon;
