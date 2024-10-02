import { useTheme } from "@/hooks/useTheme";

export default function ThemePreference() {
  const { theme, setTheme, availableThemes } = useTheme();

  return (
    <div className="flex flex-col gap-y-1 mt-4">
      <h2 className="text-base leading-6 font-bold text-white">
        Theme
      </h2>
      <p className="text-xs leading-[18px] font-base text-white/60">
        Select your preferred theme for the application.
      </p>
      <div className="flex items-center gap-x-4">
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="bg-zinc-900 w-fit mt-2 px-4 border-gray-500 text-white text-sm rounded-lg block py-2"
        >
          {Object.entries(availableThemes).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}