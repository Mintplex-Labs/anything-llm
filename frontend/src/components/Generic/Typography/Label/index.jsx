export default function Label({ label, description }) {
  return (
    <div className="flex flex-col">
      {label && (
        <label
          htmlFor="chatModel"
          className="block input-label text-white text-opacity-60 text-md font-medium py-1.5"
        >
          {label}
        </label>
      )}
      {description && (
        <p className="flex text-white text-opacity-60 text-sm font-medium py-1.5">
          {description}
        </p>
      )}
    </div>
  );
}
