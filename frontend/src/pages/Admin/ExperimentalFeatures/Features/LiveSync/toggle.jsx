import System from "@/models/system";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import { useState } from "react";
import { Link } from "react-router-dom";
import Toggle from "@/components/lib/Toggle";

export default function LiveSyncToggle({ enabled = false, onToggle }) {
  const [status, setStatus] = useState(enabled);

  async function toggleFeatureFlag() {
    const updated =
      await System.experimentalFeatures.liveSync.toggleFeature(!status);
    if (!updated) {
      showToast("Không thể cập nhật trạng thái tính năng.", "error", {
        clear: true,
      });
      return false;
    }

    setStatus(!status);
    showToast(
      `Đồng bộ nội dung tài liệu trực tiếp đã được ${
        !status ? "bật" : "tắt"
      }.`,
      "success",
      { clear: true }
    );
    onToggle();
  }

  return (
    <div className="p-1 sm:p-2 md:p-4">
      <div className="flex flex-col gap-y-5 sm:gap-y-6 max-w-full md:max-w-[560px]">
        <div className="flex flex-col gap-y-3 sm:flex-row sm:items-center sm:justify-between sm:gap-x-4">
          <h2 className="text-theme-text-primary text-base sm:text-md font-bold leading-snug min-w-0">
            Đồng bộ nội dung tài liệu tự động
          </h2>
          <div className="shrink-0 self-start sm:self-auto">
            <Toggle size="lg" enabled={status} onChange={toggleFeatureFlag} />
          </div>
        </div>
        <div className="flex flex-col space-y-3 sm:space-y-4">
          <p className="text-theme-text-secondary text-sm leading-relaxed">
            Bật khả năng chỉ định một tài liệu để được &quot;theo dõi&quot;.
            Nội dung của tài liệu được theo dõi sẽ được lấy và cập nhật định kỳ
            trong GOV AI VN168.
          </p>
          <p className="text-theme-text-secondary text-sm leading-relaxed">
            Các tài liệu được theo dõi sẽ tự động cập nhật trong tất cả không
            gian làm việc có tham chiếu đến chúng, cùng thời điểm với lần cập
            nhật.
          </p>
          <p className="text-theme-text-secondary text-xs italic leading-relaxed">
            Tính năng này chỉ áp dụng cho nội dung trên web, như trang web,
            Confluence, YouTube và tệp GitHub.
          </p>
        </div>
      </div>
      <div className="mt-6 sm:mt-8">
        <ul className="space-y-2">
          <li>
            <Link
              to={paths.experimental.liveDocumentSync.manage()}
              className="inline-flex text-sm text-blue-400 light:text-blue-500 hover:underline break-words"
            >
              Quản lý tài liệu được theo dõi &rarr;
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
