import UserButton from "./UserButton";

export default function UserMenu({ children }) {
  return (
    <div className="w-auto h-auto">
      <UserButton />
      {children}
    </div>
  );
}
