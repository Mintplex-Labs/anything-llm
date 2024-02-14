export default function VectorDBIdentifier({ workspace }) {
  return (
    <div>
      <h3 className="text-white text-sm font-semibold">
        Vector database identifier
      </h3>
      <p className="text-white text-opacity-60 text-xs font-medium py-1"> </p>
      <p className="text-white text-opacity-60 text-sm font-medium">
        {workspace?.slug}
      </p>
    </div>
  );
}
