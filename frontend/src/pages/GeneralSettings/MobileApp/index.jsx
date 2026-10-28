import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import Sidebar from "@/components/SettingsSidebar";
import MobileConnection from "@/models/mobile";
import PreLoader from "@/components/Preloader";
import { isMobile } from "react-device-detect";

export default function MobileApp() {
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    let mounted = true;
    MobileConnection.getMyConnectionInfo().then((result) => {
      if (!mounted) return;
      try {
        if (!result || result.error || !result.connectionUrl)
          throw new Error(result?.error || "Could not generate a pairing QR code.");
        const connectionUrl = result.connectionUrl.startsWith("http")
          ? result.connectionUrl
          : new URL(result.connectionUrl, window.location.origin).toString();
        const parsed = new URL(connectionUrl);
        if (["localhost", "127.0.0.1", "0.0.0.0"].includes(parsed.hostname))
          throw new Error("Open this page using the server's reachable hostname or IP address before pairing your phone.");
        setUrl(connectionUrl);
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    });
    return () => { mounted = false; };
  }, []);
  return <div className="w-screen h-screen overflow-hidden bg-zinc-950 light:bg-slate-50 flex">
    <Sidebar />
    <main style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }} className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-zinc-900 light:bg-white w-full h-full overflow-y-auto p-6 md:p-10">
      <section className="max-w-2xl mx-auto flex flex-col items-center gap-5 text-center pt-10">
        <h1 className="text-xl font-bold text-theme-text-primary">Connect AnythingLLM Mobile</h1>
        <p className="text-sm text-theme-text-secondary">Scan this QR code in the AnythingLLM Mobile app to register a device for your account. New devices still require approval by an administrator.</p>
        {loading ? <PreLoader /> : error ? <p className="text-sm text-red-500">{error}</p> : url ? <div className="bg-white rounded-xl p-5"><QRCodeSVG value={url} size={280} level="L" /></div> : null}
      </section>
    </main>
  </div>;
}
