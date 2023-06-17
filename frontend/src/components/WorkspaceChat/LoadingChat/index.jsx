import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function LoadingChat() {
  return (
    <div
      style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
      className="transition-all duration-500 relative md:ml-[2px] md:mr-[8px] md:my-[16px] md:rounded-[26px] bg-white dark:bg-black-900 w-full md:min-w-[82%] p-[18px] h-full overflow-y-scroll"
    >
      <Skeleton.default
        height="100px"
        width="100%"
        baseColor={"#2a3a53"}
        highlightColor={"#395073"}
        count={1}
        className="max-w-full md:max-w-[75%] p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6"
        containerClassName="flex justify-start"
      />
      <Skeleton.default
        height="100px"
        width={isMobile ? "70%" : "45%"}
        baseColor={"#2a3a53"}
        highlightColor={"#395073"}
        count={1}
        className="max-w-full md:max-w-[75%] p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6"
        containerClassName="flex justify-end"
      />
      <Skeleton.default
        height="100px"
        width={isMobile ? "55%" : "30%"}
        baseColor={"#2a3a53"}
        highlightColor={"#395073"}
        count={1}
        className="max-w-full md:max-w-[75%] p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6"
        containerClassName="flex justify-start"
      />
      <Skeleton.default
        height="100px"
        width={isMobile ? "88%" : "25%"}
        baseColor={"#2a3a53"}
        highlightColor={"#395073"}
        count={1}
        className="max-w-full md:max-w-[75%] p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6"
        containerClassName="flex justify-end"
      />
      <Skeleton.default
        height="160px"
        width="100%"
        baseColor={"#2a3a53"}
        highlightColor={"#395073"}
        count={1}
        className="max-w-full md:max-w-[75%] p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6"
        containerClassName="flex justify-start"
      />
    </div>
  );
}
