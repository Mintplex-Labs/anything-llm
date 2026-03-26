import { QRCodeSVG } from "qrcode.react";
import { ShieldCheck, TelegramLogo } from "@phosphor-icons/react";
import Logo from "@/media/logo/anything-llm-infinity.png";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const BOTFATHER_URL = "https://t.me/BotFather";

export default function CreateBotSection() {
  const { t } = useTranslation();
  const qrSize = 180;
  const logoSize = { width: 35 * 1.2, height: 22 * 1.2 };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-1">
        <p className="text-sm font-semibold text-theme-text-primary">
          {t("telegram.setup.step1.title")}
        </p>
        <p className="text-xs text-theme-text-secondary mb-3">
          <Trans
            i18nKey="telegram.setup.step1.description"
            components={{
              code: (
                <code className="bg-theme-bg-primary px-1 py-0.5 rounded text-theme-text-primary" />
              ),
            }}
          />
        </p>
        <div className="flex items-start gap-x-6 flex-wrap gap-y-4">
          <div className="flex flex-col items-center gap-y-2">
            <div className="bg-white/10 light:bg-black/5 rounded-lg p-4 flex items-center justify-center">
              <QRCodeSVG
                value={BOTFATHER_URL}
                size={qrSize}
                bgColor="transparent"
                fgColor="currentColor"
                className="text-white light:text-black light:[&_image]:invert"
                level="L"
                imageSettings={{
                  src: Logo,
                  x: qrSize / 2 - logoSize.width / 2,
                  y: qrSize / 2 - logoSize.height / 2,
                  height: logoSize.height,
                  width: logoSize.width,
                  excavate: true,
                }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-y-3 pt-2">
            <Link
              to={BOTFATHER_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-x-2 text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 rounded-lg px-4 py-2.5 w-fit transition-colors duration-200"
            >
              <TelegramLogo className="h-4 w-4" weight="fill" />
              {t("telegram.setup.step1.open-botfather")}
            </Link>
            <div className="flex flex-col gap-y-1.5 text-xs text-theme-text-secondary">
              <p>{t("telegram.setup.step1.instruction-1")}</p>
              <p>
                <Trans
                  i18nKey="telegram.setup.step1.instruction-2"
                  components={{
                    code: (
                      <code className="bg-theme-bg-primary px-1 py-0.5 rounded text-theme-text-primary" />
                    ),
                  }}
                />
              </p>
              <p>{t("telegram.setup.step1.instruction-3")}</p>
              <p>{t("telegram.setup.step1.instruction-4")}</p>
            </div>
          </div>
        </div>
      </div>
      <SecurityTips />
    </div>
  );
}

function SecurityTips() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-y-2 p-3 rounded-lg bg-theme-bg-primary border border-theme-sidebar-border">
      <div className="flex items-center gap-x-2">
        <ShieldCheck
          className="h-4 w-4 text-theme-text-secondary"
          weight="bold"
        />
        <p className="text-xs font-semibold text-theme-text-primary">
          {t("telegram.setup.security.title")}
        </p>
      </div>
      <p className="text-xs text-theme-text-secondary">
        {t("telegram.setup.security.description")}
      </p>
      <ul className="text-xs text-theme-text-secondary list-disc list-inside space-y-1 ml-1">
        <li>
          <code className="bg-theme-bg-secondary px-1 py-0.5 rounded text-theme-text-primary">
            Disable Groups
          </code>{" "}
          {t("telegram.setup.security.disable-groups")}
        </li>
        <li>
          <code className="bg-theme-bg-secondary px-1 py-0.5 rounded text-theme-text-primary">
            Disable Inline
          </code>{" "}
          {t("telegram.setup.security.disable-inline")}
        </li>
        <li>{t("telegram.setup.security.obscure-username")}</li>
      </ul>
    </div>
  );
}
