import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { PlusCircle } from "@phosphor-icons/react";
import Admin from "@/models/admin";
import ApiKeyRow from "./ApiKeyRow";
import NewApiKeyModal from "./NewApiKeyModal";
import paths from "@/utils/paths";
import { userFromStorage } from "@/utils/request";
import System from "@/models/system";
import ModalWrapper from "@/components/ModalWrapper";
import { useModal } from "@/hooks/useModal";
import CTAButton from "@/components/lib/CTAButton";
import { useTranslation } from "react-i18next";

export default function AdminApiKeys() {
  const { isOpen, openModal, closeModal } = useModal();
  const { t } = useTranslation();
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
                {t("api.title")}
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-theme-text-secondary mt-2">
              {t("api.description")}
            </p>
            <a
              href={paths.apiDocs()}
              target="_blank"
              rel="noreferrer"
              className="text-xs leading-[18px] font-base text-blue-300 light:text-blue-500 hover:underline mt-1"
            >
              {t("api.link")} &rarr;
            </a>
          </div>
          <div className="w-full justify-end flex">
            <CTAButton
              onClick={openModal}
              className="mt-3 mr-0 mb-4 md:-mb-14 z-10"
            >
              <PlusCircle className="h-4 w-4" weight="bold" />{" "}
              {t("api.generate")}
            </CTAButton>
          </div>
          <div className="overflow-x-auto mt-6">
            <ApiKeysContainer />
          </div>
        </div>
        <ModalWrapper isOpen={isOpen}>
          <NewApiKeyModal closeModal={closeModal} />
        </ModalWrapper>
      </div>
    </div>
  );
}

function ApiKeysContainer() {
  const [loading, setLoading] = useState(true);
  const [apiKeys, setApiKeys] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchExistingKeys() {
      const user = userFromStorage();
      const Model = !!user ? Admin : System;
      const { apiKeys: foundKeys } = await Model.getApiKeys();
      setApiKeys(foundKeys);
      setLoading(false);
    }
    fetchExistingKeys();
  }, []);

  if (loading) {
    return (
      <Skeleton.default
        height="80vh"
        width="100%"
        highlightColor="var(--theme-bg-primary)"
        baseColor="var(--theme-bg-secondary)"
        count={1}
        className="w-full p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm"
        containerClassName="flex w-full"
      />
    );
  }

  return (
    <table className="w-full text-sm text-left rounded-lg min-w-[640px] border-spacing-0">
      <thead className="text-theme-text-secondary text-xs leading-[18px] font-bold uppercase border-white/10 border-b">
        <tr>
          <th scope="col" className="px-6 py-3 rounded-tl-lg">
            {t("api.table.key")}
          </th>
          <th scope="col" className="px-6 py-3">
            {t("api.table.by")}
          </th>
          <th scope="col" className="px-6 py-3">
            {t("api.table.created")}
          </th>
          <th scope="col" className="px-6 py-3 rounded-tr-lg">
            {" "}
          </th>
        </tr>
      </thead>
      <tbody>
        {apiKeys.map((apiKey) => (
          <ApiKeyRow key={apiKey.id} apiKey={apiKey} />
        ))}
      </tbody>
    </table>
  );
}
