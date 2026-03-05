import UserButton from "./UserButton";

export default function UserMenu({ children }) {
  return (
    <div className="w-full h-full">
      <UserButton />
      {children}
    </div>
  );
}
