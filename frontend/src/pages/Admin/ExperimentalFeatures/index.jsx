import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import Admin from "@/models/admin";
import { FullScreenLoader } from "@/components/Preloader";
import { CaretLeft, CaretRight, Flask } from "@phosphor-icons/react";
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
  const [showFeaturePanel, setShowFeaturePanel] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      const { settings } = await Admin.systemPreferencesByFields([
        "feature_flags",
      ]);
      setFeatureFlags(settings?.feature_flags ?? {});
      setLoading(false);
    }
    fetchSettings();
  }, []);

  const refresh = async () => {
    const { settings } = await Admin.systemPreferencesByFields([
      "feature_flags",
    ]);
    setFeatureFlags(settings?.feature_flags ?? {});
  };

  const handleFeatureClick = (featureKey) => {
    const feature = configurableFeatures[featureKey];
    if (feature?.href) {
      window.location = feature.href;
      return;
    }
    setSelectedFeature(featureKey);
    if (isMobile) setShowFeaturePanel(true);
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

  if (isMobile) {
    return (
      <FeatureLayout>
        <FeatureVerification>
          <div className="flex flex-col w-full p-4 pt-10 min-h-0 overflow-hidden">
            {/* Feature list (hidden when detail open) */}
            <div
              hidden={showFeaturePanel}
              className="flex flex-col min-h-0 flex-1 overflow-hidden"
            >
              <div className="flex-none text-white flex items-center gap-x-2 mb-4">
                <Flask size={24} className="shrink-0" />
                <p className="text-lg font-medium">Tính năng thử nghiệm</p>
              </div>
              <div className="flex-1 overflow-y-auto pb-4 no-scroll">
                <div className="bg-theme-bg-secondary text-white rounded-xl w-full">
                  {Object.values(configurableFeatures).map((feature, index) => {
                    const isFirst = index === 0;
                    const isLast =
                      index === Object.values(configurableFeatures).length - 1;
                    return (
                      <FeatureItem
                        key={feature.key}
                        feature={feature}
                        isSelected={selectedFeature === feature.key}
                        isActive={featureFlags[feature.key]}
                        handleClick={handleFeatureClick}
                        borderClass={[
                          ...(isFirst ? ["rounded-t-xl"] : []),
                          ...(isLast
                            ? ["rounded-b-xl"]
                            : ["border-b border-white/10"]),
                        ].join(" ")}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Selected feature full-screen panel */}
            {showFeaturePanel && (
              <div className="fixed inset-0 w-full h-full bg-theme-bg-container z-30">
                <div className="flex flex-col h-full">
                  <div className="flex items-center p-4 pt-6 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowFeaturePanel(false)}
                      className="text-white/60 hover:text-white transition-colors duration-200"
                    >
                      <div className="flex items-center text-sky-400">
                        <CaretLeft size={24} />
                        <span>Quay lại</span>
                      </div>
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto px-4 pb-6 min-h-0">
                    <div className="bg-theme-bg-secondary text-white rounded-xl p-4 overflow-x-hidden">
                      {selectedFeature ? (
                        <SelectedFeatureComponent
                          feature={configurableFeatures[selectedFeature]}
                          settings={featureFlags}
                          refresh={refresh}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-white/60 gap-y-2">
                          <Flask size={40} />
                          <p className="font-medium text-center">
                            Chọn một tính năng thử nghiệm
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </FeatureVerification>
      </FeatureLayout>
    );
  }

  return (
    <FeatureLayout>
      <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-x-6 p-3 sm:p-4 mt-6 sm:mt-8 lg:mt-10 min-h-0 overflow-hidden">
        {/* Feature settings nav */}
        <div className="flex flex-col w-full lg:w-[300px] xl:w-[360px] lg:shrink-0 min-h-0 lg:h-[calc(100vh-90px)]">
          <div className="flex-none text-white flex items-center gap-x-2 mb-3 sm:mb-4">
            <Flask size={24} className="shrink-0" />
            <p className="text-base sm:text-lg font-medium">
              Tính năng thử nghiệm
            </p>
          </div>
          {/* Feature list */}
          <div className="flex-1 overflow-y-auto pr-0 lg:pr-2 pb-2 lg:pb-4 min-h-0">
            <div className="bg-theme-bg-secondary text-white rounded-xl w-full">
              {Object.values(configurableFeatures).map((feature, index) => {
                const isFirst = index === 0;
                const isLast =
                  index === Object.values(configurableFeatures).length - 1;
                return (
                  <FeatureItem
                    key={feature.key}
                    feature={feature}
                    isSelected={selectedFeature === feature.key}
                    isActive={featureFlags[feature.key]}
                    handleClick={handleFeatureClick}
                    borderClass={[
                      ...(isFirst ? ["rounded-t-xl"] : []),
                      ...(isLast
                        ? ["rounded-b-xl"]
                        : ["border-b border-white/10"]),
                    ].join(" ")}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected feature setting panel */}
        <FeatureVerification>
          <div className="flex-1 flex flex-col gap-y-4 lg:gap-y-[18px] min-h-0 lg:h-[calc(100vh-90px)] lg:mt-10">
            <div className="bg-theme-bg-secondary text-white rounded-xl flex-1 p-3 sm:p-4 overflow-y-auto overflow-x-hidden no-scroll min-h-[280px] lg:min-h-0">
              {selectedFeature ? (
                <SelectedFeatureComponent
                  feature={configurableFeatures[selectedFeature]}
                  settings={featureFlags}
                  refresh={refresh}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-white/60 gap-y-2 py-12">
                  <Flask size={40} />
                  <p className="font-medium text-center px-4">
                    Chọn một tính năng thử nghiệm
                  </p>
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
      className="w-screen h-screen overflow-hidden bg-theme-bg-container flex md:mt-0 mt-6"
    >
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] w-full h-full flex min-w-0"
      >
        {children}
      </div>
    </div>
  );
}

function FeatureItem({
  feature = {},
  isSelected = false,
  isActive = false,
  handleClick = () => {},
  borderClass = "border-b border-white/10",
}) {
  return (
    <div
      key={feature.key}
      className={`py-3 px-3 sm:px-4 flex items-center justify-between gap-x-3 cursor-pointer transition-all duration-300 hover:bg-white/5 ${borderClass} ${
        isSelected ? "bg-white/10 light:bg-theme-bg-sidebar" : ""
      }`}
      onClick={() => handleClick?.(feature.key)}
    >
      <div className="text-sm font-light min-w-0 break-words">
        {feature.title}
      </div>
      <div className="flex items-center gap-x-2 shrink-0">
        {feature.autoEnabled ? (
          <>
            <div className="text-sm text-theme-text-secondary font-medium">
              Bật
            </div>
            <div className="w-[14px]" />
          </>
        ) : (
          <>
            <div className="text-sm text-theme-text-secondary font-medium">
              {isActive ? "Bật" : "Tắt"}
            </div>
            <CaretRight
              size={14}
              weight="bold"
              className="text-theme-text-secondary"
            />
          </>
        )}
      </div>
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
        "Đã bật bộ tính năng thử nghiệm. Đang tải lại trang.",
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
          <div className="w-[min(100%,42rem)] max-h-[min(90dvh,720px)] mx-2 sm:mx-4 bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border overflow-hidden flex flex-col">
            <div className="relative p-4 sm:p-6 border-b rounded-t border-theme-modal-border shrink-0">
              <div className="flex items-start sm:items-center gap-2">
                <Flask
                  size={24}
                  className="text-theme-text-primary shrink-0 mt-0.5 sm:mt-0"
                />
                <h3 className="text-lg sm:text-xl font-semibold text-white leading-snug">
                  Điều khoản sử dụng tính năng thử nghiệm
                </h3>
              </div>
            </div>
            <form
              onSubmit={acceptTos}
              className="flex flex-col flex-1 min-h-0 overflow-hidden"
            >
              <div className="py-5 px-4 sm:py-7 sm:px-9 space-y-4 flex-col overflow-y-auto min-h-0">
                <div className="w-full text-white text-sm sm:text-md flex flex-col gap-y-4">
                  <p>
                    Các tính năng thử nghiệm của GOV AI VN168 là những tính năng
                    chúng tôi đang thử nghiệm và yêu cầu <b>tự nguyện bật</b>.
                    Chúng tôi sẽ chủ động thông báo hoặc cảnh báo về mọi rủi ro
                    tiềm ẩn (nếu có) trước khi bạn chấp thuận sử dụng bất kỳ
                    tính năng nào.
                  </p>

                  <div>
                    <p>
                      Việc sử dụng bất kỳ tính năng nào trên trang này có thể
                      dẫn đến, nhưng không giới hạn ở, các khả năng sau.
                    </p>
                    <ul className="list-disc ml-5 sm:ml-6 text-xs sm:text-sm font-mono mt-2 space-y-1">
                      <li>Mất dữ liệu.</li>
                      <li>Thay đổi chất lượng kết quả.</li>
                      <li>Tăng dung lượng lưu trữ.</li>
                      <li>Tăng mức tiêu thụ tài nguyên.</li>
                      <li>
                        Tăng chi phí hoặc mức sử dụng nhà cung cấp LLM hoặc
                        embedding được kết nối.
                      </li>
                      <li>
                        Lỗi hoặc sự cố tiềm ẩn khi sử dụng GOV AI VN168.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p>
                      Việc sử dụng tính năng thử nghiệm cũng đi kèm với các
                      điều kiện không đầy đủ sau.
                    </p>
                    <ul className="list-disc ml-5 sm:ml-6 text-xs sm:text-sm font-mono mt-2 space-y-1">
                      <li>
                        Tính năng có thể không còn tồn tại trong các bản cập
                        nhật tương lai.
                      </li>
                      <li>Tính năng đang sử dụng hiện chưa ổn định.</li>
                      <li>
                        Tính năng có thể không khả dụng trong các phiên bản,
                        cấu hình hoặc gói đăng ký tương lai của GOV AI VN168.
                      </li>
                      <li>
                        Cài đặt quyền riêng tư của bạn <b>sẽ được tôn trọng</b>{" "}
                        khi sử dụng bất kỳ tính năng beta nào.
                      </li>
                      <li>
                        Các điều kiện này có thể thay đổi trong các bản cập nhật
                        tương lai.
                      </li>
                    </ul>
                  </div>

                  <p>
                    Truy cập các tính năng yêu cầu bạn chấp thuận hộp thoại này.
                  </p>
                </div>
              </div>
              <div className="flex flex-col-reverse sm:flex-row w-full justify-between items-stretch sm:items-center gap-2 p-4 sm:p-6 border-t border-theme-modal-border rounded-b shrink-0">
                <a
                  href={paths.home()}
                  className="transition-all duration-300 bg-transparent text-white hover:bg-red-500/50 light:hover:bg-red-300/50 px-4 py-2.5 sm:py-2 rounded-lg text-sm border border-theme-modal-border text-center"
                >
                  Từ chối & đóng
                </a>
                <button
                  type="submit"
                  className="transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2.5 sm:py-2 rounded-lg text-sm border border-theme-modal-border"
                >
                  Tôi đã hiểu
                </button>
              </div>
            </form>
          </div>
        </ModalWrapper>
        {children}
      </>
    );
  }
  return <>{children}</>;
}
