export default function LocalUserSettingsHubRow({ onOpen }) {
  function openHub() {
    onOpen?.();
  }

  return (
    <button
      type="button"
      onClick={openHub}
      className="flex w-full items-center px-2 py-1 rounded cursor-pointer hover:bg-zinc-700 light:hover:bg-slate-200"
    >
      <span className="text-sm font-normal text-white light:text-slate-800 text-left">
        Local User Settings Hub
      </span>
    </button>
  );
}
