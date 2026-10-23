import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";

/**
 * Lets a user pick a color palette. Picking the instance default clears the
 * choice so the user keeps following whatever the admin sets as the default.
 */
export default function PalettePicker() {
  const { t } = useTranslation();
  const { palette, setPalette, availablePalettes, instancePalettes } =
    useTheme();
  const instanceDefault =
    availablePalettes.find(({ key }) => key === instancePalettes.defaultPalette)
      ?.key ?? "default";

  if (instancePalettes.enforced)
    return (
      <p className="text-xs text-white/60 mt-2">
        {t("customization.items.palette.enforced")}
      </p>
    );

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      {availablePalettes.map(({ key, name, colors }) => (
        <PaletteButton
          key={key}
          name={name}
          colors={colors}
          selected={palette === key}
          isDefault={key === instanceDefault}
          onClick={() => setPalette(key === instanceDefault ? null : key)}
        />
      ))}
    </div>
  );
}

/**
 * A selectable palette. `actions` renders extra icon buttons inside the tile,
 * next to (not inside) the select button.
 */
export function PaletteButton({
  name,
  colors,
  selected,
  isDefault = false,
  onClick,
  actions = null,
}) {
  const { t } = useTranslation();
  return (
    <div
      className={`flex items-center rounded-lg bg-theme-settings-input-bg border ${
        selected
          ? "border-primary-button"
          : "border-transparent hover:border-theme-sidebar-border"
      }`}
    >
      <button
        type="button"
        aria-pressed={selected}
        onClick={onClick}
        className="flex items-center gap-x-2 py-2 px-3 text-sm text-white"
      >
        <PaletteSwatch colors={colors} />
        {name}
        {isDefault && (
          <span className="text-xs text-white/60">
            {t("customization.items.palette.default-badge")}
          </span>
        )}
      </button>
      {actions && (
        <div className="flex items-center gap-x-1 pr-2 -ml-1">{actions}</div>
      )}
    </div>
  );
}

export function PaletteSwatch({ colors }) {
  return (
    <span className="flex">
      {[colors.main, colors.accent].map((color, i) => (
        <span
          key={i}
          className="w-3.5 h-3.5 rounded-full border border-white/20 -ml-1 first:ml-0"
          style={{ backgroundColor: color }}
        />
      ))}
    </span>
  );
}
