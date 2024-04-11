export default function ResetCommand({ setShowing, sendCommand }) {
  return (
    <button
      onClick={() => {
        setShowing(false);
        sendCommand("/reset", true);
      }}
      className="w-full hover:cursor-pointer hover:bg-zinc-700 px-2 py-2 rounded-xl flex flex-col justify-start"
    >
      <div className="w-full flex-col text-left flex pointer-events-none">
        <div className="text-white text-sm font-bold">/reset</div>
        <div className="text-white text-opacity-60 text-sm">
          Clear your chat history and begin a new chat
        </div>
      </div>
    </button>
  );
}
