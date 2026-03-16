import { QRCodeSVG } from "qrcode.react";
import { ArrowSquareOut, TelegramLogo } from "@phosphor-icons/react";
import Logo from "@/media/logo/anything-llm-infinity.png";

const BOTFATHER_URL = "https://t.me/BotFather";

export default function CreateBotSection() {
  const qrSize = 180;
  const logoSize = { width: 35 * 1.2, height: 22 * 1.2 };

  return (
    <div className="flex flex-col gap-y-1">
      <p className="text-sm font-semibold text-theme-text-primary">
        Step 1: Create your Telegram bot
      </p>
      <p className="text-xs text-theme-text-secondary mb-3">
        Open @BotFather in Telegram, send{" "}
        <code className="bg-theme-bg-primary px-1 py-0.5 rounded text-theme-text-primary">
          /newbot
        </code>
        , follow the prompts, and copy the API token.
      </p>
      <div className="flex items-start gap-x-6 flex-wrap gap-y-4">
        <div className="flex flex-col items-center gap-y-2">
          <div className="bg-white/10 rounded-lg p-4 flex items-center justify-center">
            <QRCodeSVG
              value={BOTFATHER_URL}
              size={qrSize}
              bgColor="transparent"
              fgColor="white"
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
          <p className="text-[10px] text-theme-text-secondary text-center">
            Scan to open @BotFather
          </p>
        </div>
        <div className="flex flex-col gap-y-3 pt-2">
          <a
            href={BOTFATHER_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-x-2 text-sm font-medium text-white bg-[#2AABEE] hover:bg-[#229ED9] rounded-lg px-4 py-2.5 w-fit transition-colors duration-200"
          >
            <TelegramLogo className="h-4 w-4" weight="fill" />
            Open BotFather
            <ArrowSquareOut className="h-3.5 w-3.5" />
          </a>
          <div className="flex flex-col gap-y-1.5 text-xs text-theme-text-secondary">
            <p>1. Open the link or scan the QR code</p>
            <p>
              2. Send{" "}
              <code className="bg-theme-bg-primary px-1 py-0.5 rounded text-theme-text-primary">
                /newbot
              </code>{" "}
              to @BotFather
            </p>
            <p>3. Choose a name and username for your bot</p>
            <p>4. Copy the API token you receive</p>
          </div>
        </div>
      </div>
    </div>
  );
}
