import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { CodeBlock } from "@phosphor-icons/react";
import EmbedRow from "./EmbedRow";
import NewEmbedModal from "./NewEmbedModal";
import { useModal } from "@/hooks/useModal";
import ModalWrapper from "@/components/ModalWrapper";
import Embed from "@/models/embed";
import CTAButton from "@/components/lib/CTAButton";

export default function EmbedConfigs() {
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
                {t("embeddable.title")}
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
              {t("embeddable.description")}
            </p>
          </div>
          <div className="w-full justify-end flex">
            <CTAButton onClick={openModal} className="mt-3 mr-0 -mb-14 z-10">
              <CodeBlock className="h-4 w-4" weight="bold" />{" "}
              {t("embeddable.create")}
            </CTAButton>
          </div>
          <EmbedContainer />
        </div>
        <ModalWrapper isOpen={isOpen}>
          <NewEmbedModal closeModal={closeModal} />
        </ModalWrapper>
      </div>
    </div>
  );
}

function EmbedContainer() {
  const [loading, setLoading] = useState(true);
  const [embeds, setEmbeds] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchUsers() {
      const _embeds = await Embed.embeds();
      setEmbeds(_embeds);
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
    <table className="w-full text-sm text-left rounded-lg mt-6">
      <thead className="text-white text-opacity-80 text-xs leading-[18px] font-bold uppercase border-white border-b border-opacity-60">
        <tr>
          <th scope="col" className="px-6 py-3 rounded-tl-lg">
            {t("embeddable.table.workspace")}
          </th>
          <th scope="col" className="px-6 py-3">
            {t("embeddable.table.chats")}
          </th>
          <th scope="col" className="px-6 py-3">
            {t("embeddable.table.Active")}
          </th>
          <th scope="col" className="px-6 py-3 rounded-tr-lg">
            {" "}
          </th>
        </tr>
      </thead>
      <tbody>
        {embeds.map((embed) => (
          <EmbedRow key={embed.id} embed={embed} />
        ))}
      </tbody>
    </table>
  );
}
