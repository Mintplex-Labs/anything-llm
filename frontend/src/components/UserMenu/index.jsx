import { isMobile } from "react-device-detect";
import UserButton from "./UserButton";

export default function UserMenu({ children }) {
  if (isMobile) return <>{children}</>;
  return (
    <div className="w-auto h-auto">
      <UserButton />

      {children}
    </div>
  );
}
