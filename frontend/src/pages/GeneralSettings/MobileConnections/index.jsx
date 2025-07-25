import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { QrCode } from "@phosphor-icons/react";
import { useModal } from "@/hooks/useModal";
import CTAButton from "@/components/lib/CTAButton";
import MobileConnection from "@/models/mobile";
import ConnectionModal from "./ConnectionModal";
import DeviceRow from "./DeviceRow";
import { isMobile } from "react-device-detect";

export default function MobileDevices() {
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);

  const fetchDevices = async () => {
    const foundDevices = await MobileConnection.getDevices();
    setDevices(foundDevices);
    if (foundDevices.length !== 0 && !isOpen) closeModal();
    return foundDevices;
  };

  useEffect(() => {
    fetchDevices()
      .then((devices) => {
        if (devices.length === 0) openModal();
        return devices;
      })
      .finally(() => {
        setLoading(false);
      });

    const interval = setInterval(fetchDevices, 5_000);
    return () => clearInterval(interval);
  }, []);

  const removeDevice = (id) => {
    setDevices((prevDevices) =>
      prevDevices.filter((device) => device.id !== id)
    );
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex md:mt-0 mt-6">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white/10 border-b-2">
            <div className="items-center flex gap-x-4">
              <p className="text-lg leading-6 font-bold text-theme-text-primary">
                Connected Mobile Devices
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-theme-text-secondary mt-2">
              These are the devices that are connected to your desktop
              application to sync chats, workspaces, and more.
            </p>
          </div>
          <div className="w-full justify-end flex">
            <CTAButton
              onClick={openModal}
              className="mt-3 mr-0 mb-4 md:-mb-14 z-10"
            >
              <QrCode className="h-4 w-4" weight="bold" /> Register New Device
            </CTAButton>
          </div>
          <div className="overflow-x-auto mt-6">
            {loading ? (
              <Skeleton.default
                height="80vh"
                width="100%"
                highlightColor="var(--theme-bg-primary)"
                baseColor="var(--theme-bg-secondary)"
                count={1}
                className="w-full p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm"
                containerClassName="flex w-full"
              />
            ) : (
              <table className="w-full text-xs text-left rounded-lg min-w-[640px] border-spacing-0">
                <thead className="text-theme-text-secondary text-xs leading-[18px] font-bold uppercase border-white/10 border-b">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Device Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Registered
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {" "}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {devices.length === 0 ? (
                    <tr className="bg-transparent text-theme-text-secondary text-sm font-medium">
                      <td colSpan="4" className="px-6 py-4 text-center">
                        No devices found
                      </td>
                    </tr>
                  ) : (
                    devices.map((device) => (
                      <DeviceRow
                        key={device.id}
                        device={device}
                        removeDevice={removeDevice}
                      />
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <ConnectionModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
}
