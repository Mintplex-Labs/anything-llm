const PROVIDER_DIMENSIONS = {
  "openai-imggen": ["auto", "1024x1024", "1024x1536", "1536x1024"],
  "lemonade-imggen": ["256x256", "512x512", "768x768", "1024x1024"],
};
const DEFAULT_DIMENSIONS = ["512x512", "1024x1024"];

const INPUT_CLASSES =
  "border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5";

export default function ImageDimensionSelection({ provider, settings }) {
  const dimensions = PROVIDER_DIMENSIONS[provider] || DEFAULT_DIMENSIONS;
  const defaultValue =
    settings?.ImageGenerationDimensions &&
    dimensions.includes(settings.ImageGenerationDimensions)
      ? settings.ImageGenerationDimensions
      : dimensions[0];

  return (
    <div className="flex flex-col w-60">
      <label className="text-white text-sm font-semibold block mb-3">
        Image Dimensions
      </label>
      <select
        name="ImageGenerationDimensions"
        className={INPUT_CLASSES}
        defaultValue={defaultValue}
      >
        {dimensions.map((dim) => (
          <option key={dim} value={dim}>
            {dim}
          </option>
        ))}
      </select>
    </div>
  );
}
