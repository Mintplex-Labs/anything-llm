export default function VectorDBIdentifier({ workspace }) {
  return (
    <div>
      <h3 className="input-label">Vector database identifier</h3>
      <p className="text-white/60 text-xs font-medium py-1"> </p>
      <p className="text-white/60 text-sm">{workspace?.slug}</p>
    </div>
  );
}
