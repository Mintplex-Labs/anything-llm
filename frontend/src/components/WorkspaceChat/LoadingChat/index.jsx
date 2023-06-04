import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function LoadingChat() {
  return (
    <div
      style={{ height: "calc(100% - 32px)" }}
      className="transition-all duration-500 relative ml-[2px] mr-[8px] my-[16px] rounded-[26px] bg-white dark:bg-black-900 min-w-[82%] p-[18px] h-full overflow-y-scroll"
    >
      <Skeleton.default
        height="100px"
        width="100%"
        baseColor={"#2a3a53"}
        highlightColor={"#395073"}
        count={1}
        className="max-w-[75%] p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6"
        containerClassName="flex justify-start"
      />
      <Skeleton.default
        height="100px"
        width="45%"
        baseColor={"#2a3a53"}
        highlightColor={"#395073"}
        count={1}
        className="max-w-[75%] p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6"
        containerClassName="flex justify-end"
      />
      <Skeleton.default
        height="100px"
        width="30%"
        baseColor={"#2a3a53"}
        highlightColor={"#395073"}
        count={1}
        className="max-w-[75%] p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6"
        containerClassName="flex justify-start"
      />
      <Skeleton.default
        height="100px"
        width="25%"
        baseColor={"#2a3a53"}
        highlightColor={"#395073"}
        count={1}
        className="max-w-[75%] p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6"
        containerClassName="flex justify-end"
      />
      <Skeleton.default
        height="160px"
        width="100%"
        baseColor={"#2a3a53"}
        highlightColor={"#395073"}
        count={1}
        className="max-w-[75%] p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6"
        containerClassName="flex justify-start"
      />
    </div>
  );
}
