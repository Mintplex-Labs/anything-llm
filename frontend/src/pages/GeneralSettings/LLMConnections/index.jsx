import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { PlusCircle } from "@phosphor-icons/react";
import System from "@/models/system";
import ConnectionRow from "./ConnectionRow";
import ConnectionModal from "./ConnectionModal";
import ModalWrapper from "@/components/ModalWrapper";
import { useModal } from "@/hooks/useModal";
import CTAButton from "@/components/lib/CTAButton";
import showToast from "@/utils/toast";

export default function LLMConnections() {
  const {
    isOpen: isCreateModalOpen,
    openModal: openCreateModal,
    closeModal: closeCreateModal,
  } = useModal();
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState([]);
  const [editingConnection, setEditingConnection] = useState(null);

  const fetchConnections = async () => {
    setLoading(true);
    const { connections: foundConnections, error } =
      await System.llmConnections.list({ includeInactive: false });
    if (error) {
      showToast(`Error fetching connections: ${error}`, "error");
    }
    setConnections(foundConnections);
    setLoading(false);
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const handleEdit = (connection) => {
    setEditingConnection(connection);
    openCreateModal();
  };

  const handleCloseModal = () => {
    setEditingConnection(null);
    closeCreateModal();
  };

  const handleDelete = async (id) => {
    const { success, error } = await System.llmConnections.delete(id);
    if (success) {
      showToast("Connection deleted successfully", "success");
      fetchConnections();
    } else {
      showToast(`Error deleting connection: ${error}`, "error");
    }
  };

  const handleSetDefault = async (id) => {
    const { connection, error } = await System.llmConnections.setDefault(id);
    if (connection) {
      showToast("Connection set as default", "success");
      fetchConnections();
    } else {
      showToast(`Error setting default: ${error}`, "error");
    }
  };

  const handleTest = async (id) => {
    const { success, provider, model, error } =
      await System.llmConnections.test(id);
    if (success) {
      showToast(
        `Connection successful! Provider: ${provider}, Model: ${model}`,
        "success"
      );
    } else {
      showToast(`Connection test failed: ${error}`, "error");
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white/10 border-b-2">
            <div className="items-center flex gap-x-4">
              <p className="text-lg leading-6 font-bold text-theme-text-primary">
                LLM Connections
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-theme-text-secondary mt-2">
              Manage multiple connections to LLM providers. Create named
              connections with separate API keys and assign them to different
              workspaces for access control and billing separation.
            </p>
          </div>
          <div className="w-full justify-end flex">
            <CTAButton
              onClick={openCreateModal}
              className="mt-3 mr-0 mb-4 md:-mb-14 z-10"
            >
              <PlusCircle className="h-4 w-4" weight="bold" /> Create
              Connection
            </CTAButton>
          </div>
          <div className="overflow-x-auto mt-6">
            {loading ? (
              <Skeleton.default
                height="80vh"
                width="100%"
                highlightColor="var(--theme-bg-primary)"
                baseColor="var(--theme-bg-secondary)"
                count={1}
                className="w-full p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm"
                containerClassName="flex w-full"
              />
            ) : (
              <table className="w-full text-xs text-left rounded-lg min-w-[640px] border-spacing-0">
                <thead className="text-theme-text-secondary text-xs leading-[18px] font-bold uppercase border-white/10 border-b">
                  <tr>
                    <th scope="col" className="px-6 py-3 rounded-tl-lg">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Provider
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Default
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 rounded-tr-lg">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {connections.length === 0 ? (
                    <tr className="bg-transparent text-theme-text-secondary text-sm font-medium">
                      <td colSpan="5" className="px-6 py-4 text-center">
                        No LLM connections configured. Create one to get
                        started.
                      </td>
                    </tr>
                  ) : (
                    connections.map((connection) => (
                      <ConnectionRow
                        key={connection.id}
                        connection={connection}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onSetDefault={handleSetDefault}
                        onTest={handleTest}
                      />
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <ModalWrapper isOpen={isCreateModalOpen}>
          <ConnectionModal
            connection={editingConnection}
            closeModal={handleCloseModal}
            onSuccess={fetchConnections}
          />
        </ModalWrapper>
      </div>
    </div>
  );
}
