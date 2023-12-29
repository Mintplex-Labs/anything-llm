export default function LLMItem({ image, name, description }) {
  return (
    <div className="w-full hover:bg-white/10 p-2 rounded-md hover:cursor-pointer">
      <div className="flex gap-x-4 items-center">
        <img
          className="w-10 h-10 rounded-md"
          src={image}
          alt={`${name} logo`}
        />
        <div className="flex flex-col gap-y-1">
          <div className="text-white text-sm font-medium">{name}</div>
          <div className="text-white text-xs">{description}</div>
        </div>
      </div>
    </div>
  );
}
