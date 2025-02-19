import ModalWrapper from "@/components/ModalWrapper";
import { useModal } from "@/hooks/useModal";
import Admin from "@/models/admin";
import { useEffect, useState } from "react";
import * as Skeleton from "react-loading-skeleton";
import ManageGroupModal from "./ManageGroupModal";
import GroupMemberRow from "./GroupMemberRow";
import CTAButton from "@/components/lib/CTAButton";

export default function Groups() {
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const { isOpen, openModal, closeModal } = useModal();

  async function fetchGroups() {
    const _groups = await Admin.getGroups();
    setGroups(_groups);
    setLoading(false);
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  if (loading) {
    return (
      <Skeleton.default
        height="80vh"
        width="100%"
        // highlightColor="var(--theme-bg-primary)"
        // baseColor="var(--theme-bg-secondary)"
        count={1}
        className="w-full p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6"
        containerClassName="flex w-full"
      />
    );
  }

  return (
    <div className="flex justify-between -mt-3">
      <table className="w-full max-w-[700px] text-sm text-left rounded-lg custom-primary-table">
        <thead className="text-white text-opacity-80 text-xs leading-[18px] font-bold uppercase border-white/10 border-b border-opacity-60">
          <tr>
            <th scope="col" className="px-6 py-3 rounded-tl-lg">
              Group Name
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
          {groups.length > 0 ? (
            groups.map((group, index) => (
              <GroupMemberRow key={index} group={group} />
            ))
          ) : (
            <tr>
              <td className="text-center py-4 text-white/80" colSpan="4">
                No groups found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <CTAButton onClick={openModal}>Manage Groups</CTAButton>
      <ModalWrapper isOpen={isOpen}>
        <ManageGroupModal closeModal={closeModal} groups={groups} />
      </ModalWrapper>
    </div>
  );
}
