import { useMessageDirection } from "@/hooks/useMessageDirection";

export function MessageDirection() {
  const { msgDirection, setMsgDirection } = useMessageDirection();
  return (
    <div className="flex flex-col gap-y-1 mt-4">
      <h2 className="text-base leading-6 font-bold text-white">
        Message Direction
      </h2>
      <p className="text-xs leading-[18px] font-base text-white/60">
        Select the message alignment mode for user input!
      </p>

      <div className="flex flex-row">
        <ItemDirection
          active={msgDirection === "left"}
          reverse={true}
          msg="Align bubbles to the left"
          onSelect={() => {
            setMsgDirection("left");
          }}
        />
        {/* Bottom section */}
        <ItemDirection
          active={msgDirection === "left_right"}
          reverse={false}
          msg="Message bubbles are distributed left and right"
          onSelect={() => {
            setMsgDirection("left_right");
          }}
        />
      </div>
    </div>
  );
}

function ItemDirection({ active, reverse, onSelect, msg }) {
  return (
    <div
      className={`flex:1 p-4 bg-white rounded-xl ml-10 border  ${active ? "border-[#32D583]" : ""}`}
    >
      {/* Chat messages container */}
      <div className="space-y-4 mb-4">
        {/* Left aligned message */}
        <div className="flex items-start gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
          <div className="bg-gray-100 rounded-2xl px-4 py-2">
            <p className="text-gray-700">This is a reply message</p>
          </div>
        </div>

        {/* Right aligned message */}
        <div
          className={`flex items-start justify-end gap-2 ${reverse ? "flex-row-reverse" : ""}`}
        >
          <div className="bg-blue-50 rounded-2xl px-4 py-2">
            <p className="text-gray-700">This is a user message</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
        </div>
        {/* Another left aligned message */}
        <div className="flex items-start gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
          <div className="bg-gray-100 rounded-2xl px-4 py-2">
            <p className="text-gray-700">A another reply message</p>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-xl">
        {active ? (
          <div
            className={`w-5 h-5 rounded-full border-white border-2 bg-[#32D583] flex-shrink-0`}
          />
        ) : (
          <div
            className={`w-4 h-4 rounded-full border-gray border bg-white flex-shrink-0`}
            onClick={onSelect}
          />
        )}
        <span className="text-gray-700">{msg}</span>
      </div>
    </div>
  );
}
