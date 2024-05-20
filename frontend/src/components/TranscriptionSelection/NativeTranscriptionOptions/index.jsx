import { Gauge } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

export default function NativeTranscriptionOptions() {
  const { t } = useTranslation();
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-x-2 text-white mb-4 bg-blue-800/30 w-fit rounded-lg px-4 py-2">
        <div className="gap-x-2 flex items-center">
          <Gauge size={25} />
          <p className="text-sm">
            {t("transcription.warn-start")}
            <br />
            {t("transcription.warn-recommend")}
            <br />
            <br />
            <i>
              {t("transcription.warn-end")}
            </i>
          </p>
        </div>
      </div>
      <div className="w-full flex items-center gap-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            {t("common.selection")}
          </label>
          <select
            disabled={true}
            className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
          >
            <option disabled={true} selected={true}>
              Xenova/whisper-small
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}
