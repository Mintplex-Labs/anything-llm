import React, { useState, useEffect } from "react";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { Plus } from "@phosphor-icons/react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import CTAButton from "@/components/lib/CTAButton";
import VariableRow from "./VariableRow";
import ModalWrapper from "@/components/ModalWrapper";
import AddVariableModal from "./AddVariableModal";
import { useModal } from "@/hooks/useModal";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useTranslation } from "react-i18next";

export default function SystemPromptVariables() {
  const { t } = useTranslation();
  const [variables, setVariables] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    fetchVariables();
  }, []);

  const fetchVariables = async () => {
    setLoading(true);
    try {
      const { variables } = await System.promptVariables.getAll();
      setVariables(variables || []);
    } catch (error) {
      console.error("Error fetching variables:", error);
      showToast(t("systemPromptVariables.messages.fetchError"), "error");
    } finally {
      setLoading(false);
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
                {t("systemPromptVariables.title")}
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-theme-text-secondary">
              {t("systemPromptVariables.description")}
            </p>
          </div>

          <div className="w-full justify-end flex">
            <CTAButton
              onClick={openModal}
              className="mt-3 mr-0 mb-4 md:-mb-6 z-10"
            >
              <Plus className="h-4 w-4" weight="bold" />{" "}
              {t("systemPromptVariables.addButton")}
            </CTAButton>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <Skeleton.default
                height="80vh"
                width="100%"
                highlightColor="var(--theme-bg-primary)"
                baseColor="var(--theme-bg-secondary)"
                count={1}
                className="w-full p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-8"
                containerClassName="flex w-full"
              />
            ) : variables.length === 0 ? (
              <div className="text-center py-4 text-theme-text-secondary">
                {t("systemPromptVariables.empty")}
              </div>
            ) : (
              <table className="w-full text-sm text-left rounded-lg min-w-[640px] border-spacing-0">
                <thead className="text-theme-text-secondary text-xs leading-[18px] font-bold uppercase border-white/10 border-b">
                  <tr>
                    <th scope="col" className="px-4 py-2 rounded-tl-lg">
                      {t("systemPromptVariables.table.key")}
                    </th>
                    <th scope="col" className="px-4 py-2">
                      {t("systemPromptVariables.table.value")}
                    </th>
                    <th scope="col" className="px-4 py-2">
                      {t("systemPromptVariables.table.description")}
                    </th>
                    <th scope="col" className="px-4 py-2">
                      {t("systemPromptVariables.table.type")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {variables.map((variable) => (
                    <VariableRow
                      key={variable.id}
                      variable={variable}
                      onRefresh={fetchVariables}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <ModalWrapper isOpen={isOpen}>
        <AddVariableModal closeModal={closeModal} onRefresh={fetchVariables} />
      </ModalWrapper>
    </div>
  );
}
