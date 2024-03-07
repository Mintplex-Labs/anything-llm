import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { EnvelopeSimple } from "@phosphor-icons/react";
import usePrefersDarkMode from "@/hooks/usePrefersDarkMode";
import Admin from "@/models/admin";
import InviteRow from "./InviteRow";
import NewInviteModal from "./NewInviteModal";
import { useModal } from "@/hooks/useModal";
import ModalWrapper from "@/components/ModalWrapper";

export default function AdminInvites() {
  const { isOpen, openModal, closeModal } = useModal();
  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="transition-all duration-500 relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll border-2 border-outline"
      >
        <div className="flex flex-col w-full px-1 md:px-20 md:py-12 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
            <div className="items-center flex gap-x-4">
              <p className="text-2xl font-semibold text-white">Invitations</p>
              <button
                onClick={openModal}
                className="border border-slate-200 px-4 py-1 rounded-lg text-slate-200 text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800"
              >
                <EnvelopeSimple className="h-4 w-4" /> Create Invite Link
              </button>
            </div>
            <p className="text-sm font-base text-white text-opacity-60">
              Create invitation links for people in your organization to accept
              and sign up with. Invitations can only be used by a single user.
            </p>
          </div>
          <InvitationsContainer />
        </div>
        <ModalWrapper isOpen={isOpen}>
          <NewInviteModal closeModal={closeModal} />
        </ModalWrapper>
      </div>
    </div>
  );
}

function InvitationsContainer() {
  const darkMode = usePrefersDarkMode();
  const [loading, setLoading] = useState(true);
  const [invites, setInvites] = useState([]);
  useEffect(() => {
    async function fetchInvites() {
      const _invites = await Admin.invites();
      setInvites(_invites);
      setLoading(false);
    }
    fetchInvites();
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
    <table className="md:w-3/4 w-full text-sm text-left rounded-lg mt-5">
      <thead className="text-white text-opacity-80 text-sm font-bold uppercase border-white border-b border-opacity-60">
        <tr>
          <th scope="col" className="px-6 py-3">
            Status
          </th>
          <th scope="col" className="px-6 py-3 rounded-tl-lg">
            Accepted By
          </th>
          <th scope="col" className="px-6 py-3">
            Created By
          </th>
          <th scope="col" className="px-6 py-3">
            Created
          </th>
          <th scope="col" className="px-6 py-3 rounded-tr-lg">
            {" "}
          </th>
        </tr>
      </thead>
      <tbody>
        {invites.map((invite) => (
          <InviteRow key={invite.id} invite={invite} />
        ))}
      </tbody>
    </table>
  );
}
