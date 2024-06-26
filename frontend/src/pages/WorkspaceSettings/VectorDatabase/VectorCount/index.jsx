import PreLoader from "@/components/Preloader";
import System from "@/models/system";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function VectorCount({ reload, workspace }) {
  const [totalVectors, setTotalVectors] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchVectorCount() {
      const totalVectors = await System.totalIndexes(workspace.slug);
      setTotalVectors(totalVectors);
    }
    fetchVectorCount();
  }, [workspace?.slug, reload]);

  if (totalVectors === null)
    return (
      <div>
        <h3 className="input-label">{t("general.vector.title")}</h3>
        <p className="text-white text-opacity-60 text-xs font-medium py-1">
          {t("general.vector.description")}
        </p>
        <p className="text-white text-opacity-60 text-sm font-medium">
          <PreLoader size="4" />
        </p>
      </div>
    );
  return (
    <div>
      <h3 className="input-label">{t("general.vector.title")}</h3>
      <p className="text-white text-opacity-60 text-sm font-medium">
        {totalVectors}
      </p>
    </div>
  );
}
