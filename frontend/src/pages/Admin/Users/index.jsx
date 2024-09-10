import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { UserPlus } from "@phosphor-icons/react";
import Admin from "@/models/admin";
import UserRow from "./UserRow";
import useUser from "@/hooks/useUser";
import NewUserModal from "./NewUserModal";
import { useModal } from "@/hooks/useModal";
import ModalWrapper from "@/components/ModalWrapper";
import CTAButton from "@/components/lib/CTAButton";
import { useTranslation } from "react-i18next"; // i18n import 추가

export default function AdminUsers() {
  const { isOpen, openModal, closeModal } = useModal();
  const { t } = useTranslation();

  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
            <div className="items-center flex gap-x-4">
              <p className="text-lg leading-6 font-bold text-white">
                {t("adminUsers.title")}
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
              {t("adminUsers.description")}
            </p>
          </div>
          <div className="w-full justify-end flex">
            <CTAButton onClick={openModal} className="mt-3 mr-0 -mb-6 z-10">
              <UserPlus className="h-4 w-4" weight="bold" />{" "}
              {t("adminUsers.addUser")}
            </CTAButton>
          </div>
          <UsersContainer />
        </div>
        <ModalWrapper isOpen={isOpen}>
          <NewUserModal closeModal={closeModal} />
        </ModalWrapper>
      </div>
    </div>
  );
}

function UsersContainer() {
  const { user: currUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchUsers() {
      const _users = await Admin.users();
      setUsers(_users);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <Skeleton.default
        height="80vh"
        width="100%"
        highlightColor="#3D4147"
        baseColor="#2C2F35"
        count={1}
        className="w-full p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6"
        containerClassName="flex w-full"
      />
    );
  }

  return (
    <table className="w-full text-sm text-left rounded-lg">
      <thead className="text-white text-opacity-80 text-xs leading-[18px] font-bold uppercase border-white border-b border-opacity-60">
        <tr>
          <th scope="col" className="px-6 py-3 rounded-tl-lg">
            {t("adminUsers.username")}
          </th>
          <th scope="col" className="px-6 py-3">
            {t("adminUsers.role")}
          </th>
          <th scope="col" className="px-6 py-3">
            {t("adminUsers.dateAdded")}
          </th>
          <th scope="col" className="px-6 py-3 rounded-tr-lg">
            {" "}
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <UserRow key={user.id} currUser={currUser} user={user} />
        ))}
      </tbody>
    </table>
  );
}

const ROLE_HINT = {
  default: [
    "Can only send chats with workspaces they are added to by admin or managers.",
    "Cannot modify any settings at all.",
  ],
  manager: [
    "Can view, create, and delete any workspaces and modify workspace-specific settings.",
    "Can create, update and invite new users to the instance.",
    "Cannot modify LLM, vectorDB, embedding, or other connections.",
  ],
  admin: [
    "Highest user level privilege.",
    "Can see and do everything across the system.",
  ],
};

export function RoleHintDisplay({ role }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-y-1 py-1 pb-4">
      <p className="text-sm font-medium text-white">
        {t("adminUsers.permissionsTitle")}
      </p>
      <ul className="flex flex-col gap-y-1 list-disc px-4">
        {ROLE_HINT[role ?? "default"].map((hints, i) => {
          return (
            <li key={i} className="text-xs text-white/60">
              {t(`adminUsers.roleHint.${role}.${i}`)}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
