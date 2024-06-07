export default function ConnectorOption({
  slug,
  selectedConnector,
  setSelectedConnector,
  image,
  name,
  description,
}) {
  return (
    <button
      onClick={() => setSelectedConnector(slug)}
      className={`flex text-left gap-x-3.5 items-center py-2 px-4 hover:bg-white/10 ${
        selectedConnector === slug ? "bg-white/10" : ""
      } rounded-lg cursor-pointer w-full`}
    >
      <img src={image} alt={name} className="w-[40px] h-[40px] rounded-md" />
      <div className="flex flex-col">
        <div className="text-white font-bold text-[14px]">{name}</div>
        <div>
          <p className="text-[12px] text-white/60">{description}</p>
        </div>
      </div>
    </button>
  );
}
