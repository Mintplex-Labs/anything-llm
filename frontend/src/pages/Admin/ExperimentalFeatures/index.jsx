import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import Admin from "@/models/admin";
import { FullScreenLoader } from "@/components/Preloader";
import { CaretRight, Flask } from "@phosphor-icons/react";
import { configurableFeatures } from "./features";
import ModalWrapper from "@/components/ModalWrapper";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";

export default function ExperimentalFeatures() {
  const [featureFlags, setFeatureFlags] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState(
    "experimental_live_file_sync"
  );

  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      const { settings } = await Admin.systemPreferences();
      setFeatureFlags(settings?.feature_flags ?? {});
      setLoading(false);
    }
    fetchSettings();
  }, []);

  const refresh = async () => {
    const { settings } = await Admin.systemPreferences();
    setFeatureFlags(settings?.feature_flags ?? {});
  };

  if (loading) {
    return (
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] w-full h-full flex justify-center items-center"
      >
        <FullScreenLoader />
      </div>
    );
  }

  return (
    <FeatureLayout>
      <div className="flex-1 flex gap-x-6 p-4 mt-10">
        {/* Feature settings nav */}
        <div className="flex flex-col gap-y-[18px]">
          <div className="text-white flex items-center gap-x-2">
            <Flask size={24} />
            <p className="text-lg font-medium">Experimental Features</p>
          </div>
          {/* Feature list */}
          <FeatureList
            features={configurableFeatures}
            selectedFeature={selectedFeature}
            handleClick={setSelectedFeature}
            activeFeatures={Object.keys(featureFlags).filter(
              (flag) => featureFlags[flag]
            )}
          />
        </div>

        {/* Selected feature setting panel */}
        <FeatureVerification>
          <div className="flex-[2] flex flex-col gap-y-[18px] mt-10">
            <div className="bg-[#303237] text-white rounded-xl flex-1 p-4">
              {selectedFeature ? (
                <SelectedFeatureComponent
                  feature={configurableFeatures[selectedFeature]}
                  settings={featureFlags}
                  refresh={refresh}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-white/60">
                  <Flask size={40} />
                  <p className="font-medium">Select an experimental feature</p>
                </div>
              )}
            </div>
          </div>
        </FeatureVerification>
      </div>
    </FeatureLayout>
  );
}

function FeatureLayout({ children }) {
  return (
    <div
      id="workspace-feature-settings-container"
      className="w-screen h-screen overflow-hidden bg-sidebar flex md:mt-0 mt-6"
    >
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] w-full h-full flex"
      >
        {children}
      </div>
    </div>
  );
}

function FeatureList({
  features = [],
  selectedFeature = null,
  handleClick = null,
  activeFeatures = [],
}) {
  if (Object.keys(features).length === 0) return null;

  return (
    <div
      className={`bg-white/5 text-white rounded-xl ${
        isMobile ? "w-full" : "min-w-[360px] w-fit"
      }`}
    >
      {Object.entries(features).map(([feature, settings], index) => (
        <div
          key={feature}
          className={`py-3 px-4 flex items-center justify-between ${
            index === 0 ? "rounded-t-xl" : ""
          } ${
            index === Object.keys(features).length - 1
              ? "rounded-b-xl"
              : "border-b border-white/10"
          } cursor-pointer transition-all duration-300  hover:bg-white/5 ${
            selectedFeature === feature ? "bg-white/10" : ""
          }`}
          onClick={() => handleClick?.(feature)}
        >
          <div className="text-sm font-light">{settings.title}</div>
          <div className="flex items-center gap-x-2">
            <div className="text-sm text-white/60 font-medium">
              {activeFeatures.includes(settings.key) ? "On" : "Off"}
            </div>
            <CaretRight size={14} weight="bold" className="text-white/80" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SelectedFeatureComponent({ feature, settings, refresh }) {
  const Component = feature?.component;
  return Component ? (
    <Component
      enabled={settings[feature.key]}
      feature={feature.key}
      onToggle={refresh}
    />
  ) : null;
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
                      href="https://docs.useanything.com/beta-preview/overview"
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
