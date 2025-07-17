import { X } from "@phosphor-icons/react";
import ModalWrapper from "@/components/ModalWrapper";
import BG from "./bg.png";
import { QRCodeSVG } from "qrcode.react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import MobileConnection from "@/models/mobile";
import PreLoader from "@/components/Preloader";
import Logo from "@/assets/logo/anything-llm-infinity.png";

export default function MobileConnectModal({ isOpen, onClose }) {
  return (
    <ModalWrapper isOpen={isOpen}>
      <div
        className="relative w-full rounded-lg shadow"
        style={{
          minHeight: "60vh",
          maxWidth: "70vw",
          backgroundImage: `url(${BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1 inline-flex items-center hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border"
        >
          <X size={24} weight="bold" className="text-[#FFF]" />
        </button>

        <div className="flex w-full h-full justify-between p-[35px]">
          {/* left column */}
          <div className="flex flex-col w-1/2 gap-y-[16px]">
            <p className="text-[#FFF] text-xl font-bold">
              Go mobile. Stay local. AnythingLLM Mobile.
            </p>
            <p className="text-[#FFF] text-lg">
              AnythingLLM for mobile allows you to connect or clone your
              workspace's chats, threads and documents for you to use on the go.
              <br />
              <br />
              Run with local models on your phone privately or relay chats
              directly to this instance seamlessly.
            </p>
          </div>

          {/* right column */}
          <div className="flex flex-col items-center justify-center shrink-0 w-1/2 gap-y-[16px]">
            <div className="bg-white/10 rounded-lg p-[40px] w-[300px] h-[300px] flex flex-col gap-y-[16px] items-center justify-center">
              <ConnectionQrCode isOpen={isOpen} />
            </div>
            <p className="text-[#FFF] text-sm w-[300px] text-center">
              Scan the QR code with the AnythingLLM Mobile app to enable live
              sync of your workspaces, chats, threads and documents.
              <br />
              <Link
                to="https://docs.anythingllm.com/mobile"
                className="text-cta-button font-semibold"
              >
                Learn more
              </Link>
            </p>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}

const ConnectionQrCode = ({ isOpen }) => {
  const [connectionInfo, setConnectionInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);
    MobileConnection.getConnectionInfo()
      .then((res) => {
        if (res.error) throw new Error(res.error);
        setConnectionInfo(res.connectionUrl);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isOpen]);

  if (isLoading) return <PreLoader size="[100px]" />;
  if (error)
    return (
      <p className="text-red-500 text-sm w-[300px] p-4 text-center">{error}</p>
    );

  const size = {
    width: 35 * 1.5,
    height: 22 * 1.5,
  };
  return (
    <QRCodeSVG
      value={connectionInfo}
      size={300}
      bgColor="transparent"
      fgColor="white"
      level="L"
      imageSettings={{
        src: Logo,
        x: 300 / 2 - size.width / 2,
        y: 300 / 2 - size.height / 2,
        height: size.height,
        width: size.width,
        excavate: true,
      }}
    />
  );
};
