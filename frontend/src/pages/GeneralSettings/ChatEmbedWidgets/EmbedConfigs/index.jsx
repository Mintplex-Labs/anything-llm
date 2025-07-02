import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { CodeBlock } from "@phosphor-icons/react";
import EmbedRow from "./EmbedRow";
import NewEmbedModal from "./NewEmbedModal";
import { useModal } from "@/hooks/useModal";
import ModalWrapper from "@/components/ModalWrapper";
import Embed from "@/models/embed";
import CTAButton from "@/components/lib/CTAButton";

export default function EmbedConfigsView() {
  const { isOpen, openModal, closeModal } = useModal();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [embeds, setEmbeds] = useState([]);

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
        highlightColor="var(--theme-bg-primary)"
        baseColor="var(--theme-bg-secondary)"
        count={1}
        className="w-full p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm"
        containerClassName="flex w-full"
      />
    );
  }

  return (
    <div className="flex flex-col w-full p-4">
      <div className="w-full flex flex-col gap-y-1 pb-6">
        <div className="items-center flex gap-x-4">
          <p className="text-lg leading-6 font-bold text-theme-text-primary">
            {t("embeddable.title")}
          </p>
        </div>

        <div className="flex gap-x-10 mr-8">
          <p className="text-xs leading-[18px] font-base text-theme-text-secondary mt-2">
            {t("embeddable.description")}
          </p>

          <div>
            <CTAButton onClick={openModal} className="text-theme-bg-chat">
              <CodeBlock className="h-4 w-4" weight="bold" />{" "}
              {t("embeddable.create")}
            </CTAButton>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left rounded-lg min-w-[640px] border-spacing-0">
          <thead className="text-theme-text-secondary text-xs leading-[18px] uppercase border-white/10 border-b">
            <tr>
              <th scope="col" className="px-6 py-3">
                {t("embeddable.table.workspace")}
              </th>
              <th scope="col" className="px-6 py-3">
                {t("embeddable.table.chats")}
              </th>
              <th scope="col" className="px-6 py-3">
                {t("embeddable.table.active")}
              </th>
              <th scope="col" className="px-6 py-3">
                {t("embeddable.table.created")}
              </th>
              <th scope="col" className="px-6 py-3">
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
      </div>
      <ModalWrapper isOpen={isOpen}>
        <NewEmbedModal closeModal={closeModal} />
      </ModalWrapper>
    </div>
  );
}
