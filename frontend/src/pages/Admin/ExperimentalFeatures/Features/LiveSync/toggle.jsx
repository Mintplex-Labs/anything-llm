import System from "@/models/system";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import { ArrowSquareOut } from "@phosphor-icons/react";
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
    <div className="p-4">
      <div className="flex flex-col gap-y-6 max-w-[500px]">
        <div className="flex items-center justify-between">
          <h2 className="text-theme-text-primary text-md font-bold">
            Đồng bộ nội dung tài liệu tự động
          </h2>
          <Toggle size="lg" enabled={status} onChange={toggleFeatureFlag} />
        </div>
        <div className="flex flex-col space-y-4">
          <p className="text-theme-text-secondary text-sm">
            Bật khả năng chỉ định một tài liệu để được &quot;theo dõi&quot;.
            Nội dung của tài liệu được theo dõi sẽ được lấy và cập nhật định kỳ
            trong GOV AI VN168.
          </p>
          <p className="text-theme-text-secondary text-sm">
            Các tài liệu được theo dõi sẽ tự động cập nhật trong tất cả không
            gian làm việc có tham chiếu đến chúng, cùng thời điểm với lần cập
            nhật.
          </p>
          <p className="text-theme-text-secondary text-xs italic">
            Tính năng này chỉ áp dụng cho nội dung trên web, như trang web,
            Confluence, YouTube và tệp GitHub.
          </p>
        </div>
      </div>
      <div className="mt-8">
        <ul className="space-y-2">

          <li>
            <Link
              to={paths.experimental.liveDocumentSync.manage()}
              className="text-sm text-blue-400 light:text-blue-500 hover:underline"
            >
              Quản lý tài liệu được theo dõi &rarr;
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
