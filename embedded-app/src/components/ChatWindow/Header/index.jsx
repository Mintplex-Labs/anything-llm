import AnythingLLMLogo from "@/assets/anything-llm-dark.png";

export default function ChatWindowHeader({ closeChat }) {
  return (
    <div className="flex justify-between items-center">
      <img className="h-10" src={AnythingLLMLogo} alt="AnythingLLM Logo" />
      <button onClick={closeChat} className="text-xl font-bold">
        X
      </button>
    </div>
  );
}
