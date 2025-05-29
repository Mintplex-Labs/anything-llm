export default function LLMItem({
  name,
  value,
  image,
  description,
  checked,
  onClick,
}) {
  return (
    <div
      onClick={() => onClick(value)}
      className={`w-full p-3 rounded-xl hover:cursor-pointer transition-all duration-150 ease-out ${
        checked
          ? "bg-blue-50 border border-blue-200 shadow-sm"
          : "hover:bg-gray-50 border border-transparent"
      }`}
    >
      <input
        type="checkbox"
        value={value}
        className="peer hidden"
        checked={checked}
        readOnly={true}
        formNoValidate={true}
      />
      <div className="flex gap-x-4 items-center">
        <img
          src={image}
          alt={`${name} logo`}
          className="w-10 h-10 rounded-xl shadow-sm"
        />
        <div className="flex flex-col flex-1 min-w-0">
          <div
            className={`text-sm font-semibold truncate ${
              checked ? "text-blue-900" : "text-gray-900"
            }`}
          >
            {name}
          </div>
          <div
            className={`mt-1 text-xs line-clamp-2 ${
              checked ? "text-blue-700" : "text-gray-500"
            }`}
          >
            {description}
          </div>
        </div>
        {checked && (
          <div className="flex-shrink-0">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
