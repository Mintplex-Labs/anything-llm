import React from "react";
import usePfp from "../../hooks/usePfp";
import WorkspaceDefault from "./workspace.png";

export default function UserIcon({ user, role }) {
  const { pfp } = usePfp();

  if (role === "user") {
    if (!pfp) {
      return (
        <div className="relative w-[36px] h-[36px] rounded-full flex-shrink-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full object-cover rounded-full flex items-center justify-center bg-[#2DF4D0] text-black text-lg font-semibold">
            <p className="p-0 !m-0">{user?.username?.slice(0, 2) || "U"}</p>
          </div>
        </div>
      );
    }
    return (
      <div className="relative w-[36px] h-[36px] rounded-full flex-shrink-0 overflow-hidden">
        <img
          src={pfp}
          width={36}
          height={36}
          alt="User profile picture"
          className={`absolute top-0 left-0 w-full h-full object-cover rounded-full ${
            !!pfp ? "" : "border border-white/40"
          }`}
        />
      </div>
    );
  }

  return (
    <div className="relative w-[36px] h-[36px] rounded-full flex-shrink-0 overflow-hidden">
      <img
        src={pfp ?? WorkspaceDefault}
        alt="User profile picture"
        className={`absolute top-0 left-0 w-full h-full object-cover rounded-full ${
          !!pfp ? "" : "border border-white/40"
        }`}
      />
    </div>
  );
}
