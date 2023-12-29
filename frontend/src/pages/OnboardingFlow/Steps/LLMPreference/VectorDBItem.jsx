export default function VectorDBItem({ image, title, description }) {
  return (
    <div className="w-full">
      <div className="flex gap-x-4 items-center">
        <img
          className="w-10 h-10 rounded-md"
          src={image}
          alt={`${title} logo`}
        />
        <div className="flex flex-col gap-y-1">
          <div className="text-white text-sm font-medium">Chroma</div>
          <div className="text-white text-xs">
            The standard option for most non-commercial use. Provides both chat
            and embedding.
          </div>
        </div>
      </div>
    </div>
  );
}
