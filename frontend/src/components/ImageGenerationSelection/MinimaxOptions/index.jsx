import { useState } from "react";
import { CaretDown, CaretUp, Info } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import ImageModelSelection from "../ImageModelSelection";
import ImageDimensionSelection, {
  initialDimension,
} from "../ImageDimensionSelection";

const RESOLUTIONS = ["1K", "2K", "4K"];

const INPUT_CLASSES =
  "border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5";

export default function MinimaxImageOptions({ settings }) {
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(
    initialDimension("minimax-imggen", settings)
  );
  // MiniMax rejects the Auto aspect ratio without prompt enhancement, so the
  // server always enables it there. The locked select has no name, so the
  // saved preference is left untouched for when a fixed ratio is picked.
  const enhancementRequired = aspectRatio === "auto";

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-wrap items-start gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            API Key
          </label>
          <input
            type="password"
            name="ImageGenerationMinimaxApiKey"
            className={INPUT_CLASSES}
            placeholder="MiniMax API Key"
            defaultValue={
              settings?.ImageGenerationMinimaxApiKey ? "*".repeat(20) : ""
            }
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <ImageModelSelection provider="minimax-imggen" settings={settings} />
        <ImageDimensionSelection
          provider="minimax-imggen"
          settings={settings}
          onChange={setAspectRatio}
        />
      </div>
      <div className="flex justify-start mt-4">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setShowAdvancedControls(!showAdvancedControls);
          }}
          className="border-none text-theme-text-primary hover:text-theme-text-secondary flex items-center text-sm"
        >
          {showAdvancedControls ? "Hide" : "Show"} advanced settings
          {showAdvancedControls ? (
            <CaretUp size={14} className="ml-1" />
          ) : (
            <CaretDown size={14} className="ml-1" />
          )}
        </button>
      </div>
      <div hidden={!showAdvancedControls}>
        <div className="w-full flex flex-wrap items-start gap-[36px] mt-4">
          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-3">
              Resolution
            </label>
            <select
              name="ImageGenerationMinimaxResolution"
              className={INPUT_CLASSES}
              defaultValue={settings?.ImageGenerationMinimaxResolution}
            >
              {RESOLUTIONS.map((resolution) => (
                <option key={resolution} value={resolution}>
                  {resolution}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col w-60">
            <div className="flex items-center gap-1 mb-3">
              <label className="text-white text-sm font-semibold">
                Prompt Enhancement
              </label>
              <Info
                size={18}
                className="text-theme-text-secondary cursor-pointer"
                data-tooltip-id="image-gen-minimax-prompt-enhancement"
              />
              <Tooltip
                id="image-gen-minimax-prompt-enhancement"
                place="top"
                delayShow={300}
                delayHide={800}
                clickable={true}
                className="tooltip !text-xs !opacity-100 z-99"
                style={{
                  maxWidth: "250px",
                  whiteSpace: "normal",
                  wordWrap: "break-word",
                }}
              >
                MiniMax rewrites your prompt into a more detailed one before
                generating the image. This can improve results, but the
                rewritten prompt is billed as extra input tokens.
                <br />
                <br />
                When disabled, your prompt is used exactly as written. MiniMax
                requires prompt enhancement for the Auto aspect ratio and for
                image edits, so it is always on for those.
              </Tooltip>
            </div>
            {enhancementRequired ? (
              <select
                className={`${INPUT_CLASSES} opacity-60 cursor-not-allowed`}
                value="true"
                disabled={true}
              >
                <option value="true">Enabled (required for Auto)</option>
              </select>
            ) : (
              <select
                name="ImageGenerationMinimaxPromptEnhancement"
                className={INPUT_CLASSES}
                defaultValue={settings?.ImageGenerationMinimaxPromptEnhancement}
              >
                <option value="false">Disabled</option>
                <option value="true">Enabled</option>
              </select>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
