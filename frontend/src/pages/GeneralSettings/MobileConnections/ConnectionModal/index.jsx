import { X } from "@phosphor-icons/react";
import ModalWrapper from "@/components/ModalWrapper";
import BG from "./bg.png";
import { QRCodeSVG } from "qrcode.react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import MobileConnection from "@/models/mobile";
import PreLoader from "@/components/Preloader";
import Logo from "@/media/logo/anything-llm-infinity.png";
import paths from "@/utils/paths";

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
                to={paths.documentation.mobileIntroduction()}
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

/**
 * Process the connection url to make it absolute if it is a relative path
 * @param {string} url
 * @returns {string}
 */
function processConnectionUrl(url) {
  /*
   * In dev mode, the connectionURL() method uses the `ip` module
   * see server/models/mobileDevice.js `connectionURL()` method.
   *
   * In prod mode, this method returns the absolute path since we will always want to use
   * the real instance hostname. If the domain changes, we should be able to inherit it from the client side
   * since the backend has no knowledge of the domain since typically it is run behind a reverse proxy or in a container - or both.
   * So `ip` is useless in prod mode since it would only resolve to the internal IP address of the container or if non-containerized,
   * the local IP address may not be the preferred instance access point (eg: using custom domain)
   *
   * If the url does not start with http, we assume it is a relative path and add the origin to it.
   * Then we check if the hostname is localhost, 127.0.0.1, or 0.0.0.0. If it is, we throw an error since that is not
   * a LAN resolvable address that other devices can use to connect to the instance.
   */
  if (url.startsWith("http")) return new URL(url);
  const connectionUrl = new URL(`${window.location.origin}${url}`);
  if (["localhost", "127.0.0.1", "0.0.0.0"].includes(connectionUrl.hostname))
    throw new Error(
      "Please open this page via your machines private IP address or custom domain. Localhost URLs will not work with the mobile app."
    );
  return connectionUrl.toString();
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
        const url = processConnectionUrl(res.connectionUrl);
        setConnectionInfo(url);
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
