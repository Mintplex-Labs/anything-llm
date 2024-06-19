import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import PreLoader from "@/components/Preloader";
import ModalWrapper from "@/components/ModalWrapper";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import LiveSyncToggle from "./Features/LiveSync/toggle";
import Admin from "@/models/admin";

export default function ExperimentalFeatures() {
  const [featureFlags, setFeatureFlags] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      const { settings } = await Admin.systemPreferences();
      setFeatureFlags(settings?.feature_flags ?? {});
      setLoading(false);
    }
    fetchSettings();
  }, []);

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
                Experimental Features
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
              Enable and access experimental features of AnythingLLM. Features
              here may change, move, or no longer exist at any time and support
              for them is not guaranteed. While a feature is in preview it can
              only be managed via this page.
            </p>
          </div>
          {loading ? (
            <div className="h-1/2 transition-all duration-500 relative md:ml-[2px] md:mr-[8px] md:my-[16px] md:rounded-[26px] p-[18px] h-full overflow-y-scroll">
              <div className="w-full h-full flex justify-center items-center">
                <PreLoader />
              </div>
            </div>
          ) : (
            <FeatureVerification>
              <LiveSyncToggle
                enabled={featureFlags?.experimental_live_file_sync}
              />
            </FeatureVerification>
          )}
        </div>
      </div>
    </div>
  );
}

function FeatureVerification({ children }) {
  if (
    !window.localStorage.getItem("anythingllm_tos_experimental_feature_set")
  ) {
    function acceptTos(e) {
      e.preventDefault();

      window.localStorage.setItem(
        "anythingllm_tos_experimental_feature_set",
        "accepted"
      );
      showToast(
        "Experimental Feature set enabled. Reloading the page.",
        "success"
      );
      setTimeout(() => {
        window.location.reload();
      }, 2_500);
      return;
    }

    return (
      <>
        <ModalWrapper isOpen={true}>
          <form
            onSubmit={acceptTos}
            className="relative w-full max-w-2xl max-h-full"
          >
            <div className="relative bg-main-gradient rounded-lg shadow">
              <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-500/50">
                <h3 className="text-xl font-semibold text-white">
                  Terms of use for experimental features
                </h3>
              </div>
              <div className="p-6 space-y-6 flex h-full w-full">
                <div className="w-full flex flex-col gap-y-4 text-white">
                  <p>
                    Experimental features of AnythingLLM are features that we
                    are piloting and are <b>opt-in</b>. We proactively will
                    condition or warn you on any potential concerns should any
                    exist prior to approval of any feature.
                  </p>

                  <div>
                    <p>
                      Use of any feature on this page can result in, but not
                      limited to, the following possibilities.
                    </p>
                    <ul className="list-disc ml-6 text-sm font-mono">
                      <li>Loss of data.</li>
                      <li>Change in quality of results.</li>
                      <li>Increased storage.</li>
                      <li>Increased resource consumption.</li>
                      <li>
                        Increased cost or use of any connected LLM or embedding
                        provider.
                      </li>
                      <li>Potential bugs or issues using AnythingLLM.</li>
                    </ul>
                  </div>

                  <div>
                    <p>
                      Use of an experimental feature also comes with the
                      following list of non-exhaustive conditions.
                    </p>
                    <ul className="list-disc ml-6 text-sm font-mono">
                      <li>Feature may not exist in future updates.</li>
                      <li>The feature being used is not currently stable.</li>
                      <li>
                        The feature may not be available in future versions,
                        configurations, or subscriptions of AnythingLLM.
                      </li>
                      <li>
                        Your privacy settings <b>will be honored</b> with use of
                        any beta feature.
                      </li>
                      <li>These conditions may change in future updates.</li>
                    </ul>
                  </div>

                  <p>
                    Access to any features requires approval of this modal. If
                    you would like to read more you can refer to{" "}
                    <a
                      href="https://docs.useanything.com/beta-features"
                      className="underline text-blue-500"
                    >
                      docs.useanything.com
                    </a>{" "}
                    or email{" "}
                    <a
                      href="mailto:team@mintplexlabs.com"
                      className="underline text-blue-500"
                    >
                      team@mintplexlabs.com
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex w-full justify-between items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
                <a
                  href={paths.home()}
                  className="px-4 py-2 rounded-lg text-white hover:bg-stone-900 transition-all duration-300"
                >
                  Reject & Close
                </a>
                <button
                  type="submit"
                  className="transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
                >
                  I understand
                </button>
              </div>
            </div>
          </form>
        </ModalWrapper>
        {children}
      </>
    );
  }
  return <>{children}</>;
}
