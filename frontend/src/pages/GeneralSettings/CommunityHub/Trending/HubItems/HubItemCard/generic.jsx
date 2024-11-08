export default function GenericHubCard({ item }) {
  return (
    <div
      key={item.id}
      className="bg-zinc-800 rounded-lg p-3 hover:bg-zinc-700 transition-all duration-200"
    >
      <p className="text-white text-sm font-medium">{item.name}</p>
      <p className="text-white/60 text-xs mt-1">{item.description}</p>
      <div className="flex justify-end mt-2">
        <button
          className="text-primary-button hover:text-primary-button/80 text-xs"
          onClick={() => {
            /* TODO: Add import action */
          }}
        >
          Import →
        </button>
      </div>
    </div>
  );
}
