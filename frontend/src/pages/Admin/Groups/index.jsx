import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { BookOpen } from "@phosphor-icons/react";
import Admin from "@/models/admin";
import UserRow from "./UserRow";
// import useUser from "@/hooks/useUser";
import NewGroupModal from "./NewGroupModal";
import { useModal } from "@/hooks/useModal";
import ModalWrapper from "@/components/ModalWrapper";
import CTAButton from "@/components/lib/CTAButton";
// import { SSO_ENABLED } from "@/utils/constants";

export default function AdminGroups() {
  const { isOpen, openModal, closeModal } = useModal();
  // const { user: currUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);

  async function fetchGroups() {
    const _groups = await Admin.getGroups();
    setGroups(_groups);
    setLoading(false);
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex custom-theme-bg-container">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0 custom-theme-bg-secondary"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div
            className="w-full flex flex-col gap-y-1 pb-6 border-white/10 border-b-2 custom-border-secondary"
            style={{ borderTop: 0, borderRight: 0, borderLeft: 0 }}
          >
            <div className="items-center flex gap-x-4">
              <p className="text-lg leading-6 font-bold text-theme-text-primary custom-text-secondary">
                Groups
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-theme-text-secondary custom-text-secondary">
              These are all the groups which have an access to workspaces.
              Removing an group will instantly remove their access to their
              workspaces
            </p>
          </div>
          <div className="w-full justify-end flex">
            <CTAButton
              onClick={openModal}
              className="mt-3 mr-0 z-10 mb-4 md:-mb-6 custom-theme-bg-quad custom-theme-color-quad"
            >
              <BookOpen className="h-4 w-4" weight="bold" /> New Groups
            </CTAButton>
          </div>
          <div className="overflow-x-auto">
            <UsersContainer
              groups={groups}
              loading={loading}
              fetchData={fetchGroups}
            />
          </div>
        </div>
        <ModalWrapper isOpen={isOpen}>
          <NewGroupModal
            closeModal={closeModal}
            fetchData={() => fetchGroups()}
          />
        </ModalWrapper>
      </div>
    </div>
  );
}

function UsersContainer({
  loading = false,
  groups = [],
  fetchData = () => {},
}) {
  if (loading) {
    return (
      <Skeleton.default
        height="80vh"
        width="100%"
        // highlightColor="var(--theme-bg-primary)"
        // baseColor="var(--theme-bg-secondary)"
        count={1}
        className="w-full p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-8"
        containerClassName="flex w-full"
      />
    );
  }

  return (
    <table className="w-full text-sm text-left rounded-lg min-w-[640px] border-spacing-0 custom-primary-table">
      <thead className="text-theme-text-secondary text-xs leading-[18px] font-bold uppercase border-white/10 border-b">
        <tr>
          <th scope="col" className="px-6 py-3 rounded-tl-lg">
            Group Name
          </th>
          <th scope="col" className="px-6 py-3">
            Added By
          </th>
          <th scope="col" className="px-6 py-3">
            Date Added
          </th>
          <th scope="col" className="px-6 py-3 rounded-tr-lg">
            {" "}
          </th>
        </tr>
      </thead>
      <tbody>
        {groups.map((group) => (
          <UserRow key={group.id} group={group} fetchData={fetchData} />
        ))}
      </tbody>
    </table>
  );
}
