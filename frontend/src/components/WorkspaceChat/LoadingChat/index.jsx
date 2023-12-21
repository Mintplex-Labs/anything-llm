import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function LoadingChat() {
  const highlightColor = "#3D4147";
  const baseColor = "#2C2F35";
  return (
    <div className="transition-all duration-500 relative md:ml-[2px] md:mr-[8px] md:my-[16px] md:rounded-[26px] bg-main-gradient w-full h-full overflow-y-scroll">
      <Skeleton.default
        height="100px"
        width="100%"
        highlightColor={highlightColor}
        baseColor={baseColor}
        count={1}
        className="max-w-full md:max-w-[75%] p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6"
        containerClassName="flex justify-start"
      />
      <Skeleton.default
        height="100px"
        width={"45%"}
        baseColor={baseColor}
        highlightColor={highlightColor}
        count={1}
        className="max-w-full md:max-w-[75%] p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6"
        containerClassName="flex justify-end"
      />
      <Skeleton.default
        height="100px"
        width={"30%"}
        baseColor={baseColor}
        highlightColor={highlightColor}
        count={1}
        className="max-w-full md:max-w-[75%] p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6"
        containerClassName="flex justify-start"
      />
      <Skeleton.default
        height="100px"
        width={"25%"}
        baseColor={baseColor}
        highlightColor={highlightColor}
        count={1}
        className="max-w-full md:max-w-[75%] p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6"
        containerClassName="flex justify-end"
      />
      <Skeleton.default
        height="160px"
        width="100%"
        baseColor={baseColor}
        highlightColor={highlightColor}
        count={1}
        className="max-w-full md:max-w-[75%] p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6"
        containerClassName="flex justify-start"
      />
    </div>
  );
}
